import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware.js";
import { contacts } from "../db/schema.js";
import { getDb } from "./queries/connection.js";
import { desc, eq } from "drizzle-orm";
import nodemailer from "nodemailer";

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

      // Send Email Notification
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // true for port 465
          auth: {
            user: "info@abwcurious.com",
            pass: "rlpu nxvo glex fnvm",
          },
        });

        await transporter.sendMail({
          from: `"IntelliQR Contact Form" <info@abwcurious.com>`,
          to: "info@abwcurious.com",
          replyTo: input.email,
          subject: `[IntelliQR Contact] ${input.subject}`,
          text: `New contact form submission:\n\nName: ${input.name}\nEmail: ${input.email}\nSubject: ${input.subject}\n\nMessage:\n${input.message}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #4f46e5; margin-bottom: 20px;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${input.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${input.email}">${input.email}</a></p>
              <p><strong>Subject:</strong> ${input.subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #f3f4f6; white-space: pre-wrap;">${input.message}</div>
            </div>
          `,
        });
      } catch (error) {
        console.error("Failed to send email notification:", error);
      }

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
