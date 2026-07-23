import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware.js";
import { contacts } from "../db/schema.js";
import { getDb } from "./queries/connection.js";
import { desc, eq } from "drizzle-orm";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email(),
        subject: z.string().min(1).max(255),
        message: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contacts).values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      });
      return { success: true };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    const items = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
    return items;
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(contacts)
        .set({ status: input.status })
        .where(eq(contacts.id, input.id));
      return { success: true };
    }),
});
