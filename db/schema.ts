import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

// Enums for Postgres
export const roleEnum = pgEnum("user_role", ["user", "admin"]);
export const qrCodeStatusEnum = pgEnum("qr_status", ["active", "paused", "expired"]);
export const contactStatusEnum = pgEnum("contact_status", ["new", "read", "replied"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "captured", "failed", "refunded"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "past_due", "cancelled", "expired", "trialing"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  password: text("password"),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  website: varchar("website", { length: 255 }),
  bio: text("bio"),
  subscriptionTier: varchar("subscriptionTier", { length: 50 }).default("free").notNull(),
  subscriptionStatus: varchar("subscriptionStatus", { length: 50 }).default("active").notNull(),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// QR Folders table
export const qrFolders = pgTable("qr_folders", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 50 }).default("#4F46E5"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QRFolder = typeof qrFolders.$inferSelect;
export type InsertQRFolder = typeof qrFolders.$inferInsert;

// QR Codes table
export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
  folderId: integer("folderId").references(() => qrFolders.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  content: text("content").notNull(),
  destinationUrl: text("destinationUrl"),
  data: jsonb("data").$type<Record<string, unknown>>(),
  style: jsonb("style").$type<QRStyleConfig>(),
  imageUrl: text("imageUrl"),
  svgContent: text("svgContent"),
  isFavorite: boolean("isFavorite").default(false),
  isDynamic: boolean("isDynamic").default(false),
  shortId: varchar("shortId", { length: 20 }).unique(),
  status: qrCodeStatusEnum("status").default("active").notNull(),
  scanCount: integer("scanCount").default(0),
  downloadCount: integer("downloadCount").default(0),
  expiresAt: timestamp("expiresAt"),
  passwordHash: text("passwordHash"),
  customDomain: varchar("customDomain", { length: 255 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type QRCode = typeof qrCodes.$inferSelect;
export type InsertQRCode = typeof qrCodes.$inferInsert;

// QR Style Configuration Type
export interface QRStyleConfig {
  foregroundColor: string;
  backgroundColor: string;
  dotStyle: "square" | "rounded" | "dots" | "classy" | "classy-rounded";
  eyeStyle: "square" | "circle" | "ring";
  cornerRadius: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  logoUrl?: string;
  gradient?: {
    enabled: boolean;
    type: "linear" | "radial";
    color1: string;
    color2: string;
    rotation: number;
  };
  frame?: {
    enabled: boolean;
    style: string;
    text: string;
    color: string;
  };
}

// Contact submissions table
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: contactStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// API Keys table
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  key: varchar("key", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  isActive: boolean("isActive").default(true),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;

// QR Scans (Analytics) table
export const qrScans = pgTable("qr_scans", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qrCodeId").notNull().references(() => qrCodes.id, { onDelete: "cascade" }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  country: varchar("country", { length: 50 }),
  city: varchar("city", { length: 255 }),
  device: varchar("device", { length: 50 }),
  browser: varchar("browser", { length: 50 }),
  os: varchar("os", { length: 50 }),
  referrer: text("referrer"),
  visitorHash: varchar("visitorHash", { length: 64 }),
  scannedAt: timestamp("scannedAt").defaultNow().notNull(),
});

export type QRScan = typeof qrScans.$inferSelect;
export type InsertQRScan = typeof qrScans.$inferInsert;

// Subscription Plans table
export const plans = pgTable("plans", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  tier: varchar("tier", { length: 50 }).notNull(), // "pro" | "business" | "enterprise"
  amount: integer("amount").notNull(), // In paise: e.g. 79900 for ₹799
  currency: varchar("currency", { length: 10 }).default("INR").notNull(),
  billingInterval: varchar("billingInterval", { length: 20 }).notNull(), // "monthly" | "yearly"
  featureLimits: jsonb("featureLimits").$type<{
    maxDynamicQRs: number;
    maxScansPerMonth: number;
    canRemoveWatermark: boolean;
    customDomain: boolean;
    analyticsRetentionDays: number;
    apiAccess: boolean;
  }>(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = typeof plans.$inferInsert;

// Payments table (Razorpay orders and transaction tracking)
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: varchar("planId", { length: 50 }).notNull().references(() => plans.id),
  razorpayOrderId: varchar("razorpayOrderId", { length: 255 }).notNull().unique(),
  razorpayPaymentId: varchar("razorpayPaymentId", { length: 255 }),
  razorpaySignature: varchar("razorpaySignature", { length: 255 }),
  amount: integer("amount").notNull(), // in paise
  currency: varchar("currency", { length: 10 }).default("INR").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  method: varchar("method", { length: 50 }),
  notes: jsonb("notes").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Subscriptions table (User subscription state lifecycle)
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: varchar("planId", { length: 50 }).notNull().references(() => plans.id),
  razorpaySubscriptionId: varchar("razorpaySubscriptionId", { length: 255 }),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  billingInterval: varchar("billingInterval", { length: 20 }).notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").defaultNow().notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  cancelledAt: timestamp("cancelledAt"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Webhook Events table (Idempotency and diagnostic tracking)
export const webhookEvents = pgTable("webhook_events", {
  id: serial("id").primaryKey(),
  eventId: varchar("eventId", { length: 255 }).notNull().unique(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  errorMessage: text("errorMessage"),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
});

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = typeof webhookEvents.$inferInsert;

// Landing Pages table (Multi-Industry Public Pages)
export const landingPages = pgTable("landing_pages", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  qrCodeId: integer("qrCodeId").references(() => qrCodes.id, { onDelete: "set null" }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  industry: varchar("industry", { length: 50 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  heroImage: text("heroImage"),
  logoUrl: text("logoUrl"),
  content: jsonb("content").$type<Record<string, unknown>>().default({}).notNull(),
  theme: jsonb("theme").$type<{ primaryColor: string; layout: string; dark?: boolean }>().default({ primaryColor: "#4F46E5", layout: "modern" }),
  contactInfo: jsonb("contactInfo").$type<Record<string, unknown>>().default({}),
  actionButtons: jsonb("actionButtons").$type<Array<{ label: string; url: string; icon?: string; type?: string }>>().default([]),
  isPublished: boolean("isPublished").default(true).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type LandingPage = typeof landingPages.$inferSelect;
export type InsertLandingPage = typeof landingPages.$inferInsert;

// Event Tickets table (Server-side validation & check-in duplicate prevention)
export const eventTickets = pgTable("event_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  qrCodeId: integer("qrCodeId").references(() => qrCodes.id, { onDelete: "set null" }),
  ticketCode: varchar("ticketCode", { length: 50 }).notNull().unique(),
  eventName: varchar("eventName", { length: 255 }).notNull(),
  attendeeName: varchar("attendeeName", { length: 255 }).notNull(),
  attendeeEmail: varchar("attendeeEmail", { length: 320 }),
  ticketType: varchar("ticketType", { length: 50 }).default("General").notNull(),
  status: varchar("status", { length: 50 }).default("valid").notNull(), // valid | checked_in | cancelled
  checkedInAt: timestamp("checkedInAt"),
  checkInCount: integer("checkInCount").default(0).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventTicket = typeof eventTickets.$inferSelect;
export type InsertEventTicket = typeof eventTickets.$inferInsert;

// Bulk QR Generation Jobs
export const bulkJobs = pgTable("bulk_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("completed").notNull(), // pending | processing | completed | failed
  totalCount: integer("totalCount").default(0).notNull(),
  processedCount: integer("processedCount").default(0).notNull(),
  failedCount: integer("failedCount").default(0).notNull(),
  errorLog: jsonb("errorLog").$type<string[]>().default([]),
  items: jsonb("items").$type<Array<{
    row: number;
    name: string;
    type: string;
    content: string;
    shortId?: string;
    status: "success" | "error";
    error?: string;
  }>>().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type BulkJob = typeof bulkJobs.$inferSelect;
export type InsertBulkJob = typeof bulkJobs.$inferInsert;

// Gym Memberships
export const gymMemberships = pgTable("gym_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  memberCode: varchar("memberCode", { length: 50 }).notNull().unique(),
  memberName: varchar("memberName", { length: 255 }).notNull(),
  tier: varchar("tier", { length: 50 }).default("Standard").notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  validUntil: timestamp("validUntil"),
  lastCheckIn: timestamp("lastCheckIn"),
  checkInCount: integer("checkInCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GymMembership = typeof gymMemberships.$inferSelect;
export type InsertGymMembership = typeof gymMemberships.$inferInsert;

// Attendance Records
export const attendanceRecords = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionCode: varchar("sessionCode", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  studentId: varchar("studentId", { length: 100 }).notNull(),
  studentName: varchar("studentName", { length: 255 }).notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendanceRecord = typeof attendanceRecords.$inferInsert;


