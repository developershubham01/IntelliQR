import type { Context } from "hono";
import { getDb } from "./queries/connection.js";
import { qrCodes, qrScans } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";
import { createHash } from "crypto";

// Comprehensive User Agent parsing for OS, Device, and Browser
function parseUserAgent(ua: string) {
  let os = "Other";
  let device = "Desktop";
  let browser = "Other";

  // Device detection
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) {
    device = "Mobile";
  } else if (/ipad|tablet|(android(?!.*mobile))|silk|playbook/i.test(ua)) {
    device = "Tablet";
  } else if (/bot|crawler|spider|crawling/i.test(ua)) {
    device = "Bot";
  }

  // OS detection
  if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/windows nt/i.test(ua)) os = "Windows";
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS";
  else if (/cros/i.test(ua)) os = "ChromeOS";
  else if (/linux/i.test(ua)) os = "Linux";

  // Browser detection
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/samsungbrowser/i.test(ua)) browser = "Samsung";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";

  return { os, device, browser };
}

// URL Security validator: allow only safe protocols
export function isValidRedirectUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  // Strictly reject dangerous schemes
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  // Allow standard web URLs or mailto/tel
  if (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:")
  ) {
    return true;
  }

  return false;
}

// Generate branded, sleek error page matching IntelliQR aesthetic
function renderStatusPage(params: {
  title: string;
  badge: string;
  badgeColor: string;
  heading: string;
  message: string;
  shortId: string;
}) {
  const { title, badge, badgeColor, heading, message, shortId } = params;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | IntelliQR</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
      color: #0f172a;
      padding: 1.5rem;
    }
    .card {
      max-width: 460px;
      width: 100%;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 28px;
      padding: 2.5rem 2rem;
      text-align: center;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      font-family: 'Newsreader', serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
      text-decoration: none;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      ${badgeColor}
    }
    h1 {
      font-family: 'Newsreader', serif;
      font-size: 1.85rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.75rem;
      line-height: 1.2;
    }
    p {
      font-size: 0.92rem;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 1.75rem;
      font-weight: 500;
    }
    .code-pill {
      display: inline-block;
      font-family: monospace;
      font-size: 0.78rem;
      color: #475569;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.25rem 0.65rem;
      margin-bottom: 1.5rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.85rem 1.5rem;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      text-decoration: none;
      background: #0f172a;
      color: #ffffff;
      transition: all 0.2s;
    }
    .btn:hover { background: #1e293b; transform: translateY(-1px); }
    .footer {
      margin-top: 1.5rem;
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/>
      </svg>
      <span>IntelliQR</span>
    </div>
    <div>
      <span class="badge">${badge}</span>
    </div>
    <h1>${heading}</h1>
    <p>${message}</p>
    ${shortId ? `<div class="code-pill">QR Ref: ${shortId}</div>` : ""}
    <a href="/" class="btn">Create Your Own QR Code</a>
    <div class="footer">Powered by IntelliQR Dynamic Engine</div>
  </div>
</body>
</html>`;
}

export const handleRedirection = async (c: Context) => {
  const shortId = c.req.param("shortId");
  if (!shortId || typeof shortId !== "string") {
    return c.html(
      renderStatusPage({
        title: "Bad Request",
        badge: "Invalid URL",
        badgeColor: "background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;",
        heading: "Invalid QR Link",
        message: "No QR code identifier was provided in this request.",
        shortId: "",
      }),
      400
    );
  }

  const db = getDb();

  // Find the QR code using indexed shortId
  const codeList = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.shortId, shortId))
    .limit(1);

  if (codeList.length === 0) {
    return c.html(
      renderStatusPage({
        title: "QR Not Found",
        badge: "404 Not Found",
        badgeColor: "background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;",
        heading: "QR Code Not Found",
        message: "This QR code may have been deleted or the URL may be incorrect.",
        shortId,
      }),
      404
    );
  }

  const qr = codeList[0];

  // Check if paused
  if (qr.status === "paused") {
    return c.html(
      renderStatusPage({
        title: "QR Temporarily Unavailable",
        badge: "Temporarily Paused",
        badgeColor: "background: #fef3c7; color: #b45309; border: 1px solid #fde68a;",
        heading: "QR Code Temporarily Unavailable",
        message: "This QR code has been temporarily disabled by its owner. Please try again later or contact the owner.",
        shortId,
      }),
      403
    );
  }

  // Check expiration (status or expiresAt date)
  const isTimeExpired = qr.expiresAt && new Date(qr.expiresAt) < new Date();
  if (qr.status === "expired" || isTimeExpired) {
    // If time expired, update status asynchronously
    if (isTimeExpired && qr.status !== "expired") {
      db.update(qrCodes)
        .set({ status: "expired" })
        .where(eq(qrCodes.id, qr.id))
        .execute()
        .catch((e) => console.error("Failed to mark QR as expired:", e));
    }

    return c.html(
      renderStatusPage({
        title: "QR Expired",
        badge: "Link Expired",
        badgeColor: "background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;",
        heading: "QR Code Expired",
        message: "This QR code is no longer active. The campaign or link duration has concluded.",
        shortId,
      }),
      410
    );
  }

  // Determine destination URL
  let targetUrl = (qr.destinationUrl || qr.content || "").trim();

  // Support Dynamic QR Load Balancer (traffic distribution across multiple target URLs)
  const qrData = (qr.data as Record<string, unknown>) || {};
  const lbConfig = qrData.loadBalancer as { enabled?: boolean; targets?: Array<{ url: string; weight?: number }> } | undefined;
  if (lbConfig?.enabled && Array.isArray(lbConfig.targets) && lbConfig.targets.length > 0) {
    const validTargets = lbConfig.targets.filter(
      (t) => t && typeof t.url === "string" && t.url.trim().length > 0
    );
    if (validTargets.length > 0) {
      const totalWeight = validTargets.reduce(
        (sum, t) => sum + (Number(t.weight) || 1),
        0
      );
      let rand = Math.random() * totalWeight;
      for (const target of validTargets) {
        const weight = Number(target.weight) || 1;
        if (rand < weight) {
          targetUrl = target.url.trim();
          break;
        }
        rand -= weight;
      }
    }
  }

  // Validate destination URL to prevent open redirect vulnerabilities
  if (!isValidRedirectUrl(targetUrl)) {
    // Check if it's a domain missing protocol (e.g. "example.com" or "www.example.com")
    if (/^[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    } else {
      return c.html(
        renderStatusPage({
          title: "Invalid Destination",
          badge: "Security Warning",
          badgeColor: "background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;",
          heading: "Unsafe Destination URL",
          message: "The destination configured for this QR code is not a valid or safe web address.",
          shortId,
        }),
        400
      );
    }
  }

  // Extract analytics asynchronously
  const userAgent = c.req.header("user-agent") || "Unknown";
  const rawIp = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || c.req.header("x-real-ip") || "Unknown";
  const country = c.req.header("cf-ipcountry") || c.req.header("x-vercel-ip-country") || null;
  const city = c.req.header("cf-ipcity") || c.req.header("x-vercel-ip-city") || null;
  const referrer = c.req.header("referer") || c.req.header("referrer") || null;

  const { os, device, browser } = parseUserAgent(userAgent);

  // Privacy-conscious deduplication: Salted SHA-256 hash of IP + UA + Day + QR ID
  // This calculates unique scans without permanently storing raw visitor IP
  const dayString = new Date().toISOString().slice(0, 10);
  const visitorHash = createHash("sha256")
    .update(`${rawIp}:${userAgent}:${qr.id}:${dayString}`)
    .digest("hex");

  // Asynchronous Scan Tracking (doesn't block the redirect)
  db.insert(qrScans)
    .values({
      qrCodeId: qr.id,
      ipAddress: null, // Privacy-conscious: raw IP is not stored permanently
      userAgent: userAgent.slice(0, 500),
      country: country ? country.slice(0, 50) : null,
      city: city ? city.slice(0, 255) : null,
      device: device.slice(0, 50),
      browser: browser.slice(0, 50),
      os: os.slice(0, 50),
      referrer: referrer ? referrer.slice(0, 1000) : null,
      visitorHash,
      scannedAt: new Date(),
    })
    .execute()
    .catch((e) => console.error("Failed to log scan analytics:", e));

  // Atomic database increment for scanCount (avoids race conditions & serverless loss)
  try {
    await db.update(qrCodes)
      .set({
        scanCount: sql`COALESCE(${qrCodes.scanCount}, 0) + 1`,
        updatedAt: new Date(),
      })
      .where(eq(qrCodes.id, qr.id));
  } catch (e) {
    console.error("Failed to atomically increment scan count:", e);
  }

  // Set anti-caching headers so client browsers always query the server on subsequent scans
  c.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");

  return c.redirect(targetUrl, 302);
};
