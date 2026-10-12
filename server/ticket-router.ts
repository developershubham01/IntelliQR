import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "./middleware.js";
import { eventTickets } from "../db/schema.js";
import { getDb } from "./queries/connection.js";
import { eq, and, desc, sql } from "drizzle-orm";
import crypto from "crypto";

function generateTicketCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude confusing 0, 1, I, O
  let result = "TKT-";
  for (let i = 0; i < 4; i++) {
    result += chars[crypto.randomInt(0, chars.length)];
  }
  result += "-";
  for (let i = 0; i < 4; i++) {
    result += chars[crypto.randomInt(0, chars.length)];
  }
  return result;
}

export const ticketRouter = createRouter({
  // Public verification endpoint (when a gate scanner or attendee opens it)
  verify: publicQuery
    .input(z.object({ ticketCode: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(eventTickets)
        .where(eq(eventTickets.ticketCode, input.ticketCode.trim().toUpperCase()))
        .limit(1);

      if (rows.length === 0) {
        return {
          valid: false,
          status: "not_found",
          message: "Ticket code does not exist in the system.",
        };
      }

      const ticket = rows[0];

      if (ticket.status === "cancelled") {
        return {
          valid: false,
          status: "cancelled",
          ticket,
          message: "This ticket has been cancelled or revoked.",
        };
      }

      if (ticket.status === "checked_in") {
        return {
          valid: false,
          status: "already_used",
          ticket,
          message: `Ticket already checked in at ${new Date(ticket.checkedInAt!).toLocaleTimeString()} (Scan count: ${ticket.checkInCount}).`,
        };
      }

      return {
        valid: true,
        status: "valid",
        ticket,
        message: "Ticket is valid for admission.",
      };
    }),

  // Authorized Gate Check-in Action (Duplicate Scan Prevention)
  checkIn: authedQuery
    .input(z.object({ ticketCode: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const code = input.ticketCode.trim().toUpperCase();

      const existing = await db
        .select()
        .from(eventTickets)
        .where(and(eq(eventTickets.ticketCode, code), eq(eventTickets.userId, ctx.user.id)))
        .limit(1);

      if (existing.length === 0) {
        throw new Error("Ticket not found or you are not the event organizer.");
      }

      const ticket = existing[0];

      if (ticket.status === "cancelled") {
        throw new Error("Cannot check in: Ticket is marked as cancelled.");
      }

      if (ticket.status === "checked_in") {
        // Increment checkInCount to track duplicate attempts
        await db
          .update(eventTickets)
          .set({ checkInCount: sql`${eventTickets.checkInCount} + 1` })
          .where(eq(eventTickets.id, ticket.id));

        return {
          success: false,
          alreadyCheckedIn: true,
          checkedInAt: ticket.checkedInAt,
          checkInCount: ticket.checkInCount + 1,
          ticket,
          message: `DUPLICATE SCAN WARNING: This ticket was already checked in on ${new Date(ticket.checkedInAt!).toLocaleTimeString()}. Duplicate scan recorded.`,
        };
      }

      // Perform check-in atomically
      const now = new Date();
      const updated = await db
        .update(eventTickets)
        .set({
          status: "checked_in",
          checkedInAt: now,
          checkInCount: 1,
        })
        .where(eq(eventTickets.id, ticket.id))
        .returning();

      return {
        success: true,
        alreadyCheckedIn: false,
        checkedInAt: now,
        checkInCount: 1,
        ticket: updated[0],
        message: `Success! Checked in attendee ${ticket.attendeeName} (${ticket.ticketType}).`,
      };
    }),

  // Organizer: List all tickets for their events
  list: authedQuery
    .input(
      z
        .object({
          eventName: z.string().optional(),
          status: z.enum(["all", "valid", "checked_in", "cancelled"]).default("all").optional(),
          limit: z.number().min(1).max(200).default(100),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(eventTickets.userId, ctx.user.id)];

      if (input?.eventName) {
        conditions.push(eq(eventTickets.eventName, input.eventName));
      }
      if (input?.status && input.status !== "all") {
        conditions.push(eq(eventTickets.status, input.status));
      }

      const items = await db
        .select()
        .from(eventTickets)
        .where(and(...conditions))
        .orderBy(desc(eventTickets.createdAt))
        .limit(input?.limit ?? 100);

      const totalValid = items.filter((i) => i.status === "valid").length;
      const totalCheckedIn = items.filter((i) => i.status === "checked_in").length;

      return {
        items,
        total: items.length,
        stats: {
          totalTickets: items.length,
          valid: totalValid,
          checkedIn: totalCheckedIn,
          attendanceRate: items.length > 0 ? Math.round((totalCheckedIn / items.length) * 100) : 0,
        },
      };
    }),

  // Organizer: Create / Issue a new ticket
  create: authedQuery
    .input(
      z.object({
        eventName: z.string().min(1).max(255),
        attendeeName: z.string().min(1).max(255),
        attendeeEmail: z.string().email().optional(),
        ticketType: z.string().default("General"),
        qrCodeId: z.number().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const ticketCode = generateTicketCode();

      const inserted = await db
        .insert(eventTickets)
        .values({
          userId: ctx.user.id,
          ticketCode,
          eventName: input.eventName,
          attendeeName: input.attendeeName,
          attendeeEmail: input.attendeeEmail ?? null,
          ticketType: input.ticketType,
          qrCodeId: input.qrCodeId ?? null,
          status: "valid",
          checkInCount: 0,
          metadata: input.metadata ?? {},
        })
        .returning();

      return inserted[0];
    }),
});
