import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "./middleware.js";
import { AUTHORITATIVE_PLANS, getAuthoritativePlan } from "./lib/plans.js";
import { createRazorpayOrder } from "./lib/razorpay.js";
import {
  createPendingPayment,
  verifyAndActivatePayment,
  getUserSubscriptionDetails,
  getUserPaymentHistory,
  cancelUserSubscription,
} from "./queries/billing.js";
import { env } from "./lib/env.js";

export const billingRouter = createRouter({
  /**
   * Public list of available subscription plans
   */
  getPlans: publicQuery.query(() => {
    return Object.values(AUTHORITATIVE_PLANS);
  }),

  /**
   * Get current user's subscription details and feature limits
   */
  getMySubscription: authedQuery.query(async ({ ctx }) => {
    const details = await getUserSubscriptionDetails(ctx.user.id);
    return details;
  }),

  /**
   * Get payment history for current user
   */
  getMyPayments: authedQuery.query(async ({ ctx }) => {
    const history = await getUserPaymentHistory(ctx.user.id);
    return history;
  }),

  /**
   * Creates a Razorpay checkout order for an authoritative plan
   */
  createOrder: authedQuery
    .input(
      z.object({
        planId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = getAuthoritativePlan(input.planId);
      if (!plan) {
        throw new Error("Invalid plan selected.");
      }

      if (plan.amount === 0) {
        throw new Error("Free plan does not require a payment checkout.");
      }

      const receipt = `rcpt_${ctx.user.id}_${Date.now()}`;
      const razorpayOrder = await createRazorpayOrder({
        amount: plan.amount,
        currency: plan.currency,
        receipt,
        notes: {
          userId: String(ctx.user.id),
          userEmail: ctx.user.email || "",
          planId: plan.id,
          planName: plan.name,
        },
      });

      // Persist pending payment record locally in database
      await createPendingPayment({
        userId: ctx.user.id,
        planId: plan.id,
        orderId: razorpayOrder.id,
        amount: plan.amount,
        currency: plan.currency,
        notes: {
          receipt,
          planName: plan.name,
        },
      });

      return {
        orderId: razorpayOrder.id,
        amount: plan.amount,
        currency: plan.currency,
        planName: plan.name,
        keyId: env.razorpayKeyId,
        isMock: razorpayOrder.isMock,
        errorReason: razorpayOrder.errorReason,
        user: {
          name: ctx.user.name || "",
          email: ctx.user.email || "",
          phone: ctx.user.phone || "",
        },
      };
    }),

  /**
   * Verifies payment signature and activates subscription
   */
  verifyPayment: authedQuery
    .input(
      z.object({
        orderId: z.string().min(1),
        paymentId: z.string().min(1),
        signature: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await verifyAndActivatePayment({
        userId: ctx.user.id,
        orderId: input.orderId,
        paymentId: input.paymentId,
        signature: input.signature,
      });

      return result;
    }),

  /**
   * Cancels user subscription at the end of billing period
   */
  cancelSubscription: authedQuery.mutation(async ({ ctx }) => {
    const cancelled = await cancelUserSubscription(ctx.user.id);
    return { success: true, cancelled };
  }),
});
