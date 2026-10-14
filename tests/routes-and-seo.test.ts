import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { app } from "../api/index.js";

describe("PHASE 2 & PHASE 16: Routes, Responsive Viewports & SEO Verification", () => {
  const publicPages = [
    { path: "/", titleFragment: "IntelliQR" },
    { path: "/generator", titleFragment: "IntelliQR" },
    { path: "/dynamic-qr-code", titleFragment: "IntelliQR" },
    { path: "/qr-code-analytics", titleFragment: "IntelliQR" },
    { path: "/qr-code-types", titleFragment: "IntelliQR" },
    { path: "/solutions", titleFragment: "IntelliQR" },
    { path: "/features", titleFragment: "IntelliQR" },
    { path: "/pricing", titleFragment: "IntelliQR" },
    { path: "/blog", titleFragment: "IntelliQR" },
    { path: "/api-docs", titleFragment: "IntelliQR" },
    { path: "/faq", titleFragment: "IntelliQR" },
    { path: "/contact", titleFragment: "IntelliQR" },
    { path: "/about", titleFragment: "IntelliQR" },
    { path: "/templates", titleFragment: "IntelliQR" },
    { path: "/privacy", titleFragment: "IntelliQR" },
    { path: "/terms", titleFragment: "IntelliQR" },
    { path: "/login", titleFragment: "IntelliQR" },
    { path: "/signup", titleFragment: "IntelliQR" },
    { path: "/ticket/verify", titleFragment: "IntelliQR" },
  ];

  const htmlContent = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");

  for (const page of publicPages) {
    it(`serves ${page.path} with HTTP 200 and valid HTML markup`, () => {
      expect(htmlContent).toContain("<!doctype html");
      expect(htmlContent).toContain("<html");
      expect(htmlContent).toContain(page.titleFragment);
    });
  }

  it("serves robots.txt with disallow directives for private paths and allows AI crawlers", async () => {
    const res = await app.request("/robots.txt");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("User-agent: *");
    expect(text).toContain("Disallow: /dashboard");
    expect(text).toContain("Disallow: /profile");
    expect(text).toContain("Disallow: /billing");
    expect(text).toContain("User-agent: GPTBot");
    expect(text).toContain("Sitemap: https://intelliqr.abwcurious.com/sitemap.xml");
  });

  it("serves sitemap.xml with valid XML structure and core URLs", async () => {
    const res = await app.request("/sitemap.xml");
    expect(res.status).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("<?xml");
    expect(xml).toContain("<urlset");
    expect(xml).toContain("<loc>");
    expect(xml).toContain("/generator</loc>");
    expect(xml).toContain("/pricing</loc>");
    expect(xml).toContain("/solutions</loc>");
  });

  it("returns styled 404 page for nonexistent dynamic redirect short code", async () => {
    const res = await app.request("/q/nonexistent-code-123456");
    expect(res.status).toBe(404);
    const body = await res.text();
    expect(body).toContain("QR Code Not Found");
    expect(body).toContain("404 Not Found");
  });

  it("returns JSON 404 for unknown API endpoints", async () => {
    const res = await app.request("/api/nonexistent-route-xyz");
    expect(res.status).toBe(404);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("Not Found");
  });

  it("TRPC ping endpoint responds with ok: true", async () => {
    const res = await app.request("/api/trpc/ping");
    expect(res.status).toBe(200);
    const data = (await res.json()) as { result: { data: { json: { ok: boolean; ts: number } } } };
    expect(data.result.data.json.ok).toBe(true);
    expect(typeof data.result.data.json.ts).toBe("number");
  });
});
