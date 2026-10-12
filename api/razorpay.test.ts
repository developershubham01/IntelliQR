import { describe, it, expect } from "vitest";
import crypto from "crypto";
import {
  verifyPaymentSignature,
  verifyWebhookSignature,
  createRazorpayOrder,
} from "../server/lib/razorpay.js";
import {
  AUTHORITATIVE_PLANS,
  getAuthoritativePlan,
} from "../server/lib/plans.js";

describe("Razorpay Integration Test Suite", () => {
  const testSecret = "test_razorpay_secret_key_123456";
  const testWebhookSecret = "test_webhook_secret_key_123456";

  describe("1. Payment Signature Verification (Standard Checkout)", () => {
    it("should successfully verify a valid HMAC SHA256 payment signature", () => {
      const orderId = "order_OXYZ1234567890";
      const paymentId = "pay_PXYZ1234567890";

      // Compute standard Razorpay signature
      const expectedSignature = crypto
        .createHmac("sha256", testSecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      const isValid = verifyPaymentSignature({
        orderId,
        paymentId,
        signature: expectedSignature,
        secret: testSecret,
      });

      expect(isValid).toBe(true);
    });

    it("should reject an altered or tampered payment signature", () => {
      const orderId = "order_OXYZ1234567890";
      const paymentId = "pay_PXYZ1234567890";
      const tamperedSignature = "tampered_invalid_signature_hex_code_123456";

      const isValid = verifyPaymentSignature({
        orderId,
        paymentId,
        signature: tamperedSignature,
        secret: testSecret,
      });

      expect(isValid).toBe(false);
    });

    it("should reject verification when orderId or paymentId are missing", () => {
      expect(
        verifyPaymentSignature({
          orderId: "",
          paymentId: "pay_123",
          signature: "some_sig",
          secret: testSecret,
        })
      ).toBe(false);

      expect(
        verifyPaymentSignature({
          orderId: "order_123",
          paymentId: "",
          signature: "some_sig",
          secret: testSecret,
        })
      ).toBe(false);
    });
  });

  describe("2. Webhook Signature Verification", () => {
    it("should successfully verify an authentic Razorpay webhook signature", () => {
      const rawPayload = JSON.stringify({
        event: "payment.captured",
        payload: {
          payment: {
            entity: {
              id: "pay_XYZ987",
              order_id: "order_ABC123",
              amount: 79900,
              currency: "INR",
              status: "captured",
            },
          },
        },
      });

      const validWebhookSig = crypto
        .createHmac("sha256", testWebhookSecret)
        .update(rawPayload)
        .digest("hex");

      const isValid = verifyWebhookSignature({
        rawBody: rawPayload,
        signature: validWebhookSig,
        webhookSecret: testWebhookSecret,
      });

      expect(isValid).toBe(true);
    });

    it("should reject a forged webhook payload or signature", () => {
      const rawPayload = JSON.stringify({ event: "payment.captured" });
      const forgedSig = "forged_webhook_signature_value";

      const isValid = verifyWebhookSignature({
        rawBody: rawPayload,
        signature: forgedSig,
        webhookSecret: testWebhookSecret,
      });

      expect(isValid).toBe(false);
    });
  });

  describe("3. Authoritative Plan Pricing & Quota Integrity", () => {
    it("should have correct prices in paise and INR currency", () => {
      const proMonthly = getAuthoritativePlan("pro_monthly");
      expect(proMonthly).toBeDefined();
      expect(proMonthly?.amount).toBe(79900); // ₹799 in paise
      expect(proMonthly?.currency).toBe("INR");
      expect(proMonthly?.tier).toBe("pro");

      const proYearly = getAuthoritativePlan("pro_yearly");
      expect(proYearly?.amount).toBe(699900); // ₹6,999 in paise
      expect(proYearly?.billingInterval).toBe("yearly");

      const businessMonthly = getAuthoritativePlan("business_monthly");
      expect(businessMonthly?.amount).toBe(249900); // ₹2,499 in paise

      const businessYearly = getAuthoritativePlan("business_yearly");
      expect(businessYearly?.amount).toBe(2199900); // ₹21,999 in paise
    });

    it("should return null for non-existent or client-tampered plan IDs", () => {
      expect(getAuthoritativePlan("hacked_free_pro_plan")).toBeNull();
      expect(getAuthoritativePlan("")).toBeNull();
      expect(getAuthoritativePlan("pro_discount_0_dollars")).toBeNull();
    });

    it("should define strict tiered feature limits", () => {
      const free = AUTHORITATIVE_PLANS.free;
      expect(free.featureLimits.maxDynamicQRs).toBe(3);
      expect(free.featureLimits.canRemoveWatermark).toBe(false);

      const pro = AUTHORITATIVE_PLANS.pro_monthly;
      expect(pro.featureLimits.maxDynamicQRs).toBe(50);
      expect(pro.featureLimits.canRemoveWatermark).toBe(true);
      expect(pro.featureLimits.exportFormats).toContain("pdf");
      expect(pro.featureLimits.exportFormats).toContain("svg");

      const business = AUTHORITATIVE_PLANS.business_monthly;
      expect(business.featureLimits.maxDynamicQRs).toBe(500);
      expect(business.featureLimits.customDomain).toBe(true);
      expect(business.featureLimits.apiAccess).toBe(true);
    });
  });

  describe("4. Razorpay Order Generation", () => {
    it("should create a valid order payload with receipt and paise amounts", async () => {
      const order = await createRazorpayOrder({
        amount: 79900,
        currency: "INR",
        receipt: "rcpt_test_001",
        notes: { userId: "42", planId: "pro_monthly" },
      });

      expect(order).toBeDefined();
      expect(order.id).toBeTruthy();
      expect(order.amount).toBe(79900);
      expect(order.currency).toBe("INR");
      expect(order.receipt).toBe("rcpt_test_001");
    });
  });
});
