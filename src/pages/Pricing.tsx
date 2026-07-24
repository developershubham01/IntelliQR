import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Check, Zap, Building2, Crown, ArrowRight, Sparkles,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    icon: Sparkles,
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for personal use and getting started.",
    features: [
      "5 generations/day (No Login)",
      "Unlimited after free Sign-Up",
      "All 25+ QR types",
      "Basic customization",
      "PNG & JPG export",
      "256px & 512px sizes",
      "History (last 10)",
    ],
    cta: "Get Started",
    popular: false,
    color: "#A9B9CC",
  },
  {
    name: "Pro",
    icon: Zap,
    price: { monthly: 9, yearly: 79 },
    description: "For professionals who need more power and flexibility.",
    features: [
      "Everything in Free",
      "Advanced customization",
      "SVG & PDF export",
      "All sizes up to 2048px",
      "Logo embedding",
      "Gradient support",
      "Unlimited history",
      "Favorites & folders",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    popular: true,
    color: "#00F0FF",
  },
  {
    name: "Business",
    icon: Building2,
    price: { monthly: 29, yearly: 249 },
    description: "For teams and businesses with advanced needs.",
    features: [
      "Everything in Pro",
      "Team collaboration (5 seats)",
      "Analytics dashboard",
      "API access (1,000 calls/mo)",
      "Custom domains",
      "White-label exports",
      "SSO authentication",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
    color: "#D0FF59",
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: { monthly: null, yearly: null },
    description: "Custom solutions for large organizations.",
    features: [
      "Everything in Business",
      "Unlimited team seats",
      "Unlimited API calls",
      "Custom integrations",
      "On-premise deployment",
      "Advanced analytics",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom SLA",
    ],
    cta: "Contact Us",
    popular: false,
    color: "#FF2BD6",
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <Header />

      {/* Hero Section */}
      <section className="sarvam-gradient pt-32 pb-20 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl font-serif text-slate-900 mb-6 tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-slate-700/80 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md rounded-full p-1 border border-white/60 shadow-sm">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all ${
                  !isYearly
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all flex items-center gap-2 ${
                  isYearly
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Yearly
                <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Save 25%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`flex flex-col bg-white border rounded-[28px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 relative ${
                  plan.popular ? "border-indigo-500/50 shadow-[0_8px_30px_rgba(99,102,241,0.04)]" : "border-slate-100/80"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                )}

                {/* Top Illustration Block */}
                <div
                  className="w-full h-[120px] rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden bg-gradient-to-br"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${plan.color}30, ${plan.color}10)`
                  }}
                >
                  <plan.icon className="w-8 h-8 text-slate-800" />
                </div>

                <h3 className="text-xl font-bold mb-1 text-slate-900 tracking-tight">{plan.name}</h3>
                <p className="text-slate-500 text-xs mb-5 font-medium leading-relaxed">{plan.description}</p>

                <div className="mb-6 pb-6 border-b border-slate-100">
                  {plan.price.monthly !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-slate-400 text-sm font-semibold">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </div>
                  ) : (
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">Custom</div>
                  )}
                  {isYearly && plan.price.yearly !== null && (
                    <div className="text-[11px] text-indigo-600 font-bold mt-1">
                      Save ${(plan.price.monthly! * 12) - plan.price.yearly}/year
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-500"
                      />
                      <span className="text-sm text-slate-600 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/generator"
                  className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10"
                      : "bg-[#2A2C3C] hover:bg-[#1A1C29] text-white"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FAQ Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-slate-500 font-medium">
              Have questions?{" "}
              <Link to="/faq" className="text-indigo-600 font-bold hover:underline">
                Check our FAQ
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
