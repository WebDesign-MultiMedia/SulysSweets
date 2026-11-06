import { EventEmitter } from "node:events";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes } from "./helpers.js";

const fakes = vi.hoisted(() => ({
  stripe: {
    webhooks: { constructEvent: vi.fn() },
    checkout: { sessions: { retrieve: vi.fn(), update: vi.fn() } },
  },
  sendEmail: vi.fn(),
}));
vi.mock("stripe", () => ({ default: vi.fn(function Stripe() { return fakes.stripe; }) }));
vi.mock("resend", () => ({ Resend: vi.fn(function Resend() { return { emails: { send: fakes.sendEmail } }; }) }));

const { default: handler } = await import("../api/webhook.js");
const sendReceipts = await import("../api/_lib/sendReceipts.js");

const SESSION_ID = "cs_test_abcdefghijklmnop";

function paidSession(metadata = {}) {
  return {
    id: SESSION_ID,
    created: 1_700_000_000,
    payment_status: "paid",
    customer_details: { email: "test@example.com", name: "Test" },
    metadata: { customerPhone: "5555550123", lang: "en", ...metadata },
  };
}

// A request that streams a raw body, like Vercel does with bodyParser off.
function webhookReq(body = "{}") {
  const req = new EventEmitter();
  req.method = "POST";
  req.headers = { host: "example.test", "stripe-signature": "t=1,v1=fake" };
  setImmediate(() => {
    req.emit("data", Buffer.from(body));
    req.emit("end");
  });
  return req;
}

async function deliver(session, type = "checkout.session.completed") {
  fakes.stripe.webhooks.constructEvent.mockReturnValue({ id: "evt_1", type, data: { object: { id: session.id } } });
  fakes.stripe.checkout.sessions.retrieve.mockResolvedValue(session);
  const res = mockRes();
  await handler(webhookReq(), res);
  return res;
}

const updates = () => fakes.stripe.checkout.sessions.update.mock.calls.map((c) => c[1].metadata);

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_placeholder");
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_placeholder");
  vi.stubEnv("RESEND_API_KEY", "re_placeholder");
  fakes.stripe.webhooks.constructEvent.mockReset();
  fakes.stripe.checkout.sessions.update.mockReset().mockResolvedValue({});
  fakes.sendEmail.mockReset().mockResolvedValue({ error: null });
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("Stripe webhook receipts", () => {
  it("sends exactly one email receipt for a paid checkout", async () => {
    const res = await deliver(paidSession());
    expect(res.statusCode).toBe(200);
    expect(fakes.sendEmail).toHaveBeenCalledTimes(1);
    expect(fakes.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "test@example.com" }));
    // Only the email receipt state is ever written.
    for (const meta of updates()) {
      expect(Object.keys(meta).every((k) => k.startsWith("receipt_email_"))).toBe(true);
    }
  });

  it("doesn't send again when Stripe retries the same event", async () => {
    await deliver(paidSession({ receipt_email_count: "1", receipt_email_sent_at: new Date().toISOString() }));
    expect(fakes.sendEmail).not.toHaveBeenCalled();
    expect(updates()).toHaveLength(0);
  });

  it("sends nothing for an unpaid session", async () => {
    await deliver({ ...paidSession(), payment_status: "unpaid" });
    expect(fakes.sendEmail).not.toHaveBeenCalled();
  });

  it("rejects a bad signature without sending", async () => {
    fakes.stripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error("No signatures found");
    });
    const res = mockRes();
    await handler(webhookReq(), res);
    expect(res.statusCode).toBe(400);
    expect(fakes.sendEmail).not.toHaveBeenCalled();
  });
});

describe("no SMS code remains", () => {
  it("only exports the email sender", () => {
    expect(Object.keys(sendReceipts)).toEqual(["sendEmailReceipt"]);
  });

  it("has no SMS endpoint", () => {
    expect(existsSync(new URL("../api/send-sms.js", import.meta.url))).toBe(false);
  });

  // smsConsentLang is only read as a fallback for the language of older orders.
  it("has no Twilio or SMS references in the API", () => {
    const apiDir = new URL("../api/", import.meta.url).pathname;
    const files = readdirSync(apiDir, { recursive: true }).filter((f) => f.endsWith(".js"));
    for (const file of files) {
      expect(readFileSync(join(apiDir, file), "utf8"), file).not.toMatch(/twilio|\bsms(?!ConsentLang)/i);
    }
  });
});
