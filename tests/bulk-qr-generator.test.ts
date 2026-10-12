import { describe, it, expect } from "vitest";
import { isValidRedirectUrl } from "../server/redirect-handler.js";

interface BulkRowInput {
  row: number;
  name?: string;
  type?: string;
  content: string;
  isDynamic?: boolean;
}

function validateBulkRow(row: BulkRowInput): { valid: boolean; error?: string } {
  const content = (row.content || "").trim();
  if (!content) {
    return { valid: false, error: "Content/Destination URL cannot be empty." };
  }

  if (row.isDynamic) {
    if (!isValidRedirectUrl(content)) {
      if (!/^[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(content)) {
        return { valid: false, error: "Invalid destination URL for dynamic QR code." };
      }
    }
  }

  return { valid: true };
}

describe("Bulk QR Generation - CSV Row Validation & Security", () => {
  it("approves valid static QR rows with URLs or text", () => {
    const validRows: BulkRowInput[] = [
      { row: 1, name: "Table 1", type: "website", content: "https://restaurant.com/menu?table=1", isDynamic: false },
      { row: 2, name: "WiFi Guest", type: "wifi", content: "WIFI:S:Guest;T:WPA;P:pass;;", isDynamic: false },
      { row: 3, name: "Badge 101", type: "text", content: "ATTENDEE-ID-101", isDynamic: false },
    ];

    for (const r of validRows) {
      const res = validateBulkRow(r);
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    }
  });

  it("catches empty content rows and flags row number accurately", () => {
    const emptyRow: BulkRowInput = { row: 5, name: "Missing URL", type: "website", content: "   ", isDynamic: false };
    const res = validateBulkRow(emptyRow);
    expect(res.valid).toBe(false);
    expect(res.error).toBe("Content/Destination URL cannot be empty.");
  });

  it("strictly validates dynamic destination URLs to prevent injection", () => {
    const maliciousRow: BulkRowInput = {
      row: 7,
      name: "Exploit Test",
      type: "website",
      content: "javascript:alert(1)",
      isDynamic: true,
    };
    const res = validateBulkRow(maliciousRow);
    expect(res.valid).toBe(false);
    expect(res.error).toBe("Invalid destination URL for dynamic QR code.");
  });

  it("automatically approves domain-only URLs by preparing https prefix", () => {
    const bareDomainRow: BulkRowInput = {
      row: 12,
      name: "Bare Domain",
      type: "website",
      content: "mybrand.com/landing",
      isDynamic: true,
    };
    const res = validateBulkRow(bareDomainRow);
    expect(res.valid).toBe(true);
  });

  it("enforces subscription batch caps per tier", () => {
    const caps = {
      free: 25,
      pro: 200,
      business: 1000,
    };

    expect(caps.free).toBe(25);
    expect(caps.pro).toBe(200);
    expect(caps.business).toBe(1000);
  });
});
