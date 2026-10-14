import { describe, it, expect } from "vitest";
import { generateQRContent, generateQRCode } from "../src/lib/qr-generator";
import type { QRStyle } from "../src/types/qr";

const baseStyle: QRStyle = {
  foregroundColor: "#1E293B",
  backgroundColor: "#FFFFFF",
  transparentBackground: false,
  errorCorrectionLevel: "M",
  size: 320,
  padding: 2,
};

describe("PHASE 5: Complete QR Types Generation & Payload Integrity", () => {
  const qrTestCases = [
    {
      type: "website",
      data: { url: "https://intelliqr.app/campaign/spring2026?source=qr" },
      expected: "https://intelliqr.app/campaign/spring2026?source=qr",
    },
    {
      type: "text",
      data: { text: "Hello! Testing UTF-8: 🌍 日本語 Español Français हिन्दी 🚀" },
      expected: "Hello! Testing UTF-8: 🌍 日本語 Español Français हिन्दी 🚀",
    },
    {
      type: "wifi",
      data: { ssid: "Enterprise-Guest-5G", password: "SecretPassword#2026", encryption: "WPA", hidden: "false" },
      expected: "WIFI:S:Enterprise-Guest-5G;T:WPA;P:SecretPassword#2026;H:false;;",
    },
    {
      type: "phone",
      data: { phone: "+1 (555) 019-2834" },
      expected: "tel:+1 (555) 019-2834",
    },
    {
      type: "sms",
      data: { phone: "+919876543210", message: "Hello! Booking appointment for tomorrow." },
      expected: "sms:+919876543210?body=Hello!%20Booking%20appointment%20for%20tomorrow.",
    },
    {
      type: "whatsapp",
      data: { phone: "+1 (800) 555-0199", message: "Hello! Inquiring about custom design." },
      expected: "https://wa.me/18005550199?text=Hello!%20Inquiring%20about%20custom%20design.",
    },
    {
      type: "email",
      data: { to: "support@intelliqr.pro", subject: "Feedback", body: "Great app!" },
      expected: "mailto:support@intelliqr.pro?subject=Feedback&body=Great%20app!",
    },
    {
      type: "maps",
      data: { query: "Statue of Liberty, NY" },
      expected: "https://www.google.com/maps/search/?api=1&query=Statue%20of%20Liberty%2C%20NY",
    },
    {
      type: "paypal",
      data: { email: "merchant@store.com", amount: "19.99", currency: "USD" },
      checker: (val: string) => val.includes("merchant%40store.com") && val.includes("amount=19.99"),
    },
    {
      type: "upi",
      data: { vpa: "store@okaxis", name: "Modern Mart", amount: "500", note: "Groceries" },
      checker: (val: string) => val.startsWith("upi://pay?") && val.includes("pa=store%40okaxis"),
    },
    {
      type: "restaurant_menu",
      data: { menuUrl: "https://intelliqr.app/p/ristorante-bella-italia" },
      expected: "https://intelliqr.app/p/ristorante-bella-italia",
    },
    {
      type: "hotel_info",
      data: { guestPortalUrl: "https://intelliqr.app/p/azure-hotel-suite-101" },
      expected: "https://intelliqr.app/p/azure-hotel-suite-101",
    },
    {
      type: "product_catalog",
      data: { specsUrl: "https://brand.com/products/model-x" },
      expected: "https://brand.com/products/model-x",
    },
    {
      type: "real_estate",
      data: { listingUrl: "https://realty.com/homes/oak-ridge-villa" },
      expected: "https://realty.com/homes/oak-ridge-villa",
    },
    {
      type: "event_ticket",
      data: { ticketCode: "TCK-2026-VIP-99" },
      checker: (val: string) => val.includes("/ticket/verify?code=TCK-2026-VIP-99"),
    },
    {
      type: "gym_membership",
      data: { memberId: "GYM-4401", memberName: "Jordan Hayes", gymName: "Flex Fitness" },
      expected: "MBR:GYM-4401;NAME:Jordan Hayes;GYM:Flex Fitness",
    },
    {
      type: "salon_services",
      data: { whatsappBooking: "+1 (555) 444-3322" },
      checker: (val: string) => val.includes("https://wa.me/15554443322"),
    },
    {
      type: "student_id",
      data: { rollNumber: "STU-2026-X12", studentName: "Samantha Reed", institutionName: "Stanford University" },
      expected: "STU:STU-2026-X12;NAME:Samantha Reed;CAMPUS:Stanford University",
    },
    {
      type: "feedback_survey",
      data: { googleReviewUrl: "https://g.page/r/sample-review/review" },
      expected: "https://g.page/r/sample-review/review",
    },
  ];

  for (const tc of qrTestCases) {
    it(`generates correct payload for '${tc.type}'`, () => {
      const payload = generateQRContent(tc.type, tc.data);
      if (tc.expected) {
        expect(payload).toBe(tc.expected);
      } else if (tc.checker) {
        expect(tc.checker(payload)).toBe(true);
      }
    });
  }
});

describe("PHASE 6: QR Customization, Error Correction & Export Security", () => {
  it("renders QR matrix with all 4 standard Error Correction Levels (L, M, Q, H)", async () => {
    const levels: Array<"L" | "M" | "Q" | "H"> = ["L", "M", "Q", "H"];
    for (const ec of levels) {
      const result = await generateQRCode("https://intelliqr.app", {
        ...baseStyle,
        errorCorrectionLevel: ec,
      });
      expect(result.dataUrl).toMatch(/^data:image\/png;base64,/);
      expect(result.svgContent).toContain("<svg");
      expect(result.svgContent).toContain("</svg>");
    }
  });

  it("exports clean SVG without malicious script injections", async () => {
    const maliciousPayload = '<script>alert("XSS")</script>';
    const result = await generateQRCode(maliciousPayload, baseStyle);
    // SVG should not contain raw unencoded executable script tags
    expect(result.svgContent).not.toMatch(/<script[\s>]/i);
    expect(result.svgContent).toContain("<svg");
  });

  it("handles custom foreground and background color combinations", async () => {
    const customStyle: QRStyle = {
      ...baseStyle,
      foregroundColor: "#4F46E5",
      backgroundColor: "#EEF2FF",
    };
    const result = await generateQRCode("https://intelliqr.app", customStyle);
    expect(result.svgContent).toContain("#4F46E5");
    expect(result.svgContent).toContain("#EEF2FF");
  });

  it("handles transparent background correctly in SVG export", async () => {
    const transparentStyle: QRStyle = {
      ...baseStyle,
      transparentBackground: true,
    };
    const result = await generateQRCode("https://intelliqr.app", transparentStyle);
    expect(result.dataUrl).toBeDefined();
    expect(result.svgContent).toBeDefined();
  });
});
