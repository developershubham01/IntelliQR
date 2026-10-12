import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { loadRazorpayScript } from "@/lib/razorpay";
import { toast } from "sonner";
import {
  Check, Zap, Building2, Crown, ArrowRight, Sparkles, Loader2, ShieldCheck, CheckCircle2
} from "lucide-react";
import SplitText from "@/components/ui/SplitText";

interface PlanConfig {
  id: string;
  tier: "free" | "pro" | "business" | "enterprise";
  name: string;
  icon: any;
  inrPrice: { monthly: number; yearly: number };
  usdPrice: { monthly: number; yearly: number };
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  color: string;
}

const pricingPlans: PlanConfig[] = [
  {
    id: "free",
    tier: "free",
    name: "Free",
    icon: Sparkles,
    inrPrice: { monthly: 0, yearly: 0 },
    usdPrice: { monthly: 0, yearly: 0 },
    description: "Perfect for personal use and getting started.",
    features: [
      "5 generations/day (No Login)",
      "Unlimited static QRs after free Sign-Up",
      "Up to 3 Dynamic QR codes",
      "All 25+ QR types & styling tools",
      "PNG & JPG export (512px)",
      "Last 10 scan tracking history",
    ],
    cta: "Get Started Free",
    popular: false,
    color: "#A9B9CC",
  },
  {
    id: "pro",
    tier: "pro",
    name: "Pro",
    icon: Zap,
    inrPrice: { monthly: 799, yearly: 6999 },
    usdPrice: { monthly: 9, yearly: 79 },
    description: "For professionals who need power, styling, and high-res vector exports.",
    features: [
      "Everything in Free",
      "Up to 50 Dynamic QR codes",
      "Advanced customization & logo embedding",
      "SVG & 300 DPI PDF vector export",
      "All sizes up to 2048px",
      "Unlimited scan tracking (90 days retention)",
      "Bulk export & custom color palettes",
      "Priority customer support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    color: "#00F0FF",
  },
  {
    id: "business",
    tier: "business",
    name: "Business",
    icon: Building2,
    inrPrice: { monthly: 2499, yearly: 21999 },
    usdPrice: { monthly: 29, yearly: 249 },
    description: "For high-scale teams requiring API, white-label, and custom domains.",
    features: [
      "Everything in Pro",
      "Up to 500 Dynamic QR codes",
      "Custom branded tracking domains",
      "Developer API access (10,000 calls/mo)",
      "White-label exports & remove branding",
      "Team collaboration (5 seats)",
      "365-day deep analytics retention",
      "Dedicated account manager",
    ],
    cta: "Upgrade to Business",
    popular: false,
    color: "#D0FF59",
  },
  {
    id: "enterprise",
    tier: "enterprise",
    name: "Enterprise",
    icon: Crown,
    inrPrice: { monthly: 0, yearly: 0 },
    usdPrice: { monthly: 0, yearly: 0 },
    description: "Custom enterprise solutions and SLA guarantees for organizations.",
    features: [
      "Everything in Business",
      "Unlimited dynamic QR codes",
      "Unlimited team seats & SSO",
      "Unlimited API calls & webhooks",
      "On-premise / isolated cloud option",
      "Custom SLA & 24/7 phone assistance",
      "Custom contract & invoices",
    ],
    cta: "Contact Sales",
    popular: false,
    color: "#FF2BD6",
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = useState<string | null>(null);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState<{
    planName: string;
    expiresAt: string;
  } | null>(null);

  // Queries
  const { data: subscriptionData, refetch: refetchSubscription } =
    trpc.billing.getMySubscription.useQuery(undefined, {
      enabled: isAuthenticated,
    });

  // Mutations
  const createOrderMutation = trpc.billing.createOrder.useMutation();
  const verifyPaymentMutation = trpc.billing.verifyPayment.useMutation();

  const handlePlanSelect = async (plan: PlanConfig) => {
    if (plan.tier === "enterprise") {
      navigate("/contact");
      return;
    }

    if (plan.tier === "free") {
      navigate("/generator");
      return;
    }

    // Require authentication
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to subscribe.");
      navigate("/login?redirect=/pricing");
      return;
    }

    // Check if user is already on this tier
    if (subscriptionData?.tier === plan.tier && subscriptionData?.status === "active") {
      toast.info(`You are currently on the active ${plan.name} plan.`);
      return;
    }

    const planKey = `${plan.id}_${isYearly ? "yearly" : "monthly"}`;
    setCheckoutLoadingPlan(plan.id);

    try {
      // 1. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Could not load payment gateway checkout. Please check your network connection.");
        setCheckoutLoadingPlan(null);
        return;
      }

      // 2. Create authoritative order on backend
      const orderData = await createOrderMutation.mutateAsync({
        planId: planKey,
      });

      // 3. Configure Razorpay Standard Checkout
      const activeKey = orderData.keyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "";
      const rzpOptions = {
        key: activeKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "IntelliQR SaaS",
        description: `${orderData.planName} Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.user.name || undefined,
          email: orderData.user.email || undefined,
          contact: orderData.user.phone || undefined,
        },
        theme: {
          color: "#4F46E5",
        },
        handler: async (response: any) => {
          try {
            toast.loading("Verifying your payment securely...", { id: "payment-verify" });
            const verification = await verifyPaymentMutation.mutateAsync({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            toast.dismiss("payment-verify");
            toast.success("Payment verified! Your subscription is now active.");
            await refetchSubscription();

            setPaymentSuccessModal({
              planName: verification.plan?.name || orderData.planName,
              expiresAt: new Date(verification.expiresAt).toLocaleDateString(),
            });
          } catch (err: any) {
            toast.dismiss("payment-verify");
            toast.error(err.message || "Payment verification failed. Please contact support.");
          } finally {
            setCheckoutLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setCheckoutLoadingPlan(null);
            toast.info("Payment was cancelled or closed.");
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not initialized.");
      }

      const rzpInstance = new window.Razorpay(rzpOptions);
      rzpInstance.open();
    } catch (err: any) {
      console.error("[Checkout] Error:", err);
      toast.error(err.message || "Unable to initialize checkout. Please try again.");
      setCheckoutLoadingPlan(null);
    }
  };

  const currentTier = subscriptionData?.tier || "free";

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <SEOHead
        title="IntelliQR Pricing – Transparent Free, Pro & Business Plans"
        description="Affordable, transparent pricing for dynamic QR generation, tracking, and vector exports. Pay in INR or USD via secure Razorpay checkout."
        canonicalUrl="https://intelli-qr.vercel.app/pricing"
        breadcrumbs={[{ name: "Pricing", url: "/pricing" }]}
      />

      <Header />

      {/* Success Modal */}
      <AnimatePresence>
        {paymentSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl text-center border border-slate-100"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                Subscription Activated!
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                You have successfully upgraded to the{" "}
                <strong className="text-slate-900">{paymentSuccessModal.planName}</strong> plan.
                All dynamic features, high-res exports, and analytics retention are now unlocked.
              </p>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 mb-6 flex justify-between">
                <span>Active Until:</span>
                <span className="font-bold text-slate-900">{paymentSuccessModal.expiresAt}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentSuccessModal(null)}
                  className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  Close
                </button>
                <Link
                  to="/dashboard"
                  className="flex-1 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all text-center"
                >
                  Go to Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="sarvam-gradient pt-36 sm:pt-40 lg:pt-44 pb-20 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex justify-start max-w-3xl mx-auto mb-4">
            <Breadcrumbs items={[{ name: "Pricing", url: "/pricing" }]} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-800 mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Secured by Razorpay • Instant Activation
            </div>

            <h1 className="text-5xl sm:text-6xl font-serif text-slate-900 mb-6 tracking-tight">
              <SplitText
                text="Simple, transparent pricing"
                tag="span"
                splitType="chars"
                delay={35}
                duration={0.8}
                ease="power3.out"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0}
                rootMargin="0px"
              />
            </h1>
            <p className="text-slate-700/80 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Choose the plan that fits your needs. Upgrade, downgrade, or cancel anytime with secure instant checkout.
            </p>

            {/* Toggle bar for Billing Cycle & Currency */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Monthly / Yearly Toggle */}
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md rounded-full p-1 border border-white/80 shadow-sm">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
                    !isYearly
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 ${
                    isYearly
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Yearly
                  <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Save ~27%
                  </span>
                </button>
              </div>

              {/* Currency Selector */}
              <div className="inline-flex items-center gap-1 bg-white/60 backdrop-blur-md rounded-full p-1 border border-white/80 shadow-sm">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    currency === "INR"
                      ? "bg-[#2A2C3C] text-white"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    currency === "USD"
                      ? "bg-[#2A2C3C] text-white"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <div className="relative z-10 py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, i) => {
              const isCurrent = currentTier === plan.tier;
              const inrPrice = isYearly ? plan.inrPrice.yearly : plan.inrPrice.monthly;
              const usdPrice = isYearly ? plan.usdPrice.yearly : plan.usdPrice.monthly;
              const isEnterprise = plan.tier === "enterprise";
              const isFree = plan.tier === "free";

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`flex flex-col bg-white border rounded-[28px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative ${
                    plan.popular
                      ? "border-indigo-500/60 shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                      : isCurrent
                      ? "border-emerald-400 ring-2 ring-emerald-400/20"
                      : "border-slate-100"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                      Most Popular
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                      Current Plan
                    </div>
                  )}

                  {/* Top Illustration Block */}
                  <div
                    className="w-full h-[110px] rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden bg-gradient-to-br"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${plan.color}30, ${plan.color}10)`,
                    }}
                  >
                    <plan.icon className="w-8 h-8 text-slate-800" />
                  </div>

                  <h3 className="text-xl font-bold mb-1 text-slate-900 tracking-tight">{plan.name}</h3>
                  <p className="text-slate-500 text-xs mb-5 font-medium leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    {!isEnterprise ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                          {currency === "INR" ? `₹${inrPrice.toLocaleString()}` : `$${usdPrice}`}
                        </span>
                        {!isFree && (
                          <span className="text-slate-400 text-sm font-semibold">
                            /{isYearly ? "year" : "month"}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-3xl font-extrabold text-slate-900 tracking-tight">Custom</div>
                    )}

                    {isYearly && !isFree && !isEnterprise && (
                      <div className="text-[11px] text-indigo-600 font-bold mt-1">
                        {currency === "INR"
                          ? `Save ₹${(plan.inrPrice.monthly * 12 - plan.inrPrice.yearly).toLocaleString()}/year`
                          : `Save $${plan.usdPrice.monthly * 12 - plan.usdPrice.yearly}/year`}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-500" />
                        <span className="text-sm text-slate-600 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={checkoutLoadingPlan === plan.id || isCurrent}
                    className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 ${
                      isCurrent
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                        : plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 cursor-pointer"
                        : "bg-[#2A2C3C] hover:bg-[#1A1C29] text-white cursor-pointer"
                    }`}
                  >
                    {checkoutLoadingPlan === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Opening Gateway...
                      </>
                    ) : isCurrent ? (
                      "Active Plan"
                    ) : (
                      <>
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Secure Payment Badges */}
          <div className="mt-16 text-center space-y-2">
            <div className="inline-flex items-center gap-4 text-xs text-slate-500 font-semibold bg-white border border-slate-200/60 rounded-full px-6 py-2 shadow-sm">
              <span>UPI (Google Pay, PhonePe, Paytm)</span>
              <span>•</span>
              <span>Credit & Debit Cards</span>
              <span>•</span>
              <span>NetBanking (50+ Banks)</span>
              <span>•</span>
              <span>256-Bit SSL Encrypted</span>
            </div>
            <p className="text-xs text-slate-400">
              Need assistance?{" "}
              <Link to="/contact" className="text-indigo-600 font-bold hover:underline">
                Contact our sales and billing support
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
