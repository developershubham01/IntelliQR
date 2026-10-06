import { z } from "zod";
import { createRouter, authedQuery } from "./middleware.js";
import { qrCodes, qrScans } from "../db/schema.js";
import type { QRStyleConfig } from "../db/schema.js";
import { getDb } from "./queries/connection.js";
import { eq, desc, and, gte } from "drizzle-orm";
import crypto from "crypto";
import { isValidRedirectUrl } from "./redirect-handler.js";

// Cryptographically secure 8-character Base62 generator (URL-safe, unguessable)
const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function generateCryptographicShortCode(length = 8): string {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += BASE62_CHARS[bytes[i] % 62];
  }
  return result;
}

export const qrRouter = createRouter({
  list: authedQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
          type: z.enum(["all", "dynamic", "static"]).default("all").optional(),
          status: z.enum(["all", "active", "paused", "expired"]).default("all").optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;

      const conditions = [eq(qrCodes.userId, ctx.user.id)];

      if (input?.type === "dynamic") {
        conditions.push(eq(qrCodes.isDynamic, true));
      } else if (input?.type === "static") {
        conditions.push(eq(qrCodes.isDynamic, false));
      }

      if (input?.status && input.status !== "all") {
        conditions.push(eq(qrCodes.status, input.status as "active" | "paused" | "expired"));
      }

      const allUserCodes = await db
        .select()
        .from(qrCodes)
        .where(and(...conditions))
        .orderBy(desc(qrCodes.createdAt))
        .limit(limit)
        .offset(offset);

      // Filter by search term if provided
      let items = allUserCodes;
      if (input?.search?.trim()) {
        const query = input.search.toLowerCase().trim();
        items = allUserCodes.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            (item.destinationUrl && item.destinationUrl.toLowerCase().includes(query)) ||
            (item.shortId && item.shortId.toLowerCase().includes(query))
        );
      }

      return { items, total: items.length };
    }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(qrCodes)
        .where(and(eq(qrCodes.id, input.id), eq(qrCodes.userId, ctx.user.id)))
        .limit(1);

      if (rows.length === 0) {
        throw new Error("QR Code not found or access denied.");
      }

      return rows[0];
    }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        type: z.string().min(1).max(50),
        content: z.string().min(1),
        destinationUrl: z.string().optional(),
        data: z.record(z.string(), z.unknown()).optional(),
        style: z.record(z.string(), z.unknown()).optional(),
        imageUrl: z.string().optional(),
        svgContent: z.string().optional(),
        isDynamic: z.boolean().default(false),
        expiresAt: z.string().datetime().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      let shortId: string | null = null;
      let finalDestination = (input.destinationUrl || input.content).trim();

      if (input.isDynamic) {
        // Validate destination URL security
        if (!isValidRedirectUrl(finalDestination)) {
          // If domain format without protocol, prepend https://
          if (/^[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(finalDestination)) {
            finalDestination = `https://${finalDestination}`;
          } else {
            throw new Error("Invalid destination URL. Destination must be a valid http:// or https:// address.");
          }
        }

        // Generate a cryptographically secure, unique shortId
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 5) {
          const candidate = generateCryptographicShortCode(8);
          const existing = await db
            .select({ id: qrCodes.id })
            .from(qrCodes)
            .where(eq(qrCodes.shortId, candidate))
            .limit(1);

          if (existing.length === 0) {
            shortId = candidate;
            isUnique = true;
          }
          attempts++;
        }

        if (!shortId) {
          throw new Error("Failed to generate unique short code. Please try again.");
        }
      }

      const result = await db
        .insert(qrCodes)
        .values({
          userId: ctx.user.id,
          name: input.name,
          type: input.type,
          content: input.content,
          destinationUrl: input.isDynamic ? finalDestination : null,
          data: input.data as Record<string, unknown> | null,
          style: input.style as unknown as QRStyleConfig | null,
          imageUrl: input.imageUrl,
          svgContent: input.svgContent,
          isDynamic: input.isDynamic,
          shortId: shortId,
          status: "active",
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        })
        .returning({ id: qrCodes.id, shortId: qrCodes.shortId });

      return {
        id: result[0].id,
        shortId: result[0].shortId,
        success: true,
      };
    }),

  updateDestination: authedQuery
    .input(
      z.object({
        id: z.number(),
        destinationUrl: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let targetUrl = input.destinationUrl.trim();

      // Validate URL protocol safety
      if (!isValidRedirectUrl(targetUrl)) {
        if (/^[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(targetUrl)) {
          targetUrl = `https://${targetUrl}`;
        } else {
          throw new Error("Invalid destination URL. Must be a valid web address starting with http:// or https://.");
        }
      }

      const db = getDb();

      // Check ownership
      const existing = await db
        .select()
        .from(qrCodes)
        .where(and(eq(qrCodes.id, input.id), eq(qrCodes.userId, ctx.user.id)))
        .limit(1);

      if (existing.length === 0) {
        throw new Error("QR Code not found or you do not have permission to edit it.");
      }

      if (!existing[0].isDynamic) {
        throw new Error("This is a Static QR Code. Destination cannot be changed without regenerating.");
      }

      await db
        .update(qrCodes)
        .set({
          destinationUrl: targetUrl,
          content: targetUrl,
          updatedAt: new Date(),
        })
        .where(eq(qrCodes.id, input.id));

      return {
        success: true,
        destinationUrl: targetUrl,
        message: "Destination updated successfully. Your existing QR code will now redirect to the new destination.",
      };
    }),

  updateStatus: authedQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["active", "paused"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(qrCodes)
        .where(and(eq(qrCodes.id, input.id), eq(qrCodes.userId, ctx.user.id)))
        .limit(1);

      if (existing.length === 0) {
        throw new Error("QR Code not found or access denied.");
      }

      await db
        .update(qrCodes)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(qrCodes.id, input.id));

      return { success: true, status: input.status };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Verify ownership
      const existing = await db
        .select()
        .from(qrCodes)
        .where(and(eq(qrCodes.id, input.id), eq(qrCodes.userId, ctx.user.id)))
        .limit(1);

      if (existing.length === 0) {
        throw new Error("QR Code not found or access denied.");
      }

      // Delete associated scan analytics first
      await db.delete(qrScans).where(eq(qrScans.qrCodeId, input.id));

      // Delete QR code
      await db.delete(qrCodes).where(eq(qrCodes.id, input.id));

      return { success: true };
    }),

  toggleFavorite: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(qrCodes)
        .where(and(eq(qrCodes.id, input.id), eq(qrCodes.userId, ctx.user.id)))
        .limit(1);

      if (existing.length === 0) {
        throw new Error("QR Code not found.");
      }

      await db
        .update(qrCodes)
        .set({ isFavorite: !existing[0].isFavorite })
        .where(eq(qrCodes.id, input.id));

      return { success: true, isFavorite: !existing[0].isFavorite };
    }),

  stats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const items = await db
      .select()
      .from(qrCodes)
      .where(eq(qrCodes.userId, ctx.user.id));

    const dynamicItems = items.filter((item) => item.isDynamic);
    const activeDynamic = dynamicItems.filter((item) => item.status === "active");

    return {
      totalGenerated: items.length,
      totalDownloads: items.reduce((sum, item) => sum + (item.downloadCount ?? 0), 0),
      totalFavorites: items.filter((item) => item.isFavorite).length,
      totalDynamic: dynamicItems.length,
      activeDynamic: activeDynamic.length,
      totalScans: items.reduce((sum, item) => sum + (item.scanCount ?? 0), 0),
    };
  }),

  analytics: authedQuery
    .input(
      z.object({
        id: z.number(),
        range: z.enum(["today", "7d", "30d", "90d", "all"]).default("30d"),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();

      // Check ownership
      const qrList = await db
        .select()
        .from(qrCodes)
        .where(and(eq(qrCodes.id, input.id), eq(qrCodes.userId, ctx.user.id)))
        .limit(1);

      if (qrList.length === 0) {
        throw new Error("QR Code not found or access denied.");
      }

      const qr = qrList[0];

      // Calculate date threshold based on filter
      const now = new Date();
      let startDate: Date | null = null;
      if (input.range === "today") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (input.range === "7d") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (input.range === "30d") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (input.range === "90d") {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }

      // Fetch all scans for this QR
      const scanConditions = [eq(qrScans.qrCodeId, qr.id)];
      if (startDate) {
        scanConditions.push(gte(qrScans.scannedAt, startDate));
      }

      const scans = await db
        .select()
        .from(qrScans)
        .where(and(...scanConditions))
        .orderBy(desc(qrScans.scannedAt));

      // Deduplication: unique visitors by visitorHash
      const uniqueHashes = new Set(scans.map((s) => s.visitorHash || s.ipAddress || s.id));
      const uniqueScans = uniqueHashes.size;

      // Time breakdown
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const todayScans = scans.filter((s) => new Date(s.scannedAt) >= oneDayAgo).length;
      const weekScans = scans.filter((s) => new Date(s.scannedAt) >= sevenDaysAgo).length;
      const monthScans = scans.filter((s) => new Date(s.scannedAt) >= thirtyDaysAgo).length;

      // Distributions
      const devicesMap: Record<string, number> = {};
      const browsersMap: Record<string, number> = {};
      const osMap: Record<string, number> = {};
      const countriesMap: Record<string, number> = {};
      const citiesMap: Record<string, number> = {};
      const referrersMap: Record<string, number> = {};
      const timelineMap: Record<string, number> = {};

      for (const s of scans) {
        // Device
        const dev = s.device || "Unknown";
        devicesMap[dev] = (devicesMap[dev] || 0) + 1;

        // Browser
        const br = s.browser || "Unknown";
        browsersMap[br] = (browsersMap[br] || 0) + 1;

        // OS
        const o = s.os || "Unknown";
        osMap[o] = (osMap[o] || 0) + 1;

        // Country
        const c = s.country || "Unknown";
        countriesMap[c] = (countriesMap[c] || 0) + 1;

        // City
        if (s.city) {
          citiesMap[s.city] = (citiesMap[s.city] || 0) + 1;
        }

        // Referrer
        const refName = s.referrer
          ? (() => {
              try {
                return new URL(s.referrer).hostname;
              } catch {
                return s.referrer;
              }
            })()
          : "Direct / QR Scanner";
        referrersMap[refName] = (referrersMap[refName] || 0) + 1;

        // Timeline (YYYY-MM-DD)
        const dateKey = new Date(s.scannedAt).toISOString().slice(0, 10);
        timelineMap[dateKey] = (timelineMap[dateKey] || 0) + 1;
      }

      // Convert distributions to sorted array
      const toSortedArray = (map: Record<string, number>, limit = 8) =>
        Object.entries(map)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);

      const scansOverTime = Object.entries(timelineMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        qr: {
          id: qr.id,
          name: qr.name,
          type: qr.type,
          shortId: qr.shortId,
          destinationUrl: qr.destinationUrl || qr.content,
          status: qr.status,
          isDynamic: qr.isDynamic,
          createdAt: qr.createdAt,
          updatedAt: qr.updatedAt,
        },
        totalScans: scans.length,
        uniqueScans,
        todayScans,
        weekScans,
        monthScans,
        scansOverTime,
        deviceDistribution: toSortedArray(devicesMap),
        browserDistribution: toSortedArray(browsersMap),
        osDistribution: toSortedArray(osMap),
        countryDistribution: toSortedArray(countriesMap),
        cityDistribution: toSortedArray(citiesMap),
        referrerDistribution: toSortedArray(referrersMap),
      };
    }),
});
