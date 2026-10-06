import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../server/router.js";
import { createContext } from "../server/context.js";
import { env } from "../server/lib/env.js";
import { handleRedirection } from "../server/redirect-handler.js";

export const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.get("/robots.txt", async (c) => {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const content = await fs.readFile(path.join(process.cwd(), "public", "robots.txt"), "utf-8");
    return c.text(content, 200, { "Content-Type": "text/plain; charset=utf-8" });
  } catch {
    return c.text("User-agent: *\nAllow: /\nSitemap: https://intelli-qr.vercel.app/sitemap.xml", 200);
  }
});

app.get("/sitemap.xml", async (c) => {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const content = await fs.readFile(path.join(process.cwd(), "public", "sitemap.xml"), "utf-8");
    return c.body(content, 200, { "Content-Type": "application/xml; charset=utf-8" });
  } catch {
    return c.text("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><url><loc>https://intelli-qr.vercel.app/</loc></url></urlset>", 200, { "Content-Type": "application/xml" });
  }
});

app.get("/q/:shortId", handleRedirection);
app.get("/r/:shortId", handleRedirection);
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
export const PATCH = app.fetch;
export const OPTIONS = app.fetch;

if (env.isProduction && !process.env.VERCEL) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("../server/lib/vite.js");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
