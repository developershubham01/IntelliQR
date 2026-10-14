import { describe, it, expect } from "vitest";
import crypto from "crypto";

describe("PHASE 10: Scan Analytics, Bot Filtering & Metrics Aggregation", () => {
  function isBotUserAgent(ua: string): boolean {
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /sogou/i,
      /exabot/i,
      /facebot/i,
      /facebookexternalhit/i,
      /ia_archiver/i,
      /curl/i,
      /wget/i,
      /python-requests/i,
    ];
    return botPatterns.some((pattern) => pattern.test(ua));
  }

  it("identifies automated search bot and scraper user agents accurately", () => {
    const botUserAgents = [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "curl/7.88.1",
      "python-requests/2.31.0",
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    ];

    for (const ua of botUserAgents) {
      expect(isBotUserAgent(ua)).toBe(true);
    }
  });

  it("identifies real human smartphone and desktop user agents", () => {
    const realUserAgents = [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.105 Mobile Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    ];

    for (const ua of realUserAgents) {
      expect(isBotUserAgent(ua)).toBe(false);
    }
  });

  it("deduplicates daily unique visitors using anonymized cryptographic hash without storing plain IP", () => {
    function computeVisitorHash(ip: string, userAgent: string, qrId: number, dateStr: string): string {
      const salt = "intelliqr_anonymization_salt_2026";
      return crypto
        .createHash("sha256")
        .update(`${salt}:${ip}:${userAgent}:${qrId}:${dateStr}`)
        .digest("hex");
    }

    const ip1 = "203.0.113.195";
    const ua1 = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)";
    const qrId = 42;
    const today = "2026-10-13";

    const hashScan1 = computeVisitorHash(ip1, ua1, qrId, today);
    const hashScan2 = computeVisitorHash(ip1, ua1, qrId, today); // Same visitor scans again 5 minutes later
    const differentUserHash = computeVisitorHash("198.51.100.8", ua1, qrId, today);

    expect(hashScan1).toBe(hashScan2);
    expect(hashScan1).not.toBe(differentUserHash);
    // Plain IP address is never stored in visitorHash
    expect(hashScan1).not.toContain(ip1);
  });

  it("aggregates scan counts by device category correctly", () => {
    interface ScanEvent {
      id: number;
      device: "mobile" | "desktop" | "tablet";
      isBot: boolean;
    }

    const scans: ScanEvent[] = [
      { id: 1, device: "mobile", isBot: false },
      { id: 2, device: "mobile", isBot: false },
      { id: 3, device: "desktop", isBot: false },
      { id: 4, device: "tablet", isBot: false },
      { id: 5, device: "desktop", isBot: true }, // Should be excluded from user metric count
    ];

    const humanScans = scans.filter((s) => !s.isBot);
    const byDevice = humanScans.reduce<Record<string, number>>((acc, s) => {
      acc[s.device] = (acc[s.device] || 0) + 1;
      return acc;
    }, {});

    expect(byDevice.mobile).toBe(2);
    expect(byDevice.desktop).toBe(1);
    expect(byDevice.tablet).toBe(1);
    expect(humanScans).toHaveLength(4);
  });
});
