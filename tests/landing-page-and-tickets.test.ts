import { describe, it, expect } from "vitest";

function generateTicketCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude confusing 0, 1, I, O
  let result = "TKT-";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  result += "-";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

interface MockTicket {
  ticketCode: string;
  status: "valid" | "checked_in" | "cancelled";
  checkInCount: number;
}

function verifyTicket(ticketCode: string, tickets: MockTicket[]) {
  const normalized = ticketCode.trim().toUpperCase();
  const found = tickets.find((t) => t.ticketCode === normalized);

  if (!found) {
    return { valid: false, status: "not_found", message: "Ticket code does not exist in the system." };
  }
  if (found.status === "cancelled") {
    return { valid: false, status: "cancelled", message: "This ticket has been cancelled or revoked." };
  }
  if (found.status === "checked_in") {
    return { valid: false, status: "already_used", message: `Ticket already checked in (Scan count: ${found.checkInCount}).` };
  }
  return { valid: true, status: "valid", message: "Ticket is valid for admission." };
}

describe("Event Tickets - Code Generation & Gate Verification", () => {
  it("generates unambiguous ticket codes conforming to TKT-XXXX-XXXX format", () => {
    for (let i = 0; i < 20; i++) {
      const code = generateTicketCode();
      expect(code).toMatch(/^TKT-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
      // Confusing characters 0, 1, I, O must be excluded
      expect(code).not.toMatch(/[01IO]/);
    }
  });

  it("verifies a valid ticket successfully on first scan", () => {
    const tickets: MockTicket[] = [
      { ticketCode: "TKT-4892-KLMN", status: "valid", checkInCount: 0 },
    ];

    const result = verifyTicket("tkt-4892-klmn", tickets); // Case-insensitive test
    expect(result.valid).toBe(true);
    expect(result.status).toBe("valid");
  });

  it("prevents duplicate gate entry by flagging already used tickets", () => {
    const tickets: MockTicket[] = [
      { ticketCode: "TKT-4892-KLMN", status: "checked_in", checkInCount: 1 },
    ];

    const result = verifyTicket("TKT-4892-KLMN", tickets);
    expect(result.valid).toBe(false);
    expect(result.status).toBe("already_used");
    expect(result.message).toContain("already checked in");
  });

  it("blocks cancelled tickets at gate check", () => {
    const tickets: MockTicket[] = [
      { ticketCode: "TKT-9999-VOID", status: "cancelled", checkInCount: 0 },
    ];

    const result = verifyTicket("TKT-9999-VOID", tickets);
    expect(result.valid).toBe(false);
    expect(result.status).toBe("cancelled");
  });

  it("returns not_found for forged or unrecognized ticket codes", () => {
    const tickets: MockTicket[] = [];
    const result = verifyTicket("TKT-FAKE-CODE", tickets);
    expect(result.valid).toBe(false);
    expect(result.status).toBe("not_found");
  });
});
