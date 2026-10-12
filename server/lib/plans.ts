export interface PlanDefinition {
  id: string;
  name: string;
  tier: "free" | "pro" | "business" | "enterprise";
  amount: number; // in paise (e.g. 79900 = ₹799)
  usdAmount: number; // for display reference ($)
  currency: string;
  billingInterval: "monthly" | "yearly";
  description: string;
  features: string[];
  featureLimits: {
    maxDynamicQRs: number;
    maxScansPerMonth: number;
    canRemoveWatermark: boolean;
    customDomain: boolean;
    analyticsRetentionDays: number;
    apiAccess: boolean;
    exportFormats: string[]; // ["png", "jpg", "svg", "pdf"]
    maxResolution: number; // 2048px
  };
}

export const AUTHORITATIVE_PLANS: Record<string, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    tier: "free",
    amount: 0,
    usdAmount: 0,
    currency: "INR",
    billingInterval: "monthly",
    description: "Perfect for personal use and getting started.",
    features: [
      "5 generations/day (No Login)",
      "Unlimited static QRs with free Sign-Up",
      "Up to 3 Dynamic QR codes",
      "All 25+ QR types & basic styles",
      "PNG & JPG export up to 512px",
      "Last 10 scans history",
    ],
    featureLimits: {
      maxDynamicQRs: 3,
      maxScansPerMonth: 500,
      canRemoveWatermark: false,
      customDomain: false,
      analyticsRetentionDays: 7,
      apiAccess: false,
      exportFormats: ["png", "jpg"],
      maxResolution: 512,
    },
  },

  pro_monthly: {
    id: "pro_monthly",
    name: "Pro Monthly",
    tier: "pro",
    amount: 79900, // ₹799/month
    usdAmount: 9,
    currency: "INR",
    billingInterval: "monthly",
    description: "For professionals who need power, styling, and high-res vector exports.",
    features: [
      "Everything in Free",
      "Up to 50 Dynamic QR codes",
      "Advanced customization & logo embedding",
      "SVG & 300 DPI PDF export",
      "All resolutions up to 2048px",
      "Unlimited scan tracking & 90-day retention",
      "Favorites & bulk actions",
      "Priority email support",
    ],
    featureLimits: {
      maxDynamicQRs: 50,
      maxScansPerMonth: 25000,
      canRemoveWatermark: true,
      customDomain: false,
      analyticsRetentionDays: 90,
      apiAccess: false,
      exportFormats: ["png", "jpg", "svg", "pdf"],
      maxResolution: 2048,
    },
  },

  pro_yearly: {
    id: "pro_yearly",
    name: "Pro Yearly",
    tier: "pro",
    amount: 699900, // ₹6,999/year (Save 27%)
    usdAmount: 79,
    currency: "INR",
    billingInterval: "yearly",
    description: "For professionals who need full power with yearly discount.",
    features: [
      "Everything in Pro Monthly",
      "Save ₹2,589 compared to monthly billing",
      "Up to 50 Dynamic QR codes",
      "Advanced customization & logo embedding",
      "SVG & PDF vector exports",
      "All resolutions up to 2048px",
      "Priority customer assistance",
    ],
    featureLimits: {
      maxDynamicQRs: 50,
      maxScansPerMonth: 25000,
      canRemoveWatermark: true,
      customDomain: false,
      analyticsRetentionDays: 90,
      apiAccess: false,
      exportFormats: ["png", "jpg", "svg", "pdf"],
      maxResolution: 2048,
    },
  },

  business_monthly: {
    id: "business_monthly",
    name: "Business Monthly",
    tier: "business",
    amount: 249900, // ₹2,499/month
    usdAmount: 29,
    currency: "INR",
    billingInterval: "monthly",
    description: "For teams and businesses with high volume, API, and custom domains.",
    features: [
      "Everything in Pro",
      "Unlimited Dynamic QR codes (up to 500)",
      "Team collaboration (5 seats)",
      "Developer API access (10,000 calls/mo)",
      "Custom branded tracking domains",
      "White-label exports & custom watermarks",
      "365-day detailed analytics retention",
      "Dedicated priority support",
    ],
    featureLimits: {
      maxDynamicQRs: 500,
      maxScansPerMonth: 250000,
      canRemoveWatermark: true,
      customDomain: true,
      analyticsRetentionDays: 365,
      apiAccess: true,
      exportFormats: ["png", "jpg", "svg", "pdf"],
      maxResolution: 4096,
    },
  },

  business_yearly: {
    id: "business_yearly",
    name: "Business Yearly",
    tier: "business",
    amount: 2199900, // ₹21,999/year (Save 26%)
    usdAmount: 249,
    currency: "INR",
    billingInterval: "yearly",
    description: "For high-scale teams requiring API, white-label, and yearly billing.",
    features: [
      "Everything in Business Monthly",
      "Save ₹7,989 compared to monthly billing",
      "Unlimited Dynamic QR codes (up to 500)",
      "Developer API access (10,000 calls/mo)",
      "Custom tracking domains",
      "White-label exports",
      "Dedicated account manager",
    ],
    featureLimits: {
      maxDynamicQRs: 500,
      maxScansPerMonth: 250000,
      canRemoveWatermark: true,
      customDomain: true,
      analyticsRetentionDays: 365,
      apiAccess: true,
      exportFormats: ["png", "jpg", "svg", "pdf"],
      maxResolution: 4096,
    },
  },
};

/**
 * Returns plan definition safely by id
 */
export function getAuthoritativePlan(planId: string): PlanDefinition | null {
  return AUTHORITATIVE_PLANS[planId] || null;
}
