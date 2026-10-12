import { relations } from "drizzle-orm";
import {
  users,
  qrCodes,
  qrFolders,
  qrScans,
  landingPages,
  eventTickets,
  bulkJobs,
  gymMemberships,
  attendanceRecords,
  payments,
  subscriptions,
} from "./schema.js";

export const usersRelations = relations(users, ({ many }) => ({
  qrCodes: many(qrCodes),
  folders: many(qrFolders),
  landingPages: many(landingPages),
  tickets: many(eventTickets),
  bulkJobs: many(bulkJobs),
  payments: many(payments),
  subscriptions: many(subscriptions),
}));

export const qrFoldersRelations = relations(qrFolders, ({ one, many }) => ({
  user: one(users, {
    fields: [qrFolders.userId],
    references: [users.id],
  }),
  qrCodes: many(qrCodes),
}));

export const qrCodesRelations = relations(qrCodes, ({ one, many }) => ({
  user: one(users, {
    fields: [qrCodes.userId],
    references: [users.id],
  }),
  folder: one(qrFolders, {
    fields: [qrCodes.folderId],
    references: [qrFolders.id],
  }),
  scans: many(qrScans),
  landingPages: many(landingPages),
}));

export const qrScansRelations = relations(qrScans, ({ one }) => ({
  qrCode: one(qrCodes, {
    fields: [qrScans.qrCodeId],
    references: [qrCodes.id],
  }),
}));

export const landingPagesRelations = relations(landingPages, ({ one }) => ({
  user: one(users, {
    fields: [landingPages.userId],
    references: [users.id],
  }),
  qrCode: one(qrCodes, {
    fields: [landingPages.qrCodeId],
    references: [qrCodes.id],
  }),
}));
