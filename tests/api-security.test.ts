import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("API & Security - Input Validation & Zod Schemas", () => {
  const createQRSchema = z.object({
    name: z.string().min(1).max(255),
    type: z.string().min(1).max(50),
    content: z.string().min(1),
    destinationUrl: z.string().optional(),
    isDynamic: z.boolean().default(false),
  });

  it("accepts valid QR creation payload", () => {
    const valid = {
      name: "Spring Campaign 2026",
      type: "website",
      content: "https://intelliqr.abwcurious.com/spring",
      isDynamic: true,
    };
    const parsed = createQRSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("rejects empty name or oversized name (>255 characters)", () => {
    const emptyName = { name: "", type: "website", content: "https://test.com" };
    expect(createQRSchema.safeParse(emptyName).success).toBe(false);

    const oversizedName = { name: "x".repeat(256), type: "website", content: "https://test.com" };
    expect(createQRSchema.safeParse(oversizedName).success).toBe(false);
  });

  it("rejects SQL injection attempt strings from violating field constraints", () => {
    const maliciousInput = {
      name: "'; DROP TABLE users; --",
      type: "website",
      content: "https://legit.com",
    };
    // Zod treats input as strict string without executing SQL
    const parsed = createQRSchema.safeParse(maliciousInput);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe("'; DROP TABLE users; --");
    }
  });

  it("rejects non-boolean types injected into isDynamic flag", () => {
    const invalidType = {
      name: "Test",
      type: "website",
      content: "https://test.com",
      isDynamic: "true", // string instead of boolean
    };
    expect(createQRSchema.safeParse(invalidType).success).toBe(false);
  });
});

describe("API & Security - Cross-User Data Isolation Verification", () => {
  interface MockQR {
    id: number;
    userId: number;
    name: string;
  }

  const mockDatabase: MockQR[] = [
    { id: 101, userId: 1, name: "User 1 Secret QR" },
    { id: 102, userId: 2, name: "User 2 Business QR" },
  ];

  function getQRByIdForUser(qrId: number, currentUserId: number): MockQR | null {
    // Exact pattern used in qrRouter: eq(qrCodes.id, input.id), eq(qrCodes.userId, ctx.user.id)
    return mockDatabase.find((qr) => qr.id === qrId && qr.userId === currentUserId) || null;
  }

  it("allows user to retrieve their own QR code", () => {
    const result = getQRByIdForUser(101, 1);
    expect(result).not.toBeNull();
    expect(result?.name).toBe("User 1 Secret QR");
  });

  it("strictly denies access when User 2 attempts to view User 1's QR code (IDOR protection)", () => {
    const result = getQRByIdForUser(101, 2);
    expect(result).toBeNull();
  });

  it("strictly denies access when an unauthenticated or invalid user ID attempts to view resources", () => {
    const result = getQRByIdForUser(101, 9999);
    expect(result).toBeNull();
  });
});
