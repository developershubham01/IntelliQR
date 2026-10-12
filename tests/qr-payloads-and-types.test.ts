import { describe, it, expect } from "vitest";
import { generateQRContent, generateQRCode } from "../src/lib/qr-generator";
import type { QRStyle } from "../src/types/qr";

const defaultStyle: QRStyle = {
  foregroundColor: "#000000",
  backgroundColor: "#FFFFFF",
  transparentBackground: false,
  errorCorrectionLevel: "M",
  size: 300,
  padding: 2,
};

describe("QR Generation - Core Types & Payload Formatting", () => {
  it("generates correct website URL payload", () => {
    const payload = generateQRContent("website", { url: "https://intelliqr.abwcurious.com/dashboard" });
    expect(payload).toBe("https://intelliqr.abwcurious.com/dashboard");
  });

  it("generates correct plain text payload with Unicode and emoji", () => {
    const unicodeText = "Hello World! 🚀 🍕 2026 Special: café, résumé, München!";
    const payload = generateQRContent("text", { text: unicodeText });
    expect(payload).toBe(unicodeText);
  });

  it("formats mailto URI with encoded subject and body", () => {
    const payload = generateQRContent("email", {
      to: "sales@enterprise.com",
      subject: "Inquiry about Pro Plan",
      body: "Hi team,\nI would like a demo.",
    });
    expect(payload).toBe(
      "mailto:sales@enterprise.com?subject=Inquiry%20about%20Pro%20Plan&body=Hi%20team%2C%0AI%20would%20like%20a%20demo."
    );
  });

  it("formats telephone URI", () => {
    const payload = generateQRContent("phone", { phone: "+1 (555) 234-5678" });
    expect(payload).toBe("tel:+1 (555) 234-5678");
  });

  it("formats SMS URI with encoded body", () => {
    const payload = generateQRContent("sms", {
      phone: "+919876543210",
      message: "Please send OTP verification code",
    });
    expect(payload).toBe("sms:+919876543210?body=Please%20send%20OTP%20verification%20code");
  });

  it("formats WhatsApp wa.me link with sanitized phone number", () => {
    const payload = generateQRContent("whatsapp", {
      phone: "+1 (800) 555-0199",
      message: "Hello! Inquiring about table reservation.",
    });
    expect(payload).toBe(
      "https://wa.me/18005550199?text=Hello!%20Inquiring%20about%20table%20reservation."
    );
  });

  it("formats Wi-Fi connection string conforming to standard syntax", () => {
    const payload = generateQRContent("wifi", {
      ssid: "Guest-HighSpeed-5G",
      password: "StrongSecretPass!2026",
      encryption: "WPA",
      hidden: "false",
    });
    expect(payload).toBe("WIFI:S:Guest-HighSpeed-5G;T:WPA;P:StrongSecretPass!2026;H:false;;");
  });

  it("formats vCard 3.0 digital business card with full contact fields", () => {
    const payload = generateQRContent("vcard", {
      firstName: "Sarah",
      lastName: "Connor",
      phone: "+1-555-0144",
      email: "sarah@cyberdyne.org",
      organization: "Tech Innovations Inc",
      title: "Chief Executive Officer",
      website: "https://sarahconnor.me",
      address: "100 Tech Way, Suite 400, Austin, TX",
    });

    expect(payload).toContain("BEGIN:VCARD");
    expect(payload).toContain("VERSION:3.0");
    expect(payload).toContain("FN:Sarah Connor");
    expect(payload).toContain("TEL:+1-555-0144");
    expect(payload).toContain("EMAIL:sarah@cyberdyne.org");
    expect(payload).toContain("ORG:Tech Innovations Inc");
    expect(payload).toContain("TITLE:Chief Executive Officer");
    expect(payload).toContain("URL:https://sarahconnor.me");
    expect(payload).toContain("ADR:;;100 Tech Way, Suite 400, Austin, TX;;;;");
    expect(payload).toContain("END:VCARD");
  });

  it("formats Google Maps search query link", () => {
    const payload = generateQRContent("maps", { query: "Empire State Building, New York" });
    expect(payload).toBe(
      "https://www.google.com/maps/search/?api=1&query=Empire%20State%20Building%2C%20New%20York"
    );
  });

  it("formats social media URLs correctly", () => {
    expect(generateQRContent("instagram", { username: "intelliqr" })).toBe("https://instagram.com/intelliqr");
    expect(generateQRContent("twitter", { username: "intelliqr" })).toBe("https://x.com/intelliqr");
    expect(generateQRContent("telegram", { username: "intelliqr_channel" })).toBe("https://t.me/intelliqr_channel");
    expect(generateQRContent("linkedin", { url: "https://linkedin.com/company/intelliqr" })).toBe("https://linkedin.com/company/intelliqr");
  });

  it("formats PayPal and UPI payment links", () => {
    const paypal = generateQRContent("paypal", { email: "billing@shop.com", amount: "49.99", currency: "USD" });
    expect(paypal).toContain("business=billing%40shop.com");
    expect(paypal).toContain("amount=49.99");
    expect(paypal).toContain("currency_code=USD");

    const upi = generateQRContent("upi", { vpa: "merchant@okhdfcbank", name: "Cafe Delight", amount: "250.00", note: "Lunch Bill" });
    expect(upi).toContain("upi://pay?pa=merchant%40okhdfcbank");
    expect(upi).toContain("&pn=Cafe%20Delight");
    expect(upi).toContain("&am=250.00");
    expect(upi).toContain("&tn=Lunch%20Bill");
    expect(upi).toContain("&cu=INR");
  });

  it("formats calendar / event iCalendar string", () => {
    const payload = generateQRContent("event", {
      title: "Annual Developers Conference",
      location: "Convention Hall A",
      startDate: "2026-11-15T09:00:00",
      endDate: "2026-11-15T18:00:00",
      description: "Keynotes and workshop sessions.",
    });
    expect(payload).toContain("BEGIN:VCALENDAR");
    expect(payload).toContain("BEGIN:VEVENT");
    expect(payload).toContain("SUMMARY:Annual Developers Conference");
    expect(payload).toContain("LOCATION:Convention Hall A");
    expect(payload).toContain("END:VEVENT");
    expect(payload).toContain("END:VCALENDAR");
  });
});

describe("QR Generation - All 9 Industry Solutions", () => {
  it("formats 1. Restaurants & Cafes QR with menu URL", () => {
    const payload = generateQRContent("restaurant_menu", {
      menuUrl: "https://intelliqr.abwcurious.com/p/ristorante-delizioso-menu",
    });
    expect(payload).toBe("https://intelliqr.abwcurious.com/p/ristorante-delizioso-menu");
  });

  it("formats 2. Hotels & Hospitality QR with guest portal link", () => {
    const payload = generateQRContent("hotel_info", {
      guestPortalUrl: "https://intelliqr.abwcurious.com/p/azure-resort-guest-portal",
    });
    expect(payload).toBe("https://intelliqr.abwcurious.com/p/azure-resort-guest-portal");
  });

  it("formats 3. Retail & Packaging QR with specs and warranty links", () => {
    const payload = generateQRContent("product_catalog", {
      specsUrl: "https://brand.com/products/headphones-pro/specs",
    });
    expect(payload).toBe("https://brand.com/products/headphones-pro/specs");
  });

  it("formats 4. Real Estate QR with listing URL or agent WhatsApp", () => {
    const payload = generateQRContent("real_estate", {
      listingUrl: "https://realestate.com/listings/villa-sunset-view",
    });
    expect(payload).toBe("https://realestate.com/listings/villa-sunset-view");
  });

  it("formats 5. Events & Badges QR with ticket verification URL", () => {
    const payload = generateQRContent("event_ticket", {
      ticketCode: "TCK-4981-VIP",
    });
    expect(payload).toContain("/ticket/verify?code=TCK-4981-VIP");
  });

  it("formats 6. Gyms & Fitness QR with member badge data", () => {
    const payload = generateQRContent("gym_membership", {
      memberId: "GYM-9921",
      memberName: "Marcus Vance",
      gymName: "IronFit Premium",
    });
    expect(payload).toBe("MBR:GYM-9921;NAME:Marcus Vance;GYM:IronFit Premium");
  });

  it("formats 7. Salons & Spas QR with WhatsApp direct booking", () => {
    const payload = generateQRContent("salon_services", {
      whatsappBooking: "+1 (555) 777-8899",
    });
    expect(payload).toContain("https://wa.me/15557778899?text=");
  });

  it("formats 8. Education & Campuses QR with student ID badge data", () => {
    const payload = generateQRContent("student_id", {
      rollNumber: "CS-2026-089",
      studentName: "Elena Rostova",
      institutionName: "MIT Campus",
    });
    expect(payload).toBe("STU:CS-2026-089;NAME:Elena Rostova;CAMPUS:MIT Campus");
  });

  it("formats 9. Feedback / Review QR with direct Google Review URL", () => {
    const payload = generateQRContent("feedback_survey", {
      googleReviewUrl: "https://g.page/r/Cb921KxL/review",
    });
    expect(payload).toBe("https://g.page/r/Cb921KxL/review");
  });
});

describe("QR Matrix Rendering & Visual Scannability Verification", () => {
  it("renders a valid PNG dataUrl and SVG XML string for complex payloads", async () => {
    const content = "https://intelliqr.abwcurious.com/solutions/restaurants?id=9921#menu";
    const result = await generateQRCode(content, defaultStyle);

    expect(result.dataUrl).toMatch(/^data:image\/png;base64,/);
    expect(result.svgContent).toContain("<svg");
    expect(result.svgContent).toContain("</svg>");
  });

  it("renders large payloads (2000+ characters) without throwing or crashing", async () => {
    const largeData = "A".repeat(2048);
    const result = await generateQRCode(largeData, {
      ...defaultStyle,
      errorCorrectionLevel: "L", // High capacity mode
    });

    expect(result.dataUrl).toMatch(/^data:image\/png;base64,/);
    expect(result.svgContent).toContain("<svg");
  });

  it("supports high error correction levels (H = 30% recovery for logos/damage)", async () => {
    const content = "https://intelliqr.abwcurious.com";
    const result = await generateQRCode(content, {
      ...defaultStyle,
      errorCorrectionLevel: "H",
    });

    expect(result.dataUrl).toBeDefined();
    expect(result.svgContent).toContain("<svg");
  });
});
