import { z } from "zod";
import { createRouter, authedQuery } from "./middleware.js";
import { qrFolders, qrCodes } from "../db/schema.js";
import { getDb } from "./queries/connection.js";
import { eq, and, desc } from "drizzle-orm";

export const folderRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const folders = await db
      .select()
      .from(qrFolders)
      .where(eq(qrFolders.userId, ctx.user.id))
      .orderBy(desc(qrFolders.createdAt));

    return folders;
  }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        color: z.string().default("#4F46E5"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const created = await db
        .insert(qrFolders)
        .values({
          userId: ctx.user.id,
          name: input.name.trim(),
          color: input.color,
        })
        .returning();

      return created[0];
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      // Set folderId to null for all QR codes in this folder first
      await db
        .update(qrCodes)
        .set({ folderId: null })
        .where(and(eq(qrCodes.folderId, input.id), eq(qrCodes.userId, ctx.user.id)));

      await db
        .delete(qrFolders)
        .where(and(eq(qrFolders.id, input.id), eq(qrFolders.userId, ctx.user.id)));

      return { success: true };
    }),

  moveToFolder: authedQuery
    .input(
      z.object({
        qrCodeId: z.number(),
        folderId: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(qrCodes)
        .set({ folderId: input.folderId })
        .where(and(eq(qrCodes.id, input.qrCodeId), eq(qrCodes.userId, ctx.user.id)));

      return { success: true };
    }),
});
