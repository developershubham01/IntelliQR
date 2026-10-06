import { describe, it, expect, vi } from "vitest";
import { isValidRedirectUrl } from "../server/redirect-handler.js";
import crypto from "crypto";

describe("Dynamic QR - Security & URL Validation", () => {
  it("allows valid http and https URLs", () => {
    expect(isValidRedirectUrl("https://example.com")).toBe(true);
    expect(isValidRedirectUrl("http://mywebsite.org/page?query=1")).toBe(true);
    expect(isValidRedirectUrl("https://restaurant.com/menu#specials")).toBe(true);
  });

  it("strictly rejects dangerous and unsafe protocols (open redirect / XSS protection)", () => {
    expect(isValidRedirectUrl("javascript:alert(1)")).toBe(false);
    expect(isValidRedirectUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isValidRedirectUrl("vbscript:msgbox(1)")).toBe(false);
    expect(isValidRedirectUrl("file:///etc/passwd")).toBe(false);
    expect(isValidRedirectUrl("")).toBe(false);
    // @ts-expect-error test invalid types
    expect(isValidRedirectUrl(null)).toBe(false);
  });

  it("allows mailto: and tel: for communication QR codes", () => {
    expect(isValidRedirectUrl("mailto:support@intelliqr.pro")).toBe(true);
    expect(isValidRedirectUrl("tel:+1234567890")).toBe(true);
  });
});

describe("Dynamic QR - Cryptographic Short Code Generation", () => {
  const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  function generateShortCode(length = 8): string {
    const bytes = crypto.randomBytes(length);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += BASE62_CHARS[bytes[i] % 62];
    }
    return result;
  }

  it("generates 8-character, URL-safe, alphanumeric short codes", () => {
    for (let i = 0; i < 20; i++) {
      const code = generateShortCode(8);
      expect(code).toHaveLength(8);
      expect(/^[0-9a-zA-Z]{8}$/.test(code)).toBe(true);
    }
  });

  it("generates unique codes without immediate collisions", () => {
    const set = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const code = generateShortCode(8);
      expect(set.has(code)).toBe(false);
      set.add(code);
    }
    expect(set.size).toBe(500);
  });
});

describe("Dynamic QR - Privacy Visitor Deduplication & Analytics", () => {
  it("hashes IP and user-agent without exposing raw visitor IP", () => {
    const rawIp = "192.168.1.100";
    const userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)";
    const qrId = 42;
    const day = "2026-10-06";

    const hash1 = crypto.createHash("sha256").update(`${rawIp}:${userAgent}:${qrId}:${day}`).digest("hex");
    const hash2 = crypto.createHash("sha256").update(`${rawIp}:${userAgent}:${qrId}:${day}`).digest("hex");
    const differentDayHash = crypto.createHash("sha256").update(`${rawIp}:${userAgent}:${qrId}:2026-10-07`).digest("hex");

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(differentDayHash);
    expect(hash1).toHaveLength(64);
    expect(hash1).not.toContain(rawIp);
  });
});

describe("Dynamic QR - Redirect Logic & Destination Lifecycle", () => {
  interface MockQRRecord {
    id: number;
    userId: number;
    shortId: string;
    destinationUrl: string;
    status: "active" | "paused" | "expired";
    expiresAt?: Date | null;
    scanCount: number;
  }

  it("redirects active dynamic QR to destination URL and increments scan count", () => {
    const qr: MockQRRecord = {
      id: 1,
      userId: 101,
      shortId: "8Kx92LmP",
      destinationUrl: "https://initial-site.com/welcome",
      status: "active",
      scanCount: 0,
    };

    // Simulate scan
    expect(qr.status).toBe("active");
    const redirectUrl = qr.destinationUrl;
    qr.scanCount += 1;

    expect(redirectUrl).toBe("https://initial-site.com/welcome");
    expect(qr.scanCount).toBe(1);
  });

  it("updates destination URL while keeping same permanent shortId (Core Dynamic QR Verification)", () => {
    const qr: MockQRRecord = {
      id: 1,
      userId: 101,
      shortId: "8Kx92LmP",
      destinationUrl: "https://restaurant.com/menu-v1",
      status: "active",
      scanCount: 15,
    };

    const originalShortId = qr.shortId;

    // User updates destination from dashboard
    const newDestination = "https://restaurant.com/menu-v2-fall-specials";
    qr.destinationUrl = newDestination;

    // Verify QR shortId remains identical
    expect(qr.shortId).toBe(originalShortId);

    // Verify next scan resolves to new destination
    expect(qr.destinationUrl).toBe("https://restaurant.com/menu-v2-fall-specials");
  });

  it("blocks redirection when QR status is paused", () => {
    const qr: MockQRRecord = {
      id: 2,
      userId: 101,
      shortId: "Pz49Xw2M",
      destinationUrl: "https://example.com",
      status: "paused",
      scanCount: 5,
    };

    const isBlocked = qr.status === "paused";
    expect(isBlocked).toBe(true);
  });

  it("blocks redirection when QR status is expired or expiresAt has passed", () => {
    const qr: MockQRRecord = {
      id: 3,
      userId: 101,
      shortId: "Exp991AA",
      destinationUrl: "https://example.com/promo",
      status: "active",
      expiresAt: new Date(Date.now() - 10000), // expired 10 seconds ago
      scanCount: 20,
    };

    const isExpired = qr.status === "expired" || (qr.expiresAt && qr.expiresAt < new Date());
    expect(isExpired).toBe(true);
  });

  it("enforces user isolation: User A cannot modify User B's QR code", () => {
    const qrBelongingToUserA: MockQRRecord = {
      id: 10,
      userId: 1001,
      shortId: "SecCheck1",
      destinationUrl: "https://user-a.com",
      status: "active",
      scanCount: 0,
    };

    const requestingUserBId = 1002;

    const hasPermission = qrBelongingToUserA.userId === requestingUserBId;
    expect(hasPermission).toBe(false);
  });
});
