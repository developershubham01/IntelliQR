import { Hono } from "hono";
import { authenticateRequest } from "./lib/auth.js";
import { AUTHORITATIVE_PLANS, getAuthoritativePlan } from "./lib/plans.js";
import { createRazorpayOrder, verifyWebhookSignature } from "./lib/razorpay.js";
import {
  createPendingPayment,
  verifyAndActivatePayment,
  getUserSubscriptionDetails,
  getUserPaymentHistory,
  cancelUserSubscription,
  processRazorpayWebhookEvent,
} from "./queries/billing.js";
import { env } from "./lib/env.js";

export const restBillingApp = new Hono();

// Helper to authenticate Hono request
async function getAuthenticatedUser(req: Request) {
  try {
    return await authenticateRequest(req.headers);
  } catch {
    return null;
  }
}

/**
 * POST /api/payments/create-order
 */
restBillingApp.post("/payments/create-order", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: "Unauthorized. Please sign in first." }, 401);
  }

  try {
    const body = await c.req.json();
    const { planId } = body;

    const plan = getAuthoritativePlan(planId);
    if (!plan) {
      return c.json({ error: "Invalid subscription plan selected." }, 400);
    }

    if (plan.amount === 0) {
      return c.json({ error: "Free plan does not require checkout." }, 400);
    }

    const receipt = `rcpt_${user.id}_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder({
      amount: plan.amount,
      currency: plan.currency,
      receipt,
      notes: {
        userId: String(user.id),
        userEmail: user.email || "",
        planId: plan.id,
        planName: plan.name,
      },
    });

    await createPendingPayment({
      userId: user.id,
      planId: plan.id,
      orderId: razorpayOrder.id,
      amount: plan.amount,
      currency: plan.currency,
      notes: { receipt, planName: plan.name },
    });

    return c.json({
      orderId: razorpayOrder.id,
      amount: plan.amount,
      currency: plan.currency,
      planName: plan.name,
      keyId: env.razorpayKeyId,
      user: {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      },
    });
  } catch (err: any) {
    console.error("[REST /payments/create-order] Error:", err);
    return c.json({ error: err.message || "Failed to create payment order." }, 500);
  }
});

/**
 * POST /api/payments/verify
 */
restBillingApp.post("/payments/verify", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: "Unauthorized. Please sign in first." }, 401);
  }

  try {
    const body = await c.req.json();
    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId || !signature) {
      return c.json({ error: "Missing required payment verification parameters." }, 400);
    }

    const result = await verifyAndActivatePayment({
      userId: user.id,
      orderId,
      paymentId,
      signature,
    });

    return c.json(result);
  } catch (err: any) {
    console.error("[REST /payments/verify] Error:", err);
    return c.json({ error: err.message || "Payment verification failed." }, 400);
  }
});

/**
 * POST /api/webhooks/razorpay
 * Verifies raw body signature and handles events idempotently
 */
restBillingApp.post("/webhooks/razorpay", async (c) => {
  try {
    const rawBody = await c.req.text();
    const signature = c.req.header("x-razorpay-signature") || "";

    const isValid = verifyWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      console.warn("[REST /webhooks/razorpay] Signature verification failed.");
      return c.json({ error: "Invalid webhook signature." }, 400);
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const eventType = event.event || "unknown";

    const result = await processRazorpayWebhookEvent({
      eventId,
      eventType,
      payload: event.payload || event,
    });

    return c.json({ status: "ok", result });
  } catch (err: any) {
    console.error("[REST /webhooks/razorpay] Error:", err);
    return c.json({ error: err.message || "Webhook handling error." }, 500);
  }
});

/**
 * GET /api/billing/subscription
 */
restBillingApp.get("/billing/subscription", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: "Unauthorized." }, 401);
  }

  const details = await getUserSubscriptionDetails(user.id);
  return c.json(details);
});

/**
 * GET /api/billing/payments
 */
restBillingApp.get("/billing/payments", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: "Unauthorized." }, 401);
  }

  const history = await getUserPaymentHistory(user.id);
  return c.json({ payments: history });
});

/**
 * POST /api/billing/cancel-subscription
 */
restBillingApp.post("/billing/cancel-subscription", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: "Unauthorized." }, 401);
  }

  const cancelled = await cancelUserSubscription(user.id);
  return c.json({ success: true, cancelled });
});
