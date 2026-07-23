import type { Context } from "hono";
import { getDb } from "./queries/connection.js";
import { qrCodes, qrScans } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Very basic device/os extraction from user agent
function parseUserAgent(ua: string) {
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

export const handleRedirection = async (c: Context) => {
  const shortId = c.req.param("shortId");
  if (!shortId) {
    return c.text("Bad Request", 400);
  }

  const db = getDb();

  // Find the dynamic QR code
  const codeList = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.shortId, shortId))
    .limit(1);

  if (codeList.length === 0) {
    return c.text("QR Code not found", 404);
  }

  const qr = codeList[0];

  if (qr.status === "paused") {
    return c.text("This QR Code has been paused by the owner.", 403);
  }

  // Extract analytics data
  const userAgent = c.req.header("user-agent") || "Unknown";
  const ipAddress = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "Unknown";
  
  // Cloudflare/Vercel typically provide country headers
  const country = c.req.header("cf-ipcountry") || c.req.header("x-vercel-ip-country") || null;
  const city = c.req.header("cf-ipcity") || c.req.header("x-vercel-ip-city") || null;

  const { os, device } = parseUserAgent(userAgent);

  // Track the scan asynchronously (don't block the redirect)
  db.insert(qrScans).values({
    qrCodeId: qr.id,
    ipAddress,
    userAgent,
    country,
    city,
    device,
    os,
  }).execute().catch(e => console.error("Failed to log scan:", e));

  // Increment scan count on the qrCode record
  db.update(qrCodes)
    .set({ scanCount: (qr.scanCount || 0) + 1 })
    .where(eq(qrCodes.id, qr.id))
    .execute().catch(e => console.error("Failed to increment scan count:", e));

  // Determine where to redirect based on content type
  let targetUrl = qr.content;
  if (!targetUrl.startsWith("http") && !targetUrl.startsWith("mailto:") && !targetUrl.startsWith("tel:")) {
    // For a fully featured app, you'd render a beautiful mobile page for text/vcard.
    // For now, if it's text, we return it as plain text.
    return c.text(targetUrl);
  }

  return c.redirect(targetUrl, 302);
};
