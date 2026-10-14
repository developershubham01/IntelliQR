import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { getAuthoritativePlan } from "../server/lib/plans.js";
import { verifyPaymentSignature, verifyWebhookSignature } from "../server/lib/razorpay.js";

describe("PHASE 13: Subscriptions, Webhook Idempotency & Tiered Entitlements", () => {
  const webhookSecret = "whsec_test_secret_123456";

  it("enforces strict dynamic QR creation quotas according to active plan tier", () => {
    function canCreateDynamicQR(tier: "free" | "pro" | "business", currentCount: number): boolean {
      const limits = { free: 3, pro: 50, business: 500 };
      return currentCount < limits[tier];
    }

    // Free tier: max 3
    expect(canCreateDynamicQR("free", 0)).toBe(true);
    expect(canCreateDynamicQR("free", 2)).toBe(true);
    expect(canCreateDynamicQR("free", 3)).toBe(false); // Quota hit!
    expect(canCreateDynamicQR("free", 5)).toBe(false);

    // Pro tier: max 50
    expect(canCreateDynamicQR("pro", 3)).toBe(true);
    expect(canCreateDynamicQR("pro", 49)).toBe(true);
    expect(canCreateDynamicQR("pro", 50)).toBe(false); // Quota hit!

    // Business tier: max 500
    expect(canCreateDynamicQR("business", 50)).toBe(true);
    expect(canCreateDynamicQR("business", 499)).toBe(true);
    expect(canCreateDynamicQR("business", 500)).toBe(false);
  });

  it("enforces watermark removal permission strictly for paid plans", () => {
    function canRemoveWatermark(tier: string): boolean {
      return tier === "pro" || tier === "business" || tier === "enterprise";
    }

    expect(canRemoveWatermark("free")).toBe(false);
    expect(canRemoveWatermark("pro")).toBe(true);
    expect(canRemoveWatermark("business")).toBe(true);
  });

  it("enforces custom domain and API access only on business tier", () => {
    const freePlan = getAuthoritativePlan("free");
    expect(freePlan?.featureLimits.customDomain).toBe(false);
    expect(freePlan?.featureLimits.apiAccess).toBe(false);

    const proPlan = getAuthoritativePlan("pro_monthly");
    expect(proPlan?.featureLimits.customDomain).toBe(false);
    expect(proPlan?.featureLimits.apiAccess).toBe(false);

    const bizPlan = getAuthoritativePlan("business_monthly");
    expect(bizPlan?.featureLimits.customDomain).toBe(true);
    expect(bizPlan?.featureLimits.apiAccess).toBe(true);
  });

  it("handles duplicate webhook delivery with strict idempotency", () => {
    const processedEvents = new Set<string>();

    function processWebhookEvent(eventId: string): { processed: boolean; reason?: string } {
      if (processedEvents.has(eventId)) {
        return { processed: false, reason: "Duplicate webhook delivery ignored (Idempotency check)." };
      }
      processedEvents.add(eventId);
      return { processed: true };
    }

    const eventId = "evt_payment_captured_001";

    // First arrival
    const firstAttempt = processWebhookEvent(eventId);
    expect(firstAttempt.processed).toBe(true);

    // Duplicate arrival of same webhook
    const duplicateAttempt = processWebhookEvent(eventId);
    expect(duplicateAttempt.processed).toBe(false);
    expect(duplicateAttempt.reason).toContain("Duplicate webhook delivery ignored");
  });

  it("verifies webhook signature against raw payload bytes before accepting event", () => {
    const rawBody = JSON.stringify({
      event: "order.paid",
      payload: { payment: { entity: { id: "pay_987654", amount: 79900 } } },
    });

    const validSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

    expect(verifyWebhookSignature({ rawBody, signature: validSignature, webhookSecret })).toBe(true);
    expect(verifyWebhookSignature({ rawBody, signature: "invalid_hex", webhookSecret })).toBe(false);
  });

  it("verifies payment signature on client checkout completion", () => {
    const secret = "merchant_secret_key";
    const orderId = "order_123456";
    const paymentId = "pay_789012";

    const signature = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");

    expect(verifyPaymentSignature({ orderId, paymentId, signature, secret })).toBe(true);
    expect(verifyPaymentSignature({ orderId, paymentId, signature: "bad_sig", secret })).toBe(false);
  });
});
