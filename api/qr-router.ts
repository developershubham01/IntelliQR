import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { qrCodes } from "@db/schema";
import type { QRStyleConfig } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq, desc, and } from "drizzle-orm";

export const qrRouter = createRouter({
  list: authedQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;

      const items = await db
        .select()
        .from(qrCodes)
        .where(eq(qrCodes.userId, ctx.user.id))
        .orderBy(desc(qrCodes.createdAt))
        .limit(limit)
        .offset(offset);

      const total = await db
        .select()
        .from(qrCodes)
        .where(eq(qrCodes.userId, ctx.user.id));

      return { items, total: total.length };
    }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        type: z.string().min(1).max(50),
        content: z.string().min(1),
        data: z.record(z.string(), z.unknown()).optional(),
        style: z.record(z.string(), z.unknown()).optional(),
        imageUrl: z.string().optional(),
        svgContent: z.string().optional(),
        isDynamic: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      let shortId = null;
      
      if (input.isDynamic) {
        // Simple 8-char hex string for shortId
        shortId = Math.random().toString(16).substring(2, 10);
      }

      const result = await db.insert(qrCodes).values({
        userId: ctx.user.id,
        name: input.name,
        type: input.type,
        content: input.content,
        data: input.data as Record<string, unknown> | null,
        style: input.style as unknown as QRStyleConfig | null,
        imageUrl: input.imageUrl,
        svgContent: input.svgContent,
        isDynamic: input.isDynamic,
        shortId: shortId,
      }).returning({ id: qrCodes.id });
      return { id: result[0].id, success: true, shortId };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(qrCodes)
        .where(and(eq(qrCodes.id, input.id), eq(qrCodes.userId, ctx.user.id)));
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
        return { success: false, error: "Not found" };
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

    return {
      totalGenerated: items.length,
      totalDownloads: items.reduce((sum, item) => sum + (item.downloadCount ?? 0), 0),
      totalFavorites: items.filter((item) => item.isFavorite).length,
    };
  }),
});
