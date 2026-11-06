import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockReq, mockRes } from "./helpers.js";

const fakes = vi.hoisted(() => ({
  stripe: { checkout: { sessions: { retrieve: vi.fn(), update: vi.fn() } } },
  sendEmail: vi.fn(),
}));
vi.mock("stripe", () => ({ default: vi.fn(function Stripe() { return fakes.stripe; }) }));
vi.mock("resend", () => ({ Resend: vi.fn(function Resend() { return { emails: { send: fakes.sendEmail } }; }) }));

const { handleResend } = await import("../api/_lib/resendReceipt.js");

const SESSION_ID = "cs_test_abcdefghijklmnop";

function session(metadata = {}, overrides = {}) {
  return {
    id: SESSION_ID,
    created: 1_700_000_000,
    payment_status: "paid",
    customer_details: { email: "test@example.com", name: "Test" },
    metadata: { customerPhone: "5555550123", ...metadata },
    ...overrides,
  };
}

async function resend(sess) {
  fakes.stripe.checkout.sessions.retrieve.mockResolvedValue(sess);
  const res = mockRes();
  await handleResend(mockReq({ sessionId: SESSION_ID }), res, "email");
  return res;
}

const updates = () => fakes.stripe.checkout.sessions.update.mock.calls.map((c) => c[1].metadata);
const minutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString();

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_placeholder");
  vi.stubEnv("RESEND_API_KEY", "re_placeholder");
  fakes.stripe.checkout.sessions.update.mockReset().mockResolvedValue({});
  fakes.sendEmail.mockReset().mockResolvedValue({ error: null });
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("receipt resend guards", () => {
  it("rejects a malformed session id without calling Stripe", async () => {
    const res = mockRes();
    await handleResend(mockReq({ sessionId: "not-a-session" }), res, "email");
    expect(res.statusCode).toBe(400);
    expect(fakes.stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
  });

  it("refuses unpaid orders", async () => {
    const res = await resend("email", session({}, { payment_status: "unpaid" }));
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: "not_paid" });
  });

  it("stops after 2 email sends", async () => {
    const res = await resend(session({ receipt_email_count: "2", receipt_email_sent_at: minutesAgo(10) }));
    expect(res.statusCode).toBe(429);
    expect(res.body).toEqual({ error: "limit_reached" });
    expect(fakes.sendEmail).not.toHaveBeenCalled();
  });

  it("enforces a 60-second cooldown with Retry-After", async () => {
    const res = await resend(session({ receipt_email_count: "1", receipt_email_sent_at: new Date().toISOString() }));
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe("cooldown");
    expect(Number(res.headers["retry-after"])).toBeGreaterThan(0);
    expect(fakes.sendEmail).not.toHaveBeenCalled();
    expect(updates()).toHaveLength(0);
  });

  it("allows a resend once the cooldown has passed", async () => {
    const res = await resend(session({ receipt_email_count: "1", receipt_email_sent_at: minutesAgo(2) }));
    expect(res.statusCode).toBe(200);
    expect(fakes.sendEmail).toHaveBeenCalledTimes(1);
  });
});

describe("reserve-then-send", () => {
  it("records the send before delivering and reports what's left", async () => {
    const res = await resend(session({ receipt_email_count: "1", receipt_email_sent_at: minutesAgo(5) }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ sent: true, remaining: 0 });
    expect(updates()).toHaveLength(1);
    expect(updates()[0].receipt_email_count).toBe("2");
    expect(fakes.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("rolls the reservation back if the provider fails", async () => {
    fakes.sendEmail.mockResolvedValue({ error: { message: "provider down" } });
    const sentAt = minutesAgo(5);
    const res = await resend(session({ receipt_email_count: "1", receipt_email_sent_at: sentAt }));

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ error: "send_failed" });
    expect(updates()).toEqual([
      expect.objectContaining({ receipt_email_count: "2" }),
      { receipt_email_count: "1", receipt_email_sent_at: sentAt },
    ]);
  });

  it("emails the receipt to the address on the Stripe session", async () => {
    await resend(session());
    expect(fakes.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "test@example.com" }));
  });
});
