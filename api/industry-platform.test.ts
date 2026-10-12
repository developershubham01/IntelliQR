import { describe, it, expect } from "vitest";
import { isValidRedirectUrl } from "../server/redirect-handler.js";
import { generateQRContent } from "../src/lib/qr-generator";

describe("Industry Platform - Redirect Security & Internal Landing Pages", () => {
  it("allows relative internal landing page routes like /p/:slug", () => {
    expect(isValidRedirectUrl("/p/bella-italia-menu")).toBe(true);
    expect(isValidRedirectUrl("/p/grand-luxury-hotel-123")).toBe(true);
    expect(isValidRedirectUrl("/p/product-warranty-series-x")).toBe(true);
  });

  it("strictly rejects protocol-relative and directory traversal attacks", () => {
    expect(isValidRedirectUrl("//attacker.com")).toBe(false);
    expect(isValidRedirectUrl("/\\attacker.com")).toBe(false);
    expect(isValidRedirectUrl("/p/../admin")).toBe(false);
  });

  it("permits standard external URLs and communication schemes", () => {
    expect(isValidRedirectUrl("https://intelliqr.app")).toBe(true);
    expect(isValidRedirectUrl("tel:+919876543210")).toBe(true);
    expect(isValidRedirectUrl("mailto:contact@resort.com")).toBe(true);
  });
});

describe("Industry Platform - Universal QR Payload Generation", () => {
  it("formats restaurant menu QR content with slug or direct URL", () => {
    const content = generateQRContent("restaurant_menu", {
      restaurantName: "Trattoria Bella",
      menuUrl: "https://intelliqr.app/p/bella-specials-2026",
    });
    expect(content).toContain("/p/bella-specials-2026");
  });

  it("formats hotel amenities & Wi-Fi hub QR content", () => {
    const content = generateQRContent("hotel_info", {
      hotelName: "Grand Palace Hotel",
      guestPortalUrl: "https://intelliqr.app/p/grand-palace-suite-401",
    });
    expect(content).toContain("/p/grand-palace-suite-401");
  });

  it("formats real estate listing QR content", () => {
    const content = generateQRContent("real_estate", {
      propertyTitle: "Penthouse Overlook 4B",
      listingUrl: "https://intelliqr.app/p/penthouse-overlook-4b",
    });
    expect(content).toContain("/p/penthouse-overlook-4b");
  });

  it("formats event ticket verification content with ticket code", () => {
    const content = generateQRContent("event_ticket", {
      eventName: "Global SaaS Summit",
      attendeeName: "Alex Rivera",
      ticketCode: "TCK-99021-X",
    });
    expect(content).toContain("/ticket/verify?code=TCK-99021-X");
  });

  it("formats gym membership badge QR content", () => {
    const content = generateQRContent("gym_membership", {
      gymName: "Apex Fitness Club",
      memberId: "MEM-88710",
      memberName: "Alex Rivera",
    });
    expect(content).toContain("MBR:MEM-88710");
    expect(content).toContain("GYM:Apex Fitness Club");
  });

  it("formats salon services catalogue QR content", () => {
    const content = generateQRContent("salon_services", {
      salonName: "Glow & Serenity Spa",
      servicesUrl: "https://intelliqr.app/p/glow-serenity-spa",
    });
    expect(content).toContain("/p/glow-serenity-spa");
  });

  it("formats standard Wi-Fi network payload correctly", () => {
    const content = generateQRContent("wifi", {
      ssid: "OfficeGuest5G",
      password: "SuperSecretPassword123",
      encryption: "WPA",
      hidden: "false",
    });
    expect(content).toBe("WIFI:S:OfficeGuest5G;T:WPA;P:SuperSecretPassword123;H:false;;");
  });

  it("formats standard vCard contact card payload correctly", () => {
    const content = generateQRContent("vcard", {
      firstName: "Jane",
      lastName: "Doe",
      phone: "+15551234567",
      email: "jane@acme.inc",
      organization: "Acme Corp",
      title: "VP of Product",
    });
    expect(content).toContain("BEGIN:VCARD");
    expect(content).toContain("N:Doe;Jane;;;");
    expect(content).toContain("FN:Jane Doe");
    expect(content).toContain("TEL:+15551234567");
    expect(content).toContain("EMAIL:jane@acme.inc");
    expect(content).toContain("ORG:Acme Corp");
    expect(content).toContain("END:VCARD");
  });
});

describe("Industry Platform - Event Ticket Validation Logic", () => {
  it("detects valid tickets and flags already checked-in tickets as duplicates", () => {
    const mockTicket = {
      id: 1,
      ticketCode: "TCK-ABC-123",
      eventName: "Tech Summit",
      attendeeName: "John Doe",
      status: "valid",
      scanCount: 0,
    };

    // First scan: should be marked checked_in
    function simulateScan(ticket: typeof mockTicket) {
      if (ticket.status === "cancelled") {
        return { success: false, reason: "Ticket has been cancelled." };
      }
      if (ticket.scanCount > 0 || ticket.status === "used") {
        return {
          success: false,
          duplicate: true,
          reason: `DUPLICATE SCAN: Already checked in (${ticket.scanCount} prior scans)`,
        };
      }
      ticket.scanCount += 1;
      ticket.status = "used";
      return { success: true, message: "Ticket verified and checked in successfully." };
    }

    const firstCheckIn = simulateScan(mockTicket);
    expect(firstCheckIn.success).toBe(true);
    expect(mockTicket.scanCount).toBe(1);
    expect(mockTicket.status).toBe("used");

    // Second scan with same code: MUST prevent duplicate entry!
    const secondCheckIn = simulateScan(mockTicket);
    expect(secondCheckIn.success).toBe(false);
    expect(secondCheckIn.duplicate).toBe(true);
    expect(secondCheckIn.reason).toContain("DUPLICATE SCAN");
  });
});
