import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "./middleware.js";
import { landingPages } from "../db/schema.js";
import { getDb } from "./queries/connection.js";
import { eq, desc, and, sql } from "drizzle-orm";
import crypto from "crypto";

// Generate clean URL-safe slug
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
  const randomSuffix = crypto.randomBytes(3).toString("hex");
  return `${base || "page"}-${randomSuffix}`;
}

export const landingRouter = createRouter({
  // Public fetch for scanning visitor
  getBySlug: publicQuery
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(landingPages)
        .where(eq(landingPages.slug, input.slug))
        .limit(1);

      if (rows.length === 0) {
        throw new Error("Landing page not found.");
      }

      const page = rows[0];

      // Increment view count asynchronously
      db.update(landingPages)
        .set({ viewCount: sql`COALESCE(${landingPages.viewCount}, 0) + 1` })
        .where(eq(landingPages.id, page.id))
        .execute()
        .catch(() => {});

      return page;
    }),

  // User dashboard list
  listMy: authedQuery
    .input(
      z
        .object({
          industry: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(landingPages.userId, ctx.user.id)];
      if (input?.industry && input.industry !== "all") {
        conditions.push(eq(landingPages.industry, input.industry));
      }

      const items = await db
        .select()
        .from(landingPages)
        .where(and(...conditions))
        .orderBy(desc(landingPages.createdAt))
        .limit(input?.limit ?? 50);

      return { items, total: items.length };
    }),

  // Create new landing page
  create: authedQuery
    .input(
      z.object({
        industry: z.string().min(1),
        type: z.string().min(1),
        title: z.string().min(1).max(255),
        subtitle: z.string().optional(),
        heroImage: z.string().optional(),
        logoUrl: z.string().optional(),
        content: z.record(z.string(), z.unknown()),
        theme: z
          .object({
            primaryColor: z.string().default("#4F46E5"),
            layout: z.string().default("modern"),
            dark: z.boolean().default(false).optional(),
          })
          .optional(),
        contactInfo: z.record(z.string(), z.unknown()).optional(),
        actionButtons: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
              icon: z.string().optional(),
              type: z.string().optional(),
            })
          )
          .optional(),
        qrCodeId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const slug = generateSlug(input.title);

      const inserted = await db
        .insert(landingPages)
        .values({
          userId: ctx.user.id,
          qrCodeId: input.qrCodeId ?? null,
          slug,
          industry: input.industry,
          type: input.type,
          title: input.title,
          subtitle: input.subtitle,
          heroImage: input.heroImage,
          logoUrl: input.logoUrl,
          content: input.content,
          theme: input.theme ?? { primaryColor: "#4F46E5", layout: "modern" },
          contactInfo: input.contactInfo ?? {},
          actionButtons: input.actionButtons ?? [],
          isPublished: true,
        })
        .returning();

      return inserted[0];
    }),

  // Update existing landing page
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        subtitle: z.string().optional(),
        heroImage: z.string().optional(),
        logoUrl: z.string().optional(),
        content: z.record(z.string(), z.unknown()).optional(),
        theme: z
          .object({
            primaryColor: z.string(),
            layout: z.string(),
            dark: z.boolean().optional(),
          })
          .optional(),
        contactInfo: z.record(z.string(), z.unknown()).optional(),
        actionButtons: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
              icon: z.string().optional(),
              type: z.string().optional(),
            })
          )
          .optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(landingPages)
        .where(and(eq(landingPages.id, input.id), eq(landingPages.userId, ctx.user.id)))
        .limit(1);

      if (existing.length === 0) {
        throw new Error("Landing page not found or access denied.");
      }

      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (input.title !== undefined) updateData.title = input.title;
      if (input.subtitle !== undefined) updateData.subtitle = input.subtitle;
      if (input.heroImage !== undefined) updateData.heroImage = input.heroImage;
      if (input.logoUrl !== undefined) updateData.logoUrl = input.logoUrl;
      if (input.content !== undefined) updateData.content = input.content;
      if (input.theme !== undefined) updateData.theme = input.theme;
      if (input.contactInfo !== undefined) updateData.contactInfo = input.contactInfo;
      if (input.actionButtons !== undefined) updateData.actionButtons = input.actionButtons;
      if (input.isPublished !== undefined) updateData.isPublished = input.isPublished;

      const updated = await db
        .update(landingPages)
        .set(updateData)
        .where(eq(landingPages.id, input.id))
        .returning();

      return updated[0];
    }),

  // Delete landing page
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(landingPages)
        .where(and(eq(landingPages.id, input.id), eq(landingPages.userId, ctx.user.id)))
        .limit(1);

      if (existing.length === 0) {
        throw new Error("Landing page not found or access denied.");
      }

      await db.delete(landingPages).where(eq(landingPages.id, input.id));
      return { success: true };
    }),
});
