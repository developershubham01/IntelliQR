import { getDb } from "./connection.js";
import { plans, payments, subscriptions, users, webhookEvents } from "../../db/schema.js";
import { AUTHORITATIVE_PLANS, getAuthoritativePlan } from "../lib/plans.js";
import { verifyPaymentSignature } from "../lib/razorpay.js";
import { eq, desc, and } from "drizzle-orm";

/**
 * Ensures authoritative plans exist in the database
 */
export async function ensurePlansSeeded() {
  const db = getDb();
  for (const plan of Object.values(AUTHORITATIVE_PLANS)) {
    try {
      await db
        .insert(plans)
        .values({
          id: plan.id,
          name: plan.name,
          tier: plan.tier,
          amount: plan.amount,
          currency: plan.currency,
          billingInterval: plan.billingInterval,
          featureLimits: plan.featureLimits,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: plans.id,
          set: {
            name: plan.name,
            tier: plan.tier,
            amount: plan.amount,
            currency: plan.currency,
            billingInterval: plan.billingInterval,
            featureLimits: plan.featureLimits,
            isActive: true,
            updatedAt: new Date(),
          },
        });
    } catch (e) {
      // Ignore if table not yet created or migration pending
    }
  }
}

/**
 * Creates a pending local payment record before opening client checkout
 */
export async function createPendingPayment(data: {
  userId: number;
  planId: string;
  orderId: string;
  amount: number;
  currency?: string;
  notes?: Record<string, unknown>;
}) {
  const db = getDb();
  const [created] = await db
    .insert(payments)
    .values({
      userId: data.userId,
      planId: data.planId,
      razorpayOrderId: data.orderId,
      amount: data.amount,
      currency: data.currency || "INR",
      status: "pending",
      notes: data.notes || {},
    })
    .returning();
  return created;
}

/**
 * Cryptographically verifies and activates subscription upon payment completion
 */
export async function verifyAndActivatePayment(data: {
  userId: number;
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const db = getDb();

  // 1. Verify HMAC SHA256 Signature
  const isValid = verifyPaymentSignature({
    orderId: data.orderId,
    paymentId: data.paymentId,
    signature: data.signature,
  });

  if (!isValid) {
    throw new Error("Invalid Razorpay payment signature. Verification failed.");
  }

  // 2. Lookup existing pending transaction record
  const existingRows = await db
    .select()
    .from(payments)
    .where(and(eq(payments.razorpayOrderId, data.orderId), eq(payments.userId, data.userId)))
    .limit(1);

  if (existingRows.length === 0) {
    throw new Error("Payment order reference not found for this user.");
  }

  const paymentRecord = existingRows[0];
  const plan = getAuthoritativePlan(paymentRecord.planId);
  if (!plan) {
    throw new Error("Invalid subscription plan reference.");
  }

  // 3. Mark payment as captured (idempotent)
  await db
    .update(payments)
    .set({
      status: "captured",
      razorpayPaymentId: data.paymentId,
      razorpaySignature: data.signature,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, paymentRecord.id));

  // 4. Calculate subscription start & expiry dates
  const now = new Date();
  const durationDays = plan.billingInterval === "yearly" ? 365 : 30;
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  // 5. Upsert active subscription record
  const existingSubs = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, data.userId))
    .limit(1);

  if (existingSubs.length > 0) {
    await db
      .update(subscriptions)
      .set({
        planId: plan.id,
        status: "active",
        billingInterval: plan.billingInterval,
        currentPeriodStart: now,
        currentPeriodEnd: expiresAt,
        cancelAtPeriodEnd: false,
        updatedAt: now,
      })
      .where(eq(subscriptions.userId, data.userId));
  } else {
    await db.insert(subscriptions).values({
      userId: data.userId,
      planId: plan.id,
      status: "active",
      billingInterval: plan.billingInterval,
      currentPeriodStart: now,
      currentPeriodEnd: expiresAt,
      cancelAtPeriodEnd: false,
    });
  }

  // 6. Update user entitlements
  await db
    .update(users)
    .set({
      subscriptionTier: plan.tier,
      subscriptionStatus: "active",
      subscriptionExpiresAt: expiresAt,
      updatedAt: now,
    })
    .where(eq(users.id, data.userId));

  return {
    success: true,
    plan,
    expiresAt,
    paymentId: data.paymentId,
    orderId: data.orderId,
  };
}

/**
 * Retrieves the user's active subscription and limits
 */
export async function getUserSubscriptionDetails(userId: number) {
  const db = getDb();
  const userRows = await db
    .select({
      id: users.id,
      tier: users.subscriptionTier,
      status: users.subscriptionStatus,
      expiresAt: users.subscriptionExpiresAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userRows.length === 0) {
    return null;
  }

  const userRecord = userRows[0];
  const subRows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  const activeSub = subRows[0] || null;
  const currentPlan = getAuthoritativePlan(activeSub?.planId || "free") || AUTHORITATIVE_PLANS.free;

  // Check if subscription has expired
  const isExpired = userRecord.expiresAt && new Date(userRecord.expiresAt) < new Date();
  const effectiveTier = isExpired ? "free" : (userRecord.tier || "free");
  const effectivePlan = isExpired
    ? AUTHORITATIVE_PLANS.free
    : (getAuthoritativePlan(activeSub?.planId || "") || currentPlan);

  return {
    tier: effectiveTier,
    status: isExpired ? "expired" : (userRecord.status || "active"),
    expiresAt: userRecord.expiresAt,
    subscription: activeSub,
    plan: effectivePlan,
    limits: effectivePlan.featureLimits,
  };
}

/**
 * Gets payment history for a customer
 */
export async function getUserPaymentHistory(userId: number) {
  const db = getDb();
  return db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt))
    .limit(50);
}

/**
 * Cancels subscription at period end
 */
export async function cancelUserSubscription(userId: number) {
  const db = getDb();
  const updated = await db
    .update(subscriptions)
    .set({
      cancelAtPeriodEnd: true,
      cancelledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId))
    .returning();

  return updated[0] || null;
}

/**
 * Processes incoming Razorpay webhook idempotently
 */
export async function processRazorpayWebhookEvent(data: {
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
}) {
  const db = getDb();

  // Deduplication / Idempotency check
  const existingEvent = await db
    .select()
    .from(webhookEvents)
    .where(eq(webhookEvents.eventId, data.eventId))
    .limit(1);

  if (existingEvent.length > 0) {
    console.log(`[Webhook] Duplicate event ${data.eventId} already processed.`);
    return { status: "already_processed" };
  }

  // Insert event record as pending
  await db.insert(webhookEvents).values({
    eventId: data.eventId,
    eventType: data.eventType,
    status: "processing",
    payload: data.payload,
  });

  try {
    const paymentEntity = (data.payload as any)?.payment?.entity;

    if (data.eventType === "payment.captured" && paymentEntity) {
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      if (orderId) {
        const paymentRows = await db
          .select()
          .from(payments)
          .where(eq(payments.razorpayOrderId, orderId))
          .limit(1);

        if (paymentRows.length > 0) {
          const payment = paymentRows[0];
          const plan = getAuthoritativePlan(payment.planId);

          await db
            .update(payments)
            .set({
              status: "captured",
              razorpayPaymentId: paymentId,
              method: paymentEntity.method,
              updatedAt: new Date(),
            })
            .where(eq(payments.id, payment.id));

          if (plan) {
            const now = new Date();
            const durationDays = plan.billingInterval === "yearly" ? 365 : 30;
            const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

            await db
              .update(users)
              .set({
                subscriptionTier: plan.tier,
                subscriptionStatus: "active",
                subscriptionExpiresAt: expiresAt,
                updatedAt: now,
              })
              .where(eq(users.id, payment.userId));
          }
        }
      }
    } else if (data.eventType === "payment.failed" && paymentEntity) {
      const orderId = paymentEntity.order_id;
      if (orderId) {
        await db
          .update(payments)
          .set({
            status: "failed",
            updatedAt: new Date(),
          })
          .where(eq(payments.razorpayOrderId, orderId));
      }
    }

    // Mark webhook event as processed
    await db
      .update(webhookEvents)
      .set({
        status: "processed",
        processedAt: new Date(),
      })
      .where(eq(webhookEvents.eventId, data.eventId));

    return { status: "success" };
  } catch (err: any) {
    console.error("[Webhook] Processing error:", err);
    await db
      .update(webhookEvents)
      .set({
        status: "failed",
        errorMessage: err?.message || String(err),
      })
      .where(eq(webhookEvents.eventId, data.eventId));
    throw err;
  }
}
