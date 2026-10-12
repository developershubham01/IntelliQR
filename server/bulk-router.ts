import { z } from "zod";
import { createRouter, authedQuery } from "./middleware.js";
import { qrCodes, bulkJobs } from "../db/schema.js";
import { getDb } from "./queries/connection.js";
import { eq, desc, and, count } from "drizzle-orm";
import crypto from "crypto";
import { isValidRedirectUrl } from "./redirect-handler.js";
import { getUserSubscriptionDetails } from "./queries/billing.js";

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function generateCryptographicShortCode(length = 8): string {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += BASE62_CHARS[bytes[i] % 62];
  }
  return result;
}

export const bulkRouter = createRouter({
  // Validate rows before running generation
  validateBatch: authedQuery
    .input(
      z.object({
        rows: z.array(
          z.object({
            row: z.number(),
            name: z.string().optional(),
            type: z.string().default("website"),
            content: z.string(),
            isDynamic: z.boolean().default(false),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userSub = await getUserSubscriptionDetails(ctx.user.id);
      const isProOrAbove = userSub?.tier === "pro" || userSub?.tier === "business" || userSub?.tier === "enterprise";

      // Maximum rows limit based on plan
      const maxRowsAllowed = userSub?.tier === "business" ? 1000 : isProOrAbove ? 200 : 25;

      if (input.rows.length > maxRowsAllowed) {
        throw new Error(
          `Batch size of ${input.rows.length} exceeds the maximum allowed ${maxRowsAllowed} rows for your ${userSub?.tier.toUpperCase() || "FREE"} plan.`
        );
      }

      // Check current dynamic QR count
      const dynamicRowsCount = input.rows.filter((r) => r.isDynamic).length;
      if (dynamicRowsCount > 0) {
        const maxDynamicQRs = userSub?.limits.maxDynamicQRs ?? 3;
        const currentCountRows = await db
          .select({ total: count() })
          .from(qrCodes)
          .where(and(eq(qrCodes.userId, ctx.user.id), eq(qrCodes.isDynamic, true)));
        const currentDynamic = Number(currentCountRows[0]?.total || 0);

        if (currentDynamic + dynamicRowsCount > maxDynamicQRs) {
          throw new Error(
            `Creating ${dynamicRowsCount} dynamic QR codes would exceed your limit (${currentDynamic}/${maxDynamicQRs}). Please switch some rows to static or upgrade your plan.`
          );
        }
      }

      const errors: Array<{ row: number; error: string }> = [];
      const validRows: typeof input.rows = [];

      for (const row of input.rows) {
        const content = (row.content || "").trim();
        if (!content) {
          errors.push({ row: row.row, error: "Content/Destination URL cannot be empty." });
          continue;
        }

        if (row.isDynamic && !isValidRedirectUrl(content)) {
          if (!/^[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(content)) {
            errors.push({ row: row.row, error: "Invalid destination URL for dynamic QR code." });
            continue;
          }
        }

        validRows.push(row);
      }

      return {
        totalRows: input.rows.length,
        validCount: validRows.length,
        errorCount: errors.length,
        errors,
        maxRowsAllowed,
      };
    }),

  // Execute Batch Processing
  processBatch: authedQuery
    .input(
      z.object({
        jobName: z.string().min(1).max(255).default("Bulk Batch Generation"),
        folderId: z.number().optional(),
        rows: z.array(
          z.object({
            row: z.number(),
            name: z.string().optional(),
            type: z.string().default("website"),
            content: z.string(),
            isDynamic: z.boolean().default(false),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userSub = await getUserSubscriptionDetails(ctx.user.id);
      const isProOrAbove = userSub?.tier === "pro" || userSub?.tier === "business" || userSub?.tier === "enterprise";
      const maxRowsAllowed = userSub?.tier === "business" ? 1000 : isProOrAbove ? 200 : 25;

      if (input.rows.length > maxRowsAllowed) {
        throw new Error(`Batch size exceeds limit of ${maxRowsAllowed} items.`);
      }

      const processedItems: Array<{
        row: number;
        name: string;
        type: string;
        content: string;
        shortId?: string;
        status: "success" | "error";
        error?: string;
      }> = [];

      const errorLogs: string[] = [];
      let successCount = 0;
      let failedCount = 0;

      for (const item of input.rows) {
        try {
          const content = (item.content || "").trim();
          if (!content) {
            throw new Error("Empty content.");
          }

          let shortId: string | null = null;
          let destinationUrl: string | null = null;

          if (item.isDynamic) {
            let target = content;
            if (!isValidRedirectUrl(target)) {
              if (/^[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(target)) {
                target = `https://${target}`;
              } else {
                throw new Error("Invalid URL scheme.");
              }
            }
            destinationUrl = target;
            shortId = generateCryptographicShortCode(8);
          }

          const qrName = (item.name || "").trim() || `Bulk-${item.type}-${item.row}`;

          const created = await db
            .insert(qrCodes)
            .values({
              userId: ctx.user.id,
              folderId: input.folderId ?? null,
              name: qrName,
              type: item.type,
              content: shortId ? `${process.env.APP_URL || "https://intelli-qr.vercel.app"}/q/${shortId}` : content,
              destinationUrl,
              isDynamic: item.isDynamic,
              shortId,
              status: "active",
            })
            .returning({ id: qrCodes.id, shortId: qrCodes.shortId });

          processedItems.push({
            row: item.row,
            name: qrName,
            type: item.type,
            content: shortId ? `${process.env.APP_URL || "https://intelli-qr.vercel.app"}/q/${shortId}` : content,
            shortId: created[0].shortId || undefined,
            status: "success",
          });
          successCount++;
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : "Generation failed";
          errorLogs.push(`Row ${item.row}: ${errMsg}`);
          processedItems.push({
            row: item.row,
            name: item.name || `Row-${item.row}`,
            type: item.type,
            content: item.content,
            status: "error",
            error: errMsg,
          });
          failedCount++;
        }
      }

      // Record job in bulkJobs table
      const jobRecord = await db
        .insert(bulkJobs)
        .values({
          userId: ctx.user.id,
          name: input.jobName,
          status: failedCount === 0 ? "completed" : successCount > 0 ? "completed" : "failed",
          totalCount: input.rows.length,
          processedCount: successCount,
          failedCount,
          errorLog: errorLogs,
          items: processedItems,
        })
        .returning();

      return {
        jobId: jobRecord[0].id,
        status: jobRecord[0].status,
        totalCount: input.rows.length,
        successCount,
        failedCount,
        items: processedItems,
      };
    }),

  // User Bulk Jobs History
  listJobs: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const jobs = await db
      .select()
      .from(bulkJobs)
      .where(eq(bulkJobs.userId, ctx.user.id))
      .orderBy(desc(bulkJobs.createdAt))
      .limit(30);

    return jobs;
  }),
});
