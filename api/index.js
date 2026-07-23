import { createRequire } from 'module';const require = createRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/lib/vite.ts
var vite_exports = {};
__export(vite_exports, {
  serveStaticFiles: () => serveStaticFiles
});
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
function serveStaticFiles(app2) {
  const distPath = path.resolve(import.meta.dirname, "../dist");
  app2.use("*", serveStatic({ root: "./dist" }));
  app2.notFound((c) => {
    const accept = c.req.header("accept") ?? "";
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }
    const indexPath = path.resolve(distPath, "index.html");
    const content = fs.readFileSync(indexPath, "utf-8");
    return c.html(content);
  });
}
var init_vite = __esm({
  "api/lib/vite.ts"() {
  }
});

// api/index.ts
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// api/auth-router.ts
import * as cookie2 from "cookie";
import { z } from "zod";
import * as jose2 from "jose";

// contracts/constants.ts
var Session = {
  cookieName: "kimi_sid",
  maxAgeMs: 365 * 24 * 60 * 60 * 1e3
};
var ErrorMessages = {
  unauthenticated: "Authentication required",
  insufficientRole: "Insufficient permissions"
};

// api/lib/cookies.ts
function isLocalhost(headers) {
  const host = headers.get("host") || "";
  return host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
}
function getSessionCookieOptions(headers) {
  const localhost = isLocalhost(headers);
  return {
    httpOnly: true,
    path: "/",
    sameSite: localhost ? "Lax" : "None",
    secure: !localhost
  };
}

// api/middleware.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var createRouter = t.router;
var publicQuery = t.procedure;
var requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
function requireRole(role) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== role) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole
      });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}
var authedQuery = t.procedure.use(requireAuth);
var adminQuery = authedQuery.use(requireRole("admin"));

// api/queries/users.ts
import { eq } from "drizzle-orm";

// db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  apiKeys: () => apiKeys,
  contactStatusEnum: () => contactStatusEnum,
  contacts: () => contacts,
  qrCodeStatusEnum: () => qrCodeStatusEnum,
  qrCodes: () => qrCodes,
  qrScans: () => qrScans,
  roleEnum: () => roleEnum,
  users: () => users
});
import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  boolean
} from "drizzle-orm/pg-core";
var roleEnum = pgEnum("user_role", ["user", "admin"]);
var qrCodeStatusEnum = pgEnum("qr_status", ["active", "paused"]);
var contactStatusEnum = pgEnum("contact_status", ["new", "read", "replied"]);
var users = pgTable("users", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => /* @__PURE__ */ new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull()
});
var qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  content: text("content").notNull(),
  data: jsonb("data").$type(),
  style: jsonb("style").$type(),
  imageUrl: text("imageUrl"),
  svgContent: text("svgContent"),
  isFavorite: boolean("isFavorite").default(false),
  isDynamic: boolean("isDynamic").default(false),
  shortId: varchar("shortId", { length: 20 }).unique(),
  status: qrCodeStatusEnum("status").default("active").notNull(),
  scanCount: integer("scanCount").default(0),
  downloadCount: integer("downloadCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => /* @__PURE__ */ new Date())
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: contactStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  key: varchar("key", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  isActive: boolean("isActive").default(true),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var qrScans = pgTable("qr_scans", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qrCodeId").notNull().references(() => qrCodes.id),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  country: varchar("country", { length: 2 }),
  city: varchar("city", { length: 255 }),
  device: varchar("device", { length: 50 }),
  os: varchar("os", { length: 50 }),
  scannedAt: timestamp("scannedAt").defaultNow().notNull()
});

// api/queries/connection.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// api/lib/env.ts
import "dotenv/config";
function required(name) {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    console.warn(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}
var env = {
  appId: process.env.APP_ID || process.env.GOOGLE_CLIENT_ID || "default-app-id",
  appSecret: process.env.APP_SECRET || process.env.GOOGLE_CLIENT_SECRET || process.env.JWT_SECRET || "default-app-secret-for-jwt",
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  kimiAuthUrl: process.env.KIMI_AUTH_URL || "",
  kimiOpenUrl: process.env.KIMI_OPEN_URL || "",
  ownerUnionId: process.env.OWNER_UNION_ID ?? ""
};

// db/relations.ts
var relations_exports = {};

// api/queries/connection.ts
var fullSchema = { ...schema_exports, ...relations_exports };
var instance;
function getDb() {
  if (!instance) {
    const client = postgres(env.databaseUrl);
    instance = drizzle(client, { schema: fullSchema });
  }
  return instance;
}

// api/queries/users.ts
async function findUserByUnionId(unionId) {
  const rows = await getDb().select().from(users).where(eq(users.unionId, unionId)).limit(1);
  return rows[0];
}
async function upsertUser(data) {
  const values = { ...data };
  const updateSet = {
    lastSignInAt: /* @__PURE__ */ new Date(),
    ...data
  };
  if (values.role === void 0 && values.unionId && values.unionId === env.ownerUnionId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await getDb().insert(users).values(values).onConflictDoUpdate({
    target: users.unionId,
    set: updateSet
  });
}

// api/lib/auth.ts
import * as jose from "jose";
import * as cookie from "cookie";

// contracts/errors.ts
function appError(status, message) {
  return { tag: "app_error", status, message };
}
var Errors = {
  badRequest: (msg) => appError(400, msg),
  unauthorized: (msg) => appError(401, msg),
  forbidden: (msg) => appError(403, msg),
  notFound: (msg) => appError(404, msg),
  internal: (msg) => appError(500, msg)
};

// api/lib/auth.ts
var JWT_ALG = "HS256";
async function signSessionToken(payload) {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT(payload).setProtectedHeader({ alg: JWT_ALG }).setIssuedAt().setExpirationTime("1 year").sign(secret);
}
async function verifySessionToken(token) {
  if (!token) {
    console.warn("[session] No token provided for verification.");
    return null;
  }
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG]
    });
    const { unionId, clientId } = payload;
    if (!unionId || !clientId) {
      console.warn("[session] JWT payload missing required fields.");
      return null;
    }
    return { unionId, clientId };
  } catch (error) {
    console.warn("[session] JWT verification failed:", error);
    return null;
  }
}
async function authenticateRequest(headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) {
    console.warn("[auth] No session cookie found in request.");
    throw Errors.forbidden("Invalid authentication token.");
  }
  const claim = await verifySessionToken(token);
  if (!claim) {
    throw Errors.forbidden("Invalid authentication token.");
  }
  const user = await findUserByUnionId(claim.unionId);
  if (!user) {
    throw Errors.forbidden("User not found. Please re-login.");
  }
  return user;
}

// api/lib/hash.ts
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${salt}:${buf.toString("hex")}`;
}
async function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const buf = await scryptAsync(password, salt, 64);
  return timingSafeEqual(Buffer.from(key, "hex"), buf);
}

// api/auth-router.ts
var authRouter = createRouter({
  me: publicQuery.query((opts) => opts.ctx.user ?? null),
  googleLogin: publicQuery.input(
    z.object({
      credential: z.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const { credential } = input;
    const jwks = jose2.createRemoteJWKSet(
      new URL("https://www.googleapis.com/oauth2/v3/certs")
    );
    const { payload } = await jose2.jwtVerify(credential, jwks, {
      audience: "109467875222-v0vgjm6ot9kb85411tvk3veohms4ur4p.apps.googleusercontent.com",
      issuer: ["https://accounts.google.com", "accounts.google.com"]
    });
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture;
    const unionId = `google_${payload.sub}`;
    let user = await findUserByUnionId(unionId);
    if (!user) {
      await upsertUser({
        unionId,
        name,
        email,
        avatar,
        lastSignInAt: /* @__PURE__ */ new Date()
      });
      user = await findUserByUnionId(unionId);
    } else {
      await upsertUser({
        ...user,
        lastSignInAt: /* @__PURE__ */ new Date()
      });
    }
    if (!user) {
      throw new Error("Failed to authenticate with Google.");
    }
    const token = await signSessionToken({
      unionId: user.unionId,
      clientId: env.appId
    });
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie2.serialize(Session.cookieName, token, {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase(),
        secure: opts.secure,
        maxAge: Session.maxAgeMs / 1e3
      })
    );
    return { success: true, user };
  }),
  login: publicQuery.input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
  ).mutation(async ({ ctx, input }) => {
    const email = input.email.toLowerCase();
    const unionId = `email_${email}`;
    const user = await findUserByUnionId(unionId);
    if (!user || !user.password) {
      throw new Error("Invalid email or password.");
    }
    const isPasswordValid = await verifyPassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }
    const token = await signSessionToken({
      unionId: user.unionId,
      clientId: env.appId
    });
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie2.serialize(Session.cookieName, token, {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase(),
        secure: opts.secure,
        maxAge: Session.maxAgeMs / 1e3
      })
    );
    return { success: true, user };
  }),
  register: publicQuery.input(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6)
    })
  ).mutation(async ({ ctx, input }) => {
    const email = input.email.toLowerCase();
    const unionId = `email_${email}`;
    let existingUser = await findUserByUnionId(unionId);
    if (existingUser) {
      throw new Error("A user with this email already exists.");
    }
    const hashedPassword = await hashPassword(input.password);
    await upsertUser({
      unionId,
      name: input.name,
      email,
      password: hashedPassword,
      lastSignInAt: /* @__PURE__ */ new Date()
    });
    const user = await findUserByUnionId(unionId);
    if (!user) {
      throw new Error("Failed to create user.");
    }
    const token = await signSessionToken({
      unionId: user.unionId,
      clientId: env.appId
    });
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie2.serialize(Session.cookieName, token, {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase(),
        secure: opts.secure,
        maxAge: Session.maxAgeMs / 1e3
      })
    );
    return { success: true, user };
  }),
  updateProfile: authedQuery.input(
    z.object({
      name: z.string().min(2),
      phone: z.string().max(50).optional().nullable(),
      company: z.string().max(255).optional().nullable(),
      website: z.string().max(255).optional().nullable(),
      bio: z.string().optional().nullable()
    })
  ).mutation(async ({ ctx, input }) => {
    const user = ctx.user;
    await upsertUser({
      ...user,
      name: input.name,
      phone: input.phone,
      company: input.company,
      website: input.website,
      bio: input.bio,
      lastSignInAt: /* @__PURE__ */ new Date()
    });
    const updatedUser = await findUserByUnionId(user.unionId);
    if (!updatedUser) {
      throw new Error("Failed to update profile.");
    }
    return { success: true, user: updatedUser };
  }),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie2.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase(),
        secure: opts.secure,
        maxAge: 0
      })
    );
    return { success: true };
  })
});

// api/qr-router.ts
import { z as z2 } from "zod";
import { eq as eq2, desc, and } from "drizzle-orm";
var qrRouter = createRouter({
  list: authedQuery.input(
    z2.object({
      limit: z2.number().min(1).max(100).default(20),
      offset: z2.number().min(0).default(0)
    }).optional()
  ).query(async ({ ctx, input }) => {
    const db = getDb();
    const limit = input?.limit ?? 20;
    const offset = input?.offset ?? 0;
    const items = await db.select().from(qrCodes).where(eq2(qrCodes.userId, ctx.user.id)).orderBy(desc(qrCodes.createdAt)).limit(limit).offset(offset);
    const total = await db.select().from(qrCodes).where(eq2(qrCodes.userId, ctx.user.id));
    return { items, total: total.length };
  }),
  create: authedQuery.input(
    z2.object({
      name: z2.string().min(1).max(255),
      type: z2.string().min(1).max(50),
      content: z2.string().min(1),
      data: z2.record(z2.string(), z2.unknown()).optional(),
      style: z2.record(z2.string(), z2.unknown()).optional(),
      imageUrl: z2.string().optional(),
      svgContent: z2.string().optional(),
      isDynamic: z2.boolean().default(false)
    })
  ).mutation(async ({ ctx, input }) => {
    const db = getDb();
    let shortId = null;
    if (input.isDynamic) {
      shortId = Math.random().toString(16).substring(2, 10);
    }
    const result = await db.insert(qrCodes).values({
      userId: ctx.user.id,
      name: input.name,
      type: input.type,
      content: input.content,
      data: input.data,
      style: input.style,
      imageUrl: input.imageUrl,
      svgContent: input.svgContent,
      isDynamic: input.isDynamic,
      shortId
    }).returning({ id: qrCodes.id });
    return { id: result[0].id, success: true, shortId };
  }),
  delete: authedQuery.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    await db.delete(qrCodes).where(and(eq2(qrCodes.id, input.id), eq2(qrCodes.userId, ctx.user.id)));
    return { success: true };
  }),
  toggleFavorite: authedQuery.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const existing = await db.select().from(qrCodes).where(and(eq2(qrCodes.id, input.id), eq2(qrCodes.userId, ctx.user.id))).limit(1);
    if (existing.length === 0) {
      return { success: false, error: "Not found" };
    }
    await db.update(qrCodes).set({ isFavorite: !existing[0].isFavorite }).where(eq2(qrCodes.id, input.id));
    return { success: true, isFavorite: !existing[0].isFavorite };
  }),
  stats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const items = await db.select().from(qrCodes).where(eq2(qrCodes.userId, ctx.user.id));
    return {
      totalGenerated: items.length,
      totalDownloads: items.reduce((sum, item) => sum + (item.downloadCount ?? 0), 0),
      totalFavorites: items.filter((item) => item.isFavorite).length
    };
  })
});

// api/contact-router.ts
import { z as z3 } from "zod";
import { desc as desc2, eq as eq3 } from "drizzle-orm";
var contactRouter = createRouter({
  submit: publicQuery.input(
    z3.object({
      name: z3.string().min(1).max(255),
      email: z3.string().email(),
      subject: z3.string().min(1).max(255),
      message: z3.string().min(1).max(5e3)
    })
  ).mutation(async ({ input }) => {
    const db = getDb();
    await db.insert(contacts).values({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message
    });
    return { success: true };
  }),
  list: adminQuery.query(async () => {
    const db = getDb();
    const items = await db.select().from(contacts).orderBy(desc2(contacts.createdAt));
    return items;
  }),
  updateStatus: adminQuery.input(
    z3.object({
      id: z3.number(),
      status: z3.enum(["new", "read", "replied"])
    })
  ).mutation(async ({ input }) => {
    const db = getDb();
    await db.update(contacts).set({ status: input.status }).where(eq3(contacts.id, input.id));
    return { success: true };
  })
});

// api/router.ts
var appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  qr: qrRouter,
  contact: contactRouter
});

// api/context.ts
async function createContext(opts) {
  const ctx = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
  }
  return ctx;
}

// api/redirect-handler.ts
import { eq as eq4 } from "drizzle-orm";
function parseUserAgent(ua) {
  let os = "Unknown";
  let device = "Desktop";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    device = "Mobile";
  } else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = "Tablet";
  }
  if (/windows nt/i.test(ua)) os = "Windows";
  else if (/mac os x/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/ios|iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";
  return { os, device };
}
var handleRedirection = async (c) => {
  const shortId = c.req.param("shortId");
  if (!shortId) {
    return c.text("Bad Request", 400);
  }
  const db = getDb();
  const codeList = await db.select().from(qrCodes).where(eq4(qrCodes.shortId, shortId)).limit(1);
  if (codeList.length === 0) {
    return c.text("QR Code not found", 404);
  }
  const qr = codeList[0];
  if (qr.status === "paused") {
    return c.text("This QR Code has been paused by the owner.", 403);
  }
  const userAgent = c.req.header("user-agent") || "Unknown";
  const ipAddress = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "Unknown";
  const country = c.req.header("cf-ipcountry") || c.req.header("x-vercel-ip-country") || null;
  const city = c.req.header("cf-ipcity") || c.req.header("x-vercel-ip-city") || null;
  const { os, device } = parseUserAgent(userAgent);
  db.insert(qrScans).values({
    qrCodeId: qr.id,
    ipAddress,
    userAgent,
    country,
    city,
    device,
    os
  }).execute().catch((e) => console.error("Failed to log scan:", e));
  db.update(qrCodes).set({ scanCount: (qr.scanCount || 0) + 1 }).where(eq4(qrCodes.id, qr.id)).execute().catch((e) => console.error("Failed to increment scan count:", e));
  let targetUrl = qr.content;
  if (!targetUrl.startsWith("http") && !targetUrl.startsWith("mailto:") && !targetUrl.startsWith("tel:")) {
    return c.text(targetUrl);
  }
  return c.redirect(targetUrl, 302);
};

// api/index.ts
import { handle } from "hono/vercel";
var app = new Hono();
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get("/r/:shortId", handleRedirection);
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));
var handler = handle(app);
var index_default = handler;
if (env.isProduction && !process.env.VERCEL) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles: serveStaticFiles2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
  serveStaticFiles2(app);
  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
export {
  handler as DELETE,
  handler as GET,
  handler as OPTIONS,
  handler as PATCH,
  handler as POST,
  handler as PUT,
  app,
  index_default as default
};
