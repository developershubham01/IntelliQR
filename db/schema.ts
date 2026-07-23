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
export const qrCodeStatusEnum = pgEnum("qr_status", ["active", "paused"]);
export const contactStatusEnum = pgEnum("contact_status", ["new", "read", "replied"]);

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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// QR Codes table
export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  content: text("content").notNull(),
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
  qrCodeId: integer("qrCodeId").notNull().references(() => qrCodes.id),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  country: varchar("country", { length: 2 }),
  city: varchar("city", { length: 255 }),
  device: varchar("device", { length: 50 }),
  os: varchar("os", { length: 50 }),
  scannedAt: timestamp("scannedAt").defaultNow().notNull(),
});

export type QRScan = typeof qrScans.$inferSelect;
export type InsertQRScan = typeof qrScans.$inferInsert;
