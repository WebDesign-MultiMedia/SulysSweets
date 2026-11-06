import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockReq, mockRes } from "./helpers.js";

const fakes = vi.hoisted(() => ({
  stripe: { checkout: { sessions: { retrieve: vi.fn(), update: vi.fn() } } },
  sendEmail: vi.fn(),
  sendSms: vi.fn(),
}));
vi.mock("stripe", () => ({ default: vi.fn(function Stripe() { return fakes.stripe; }) }));
vi.mock("resend", () => ({ Resend: vi.fn(function Resend() { return { emails: { send: fakes.sendEmail } }; }) }));
vi.mock("twilio", () => ({ default: vi.fn(() => ({ messages: { create: fakes.sendSms } })) }));

const { handleResend } = await import("../api/_lib/resendReceipt.js");

const SESSION_ID = "cs_test_abcdefghijklmnop";

function session(metadata = {}, overrides = {}) {
  return {
    id: SESSION_ID,
    created: 1_700_000_000,
    payment_status: "paid",
    customer_details: { email: "test@example.com", name: "Test" },
    metadata: { customerPhone: "5555550123", smsConsent: "true", ...metadata },
    ...overrides,
  };
}

async function resend(channel, sess) {
  fakes.stripe.checkout.sessions.retrieve.mockResolvedValue(sess);
  const res = mockRes();
  await handleResend(mockReq({ sessionId: SESSION_ID }), res, channel);
  return res;
}

const updates = () => fakes.stripe.checkout.sessions.update.mock.calls.map((c) => c[1].metadata);
const minutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString();

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_placeholder");
  vi.stubEnv("RESEND_API_KEY", "re_placeholder");
  vi.stubEnv("TWILIO_ACCOUNT_SID", "AC_placeholder");
  vi.stubEnv("TWILIO_AUTH_TOKEN", "placeholder");
  vi.stubEnv("TWILIO_FROM_NUMBER", "+15555550100");
  fakes.stripe.checkout.sessions.update.mockReset().mockResolvedValue({});
  fakes.sendEmail.mockReset().mockResolvedValue({ error: null });
  fakes.sendSms.mockReset().mockResolvedValue({});
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

  it("never texts a customer who didn't opt in", async () => {
    const res = await resend("sms", session({ smsConsent: "false" }));
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: "no_consent" });
    expect(fakes.sendSms).not.toHaveBeenCalled();
  });

  it("stops after 2 sends per channel", async () => {
    const res = await resend("email", session({ receipt_email_count: "2", receipt_email_sent_at: minutesAgo(10) }));
    expect(res.statusCode).toBe(429);
    expect(res.body).toEqual({ error: "limit_reached" });
    expect(fakes.sendEmail).not.toHaveBeenCalled();
  });

  it("enforces a 60-second cooldown with Retry-After", async () => {
    const res = await resend("sms", session({ receipt_sms_count: "1", receipt_sms_sent_at: new Date().toISOString() }));
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe("cooldown");
    expect(Number(res.headers["retry-after"])).toBeGreaterThan(0);
    expect(fakes.sendSms).not.toHaveBeenCalled();
  });
});

describe("reserve-then-send", () => {
  it("records the send before delivering and reports what's left", async () => {
    const res = await resend("email", session({ receipt_email_count: "1", receipt_email_sent_at: minutesAgo(5) }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ sent: true, remaining: 0 });
    expect(updates()).toHaveLength(1);
    expect(updates()[0].receipt_email_count).toBe("2");
    expect(fakes.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("rolls the reservation back if the provider fails", async () => {
    fakes.sendSms.mockRejectedValue(new Error("carrier down"));
    const sentAt = minutesAgo(5);
    const res = await resend("sms", session({ receipt_sms_count: "1", receipt_sms_sent_at: sentAt }));

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ error: "send_failed" });
    expect(updates()).toEqual([
      expect.objectContaining({ receipt_sms_count: "2" }),
      { receipt_sms_count: "1", receipt_sms_sent_at: sentAt },
    ]);
  });

  it("sends the SMS in E.164 format with STOP/HELP wording", async () => {
    await resend("sms", session({ customerPhone: "(555) 555-0123" }));
    const msg = fakes.sendSms.mock.calls[0][0];
    expect(msg.to).toBe("+15555550123");
    expect(msg.body).toMatch(/STOP/);
    expect(msg.body).toMatch(/HELP/);
  });
});
