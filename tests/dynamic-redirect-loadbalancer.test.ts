import { describe, it, expect } from "vitest";
import { isValidRedirectUrl } from "../server/redirect-handler.js";

describe("Dynamic QR - Load Balancer & Weighted Distribution Algorithm", () => {
  function selectWeightedTarget(targets: Array<{ url: string; weight: number }>, randomValue: number): string {
    const totalWeight = targets.reduce((sum, t) => sum + t.weight, 0);
    let rand = randomValue * totalWeight;
    for (const target of targets) {
      if (rand < target.weight) {
        return target.url;
      }
      rand -= target.weight;
    }
    return targets[targets.length - 1].url;
  }

  it("distributes traffic proportionally according to weights (e.g., 80% / 20%)", () => {
    const targets = [
      { url: "https://shop.com/landing-a", weight: 80 },
      { url: "https://shop.com/landing-b", weight: 20 },
    ];

    let countA = 0;
    let countB = 0;
    const TOTAL_SIMULATIONS = 10000;

    for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
      const selected = selectWeightedTarget(targets, Math.random());
      if (selected === "https://shop.com/landing-a") countA++;
      else if (selected === "https://shop.com/landing-b") countB++;
    }

    // Expect ~80% (+/- 3% margin) for Target A
    const ratioA = countA / TOTAL_SIMULATIONS;
    expect(ratioA).toBeGreaterThan(0.77);
    expect(ratioA).toBeLessThan(0.83);
  });

  it("handles equal 50/50 split evenly across destinations", () => {
    const targets = [
      { url: "https://abtest.com/variant-1", weight: 50 },
      { url: "https://abtest.com/variant-2", weight: 50 },
    ];

    let count1 = 0;
    const TOTAL_SIMULATIONS = 10000;

    for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
      const selected = selectWeightedTarget(targets, Math.random());
      if (selected === "https://abtest.com/variant-1") count1++;
    }

    const ratio1 = count1 / TOTAL_SIMULATIONS;
    expect(ratio1).toBeGreaterThan(0.47);
    expect(ratio1).toBeLessThan(0.53);
  });

  it("falls back safely if targets array is empty or has a single target", () => {
    const targets = [{ url: "https://solotarget.com", weight: 100 }];
    const selected = selectWeightedTarget(targets, 0.5);
    expect(selected).toBe("https://solotarget.com");
  });
});

describe("Dynamic QR - Security & Protocol Sanitization", () => {
  it("strictly disallows dangerous URI schemes that can execute code", () => {
    const dangerous = [
      "javascript:alert(document.cookie)",
      "JAVASCRIPT:void(0)",
      "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
      "vbscript:msgbox(1)",
      "file:///C:/Windows/System32/drivers/etc/hosts",
    ];

    for (const url of dangerous) {
      expect(isValidRedirectUrl(url)).toBe(false);
    }
  });

  it("allows standard secure web destinations and internal routes", () => {
    const safe = [
      "https://intelliqr.abwcurious.com",
      "https://sub.domain.co.uk/path/file.html?param=value#section",
      "http://insecure-legacy-site.org",
      "/p/bella-italia-menu-2026",
      "/ticket/verify?code=TKT-9921",
    ];

    for (const url of safe) {
      expect(isValidRedirectUrl(url)).toBe(true);
    }
  });

  it("blocks directory traversal attempts in relative internal URLs", () => {
    expect(isValidRedirectUrl("/p/../../etc/passwd")).toBe(false);
    expect(isValidRedirectUrl("/p/..\\..\\windows")).toBe(false);
  });
});
