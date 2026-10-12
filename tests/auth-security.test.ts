import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../server/lib/hash.js";
import { signSessionToken, verifySessionToken } from "../server/lib/auth.js";
import { Session } from "../contracts/constants.js";
import * as cookie from "cookie";

describe("Authentication & Security - Password Cryptography", () => {
  it("generates unique salt and secure scrypt hash for passwords", async () => {
    const password = "SuperSecretPassword123!";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    // Formatted as salt:key
    expect(hash1).toContain(":");
    expect(hash2).toContain(":");
    // Salts must be unique (cryptographic randomBytes)
    expect(hash1).not.toBe(hash2);
  });

  it("successfully verifies valid passwords against stored hash", async () => {
    const password = "CorrectHorseBatteryStaple!";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("strictly rejects incorrect passwords (prevents unauthorized access)", async () => {
    const password = "CorrectPassword123";
    const hash = await hashPassword(password);

    const isWrongValid = await verifyPassword("WrongPassword456", hash);
    expect(isWrongValid).toBe(false);

    const isSimilarValid = await verifyPassword("correctpassword123", hash); // Case-sensitivity test
    expect(isSimilarValid).toBe(false);
  });

  it("handles malformed or tampered hash strings gracefully without crashing", async () => {
    expect(await verifyPassword("password", "")).toBe(false);
    expect(await verifyPassword("password", "invalid_format")).toBe(false);
    expect(await verifyPassword("password", "salt_only:")).toBe(false);
    expect(await verifyPassword("password", ":key_only")).toBe(false);
  });
});

describe("Authentication & Security - JWT Session & Cookie Management", () => {
  it("signs and verifies cryptographic session tokens with unionId and clientId", async () => {
    const payload = {
      unionId: "email_qa_tester@intelliqr.app",
      clientId: "intelliqr-platform-test",
    };

    const token = await signSessionToken(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // Standard JWT Header.Payload.Signature

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.unionId).toBe(payload.unionId);
    expect(verified?.clientId).toBe(payload.clientId);
  });

  it("strictly rejects tampered JWT tokens", async () => {
    const payload = {
      unionId: "email_genuine@intelliqr.app",
      clientId: "intelliqr-platform-test",
    };

    const token = await signSessionToken(payload);
    const parts = token.split(".");
    // Tamper payload segment
    const tamperedPayload = Buffer.from(JSON.stringify({ unionId: "email_hacker@intelliqr.app", clientId: "fake" })).toString("base64url");
    const forgedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    const verified = await verifySessionToken(forgedToken);
    expect(verified).toBeNull();
  });

  it("rejects empty or null tokens safely", async () => {
    expect(await verifySessionToken("")).toBeNull();
    expect(await verifySessionToken(null as any)).toBeNull();
  });

  it("properly serializes logout cookie with maxAge=0 to invalidate sessions", () => {
    const serialized = cookie.serialize(Session.cookieName, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    expect(serialized).toContain(`${Session.cookieName}=;`);
    expect(serialized).toContain("Max-Age=0");
    expect(serialized).toContain("HttpOnly");
  });
});
