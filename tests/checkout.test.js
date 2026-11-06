import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockReq, mockRes } from "./helpers.js";

const stripe = vi.hoisted(() => ({
  checkout: { sessions: { create: vi.fn() } },
}));
vi.mock("stripe", () => ({ default: vi.fn(function Stripe() { return stripe; }) }));

const { default: handler } = await import("../api/checkout.js");

function validBody(overrides = {}) {
  return {
    items: [{ productId: "cheesecake-9in", selections: { flavor: "strawberry" }, quantity: 2 }],
    customer: { name: "Test Customer", email: "test@example.com", phone: "5555550123" },
    fulfillment: "pickup",
    scheduledDate: "2026-12-20",
    scheduledTime: "14:00",
    smsConsent: false,
    lang: "en",
    ...overrides,
  };
}

async function run(body) {
  const res = mockRes();
  await handler(mockReq(body), res);
  return res;
}

const createdMetadata = () => stripe.checkout.sessions.create.mock.calls[0][0].metadata;
const chargedCents = () => stripe.checkout.sessions.create.mock.calls[0][0].line_items[0].price_data.unit_amount;

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_placeholder");
  stripe.checkout.sessions.create.mockReset().mockResolvedValue({ url: "https://checkout.stripe.test/s" });
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/checkout pricing", () => {
  it("charges a 50% deposit computed from the server's prices", async () => {
    const res = await run(validBody());
    expect(res.statusCode).toBe(200);
    expect(createdMetadata().subtotal).toBe("110.00");
    expect(chargedCents()).toBe(5500);
  });

  it("ignores prices sent by the browser", async () => {
    const tampered = validBody({
      items: [{ productId: "cheesecake-9in", selections: { flavor: "strawberry" }, quantity: 1, unitPrice: 0.01 }],
    });
    await run(tampered);
    expect(createdMetadata().subtotal).toBe("55.00");
  });

  it("stores product ids and options so the order can be shown in Spanish", async () => {
    await run(validBody());
    expect(JSON.parse(createdMetadata().items)).toEqual([
      {
        productId: "cheesecake-9in",
        selections: { flavor: "strawberry" },
        name: "9\" Cheesecake's",
        selectionLabel: "Flavor: Strawberry",
        quantity: 2,
        unitPrice: 55,
      },
    ]);
  });

  it("caps quantity at 99", async () => {
    await run(validBody({ items: [{ productId: "cheesecake-9in", selections: { flavor: "strawberry" }, quantity: 10_000 }] }));
    expect(createdMetadata().subtotal).toBe((55 * 99).toFixed(2));
  });

  it("rejects an unknown product", async () => {
    const res = await run(validBody({ items: [{ productId: "free-cake", selections: {}, quantity: 1 }] }));
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "unknown_product" });
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("rejects an option that doesn't exist instead of pricing it at $0", async () => {
    const res = await run(
      validBody({ items: [{ productId: "churro-cheesecake-tray", selections: { size: "fake" }, quantity: 1 }] }),
    );
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "unknown_product" });
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });
});

describe("POST /api/checkout validation", () => {
  it.each([
    ["empty cart", { items: [] }, "cart_empty"],
    ["missing phone", { customer: { name: "A", email: "a@example.com" } }, "missing_contact"],
    ["delivery without address", { fulfillment: "delivery" }, "missing_address"],
    ["missing time", { scheduledTime: "" }, "missing_schedule"],
  ])("%s → 400 %s", async (_label, overrides, code) => {
    const res = await run(validBody(overrides));
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: code });
  });

  it("only accepts POST", async () => {
    const res = mockRes();
    await handler(mockReq(undefined, "GET"), res);
    expect(res.statusCode).toBe(405);
  });

  it("returns not_configured (demo mode) when Stripe has no key", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    const res = await run(validBody());
    expect(res.statusCode).toBe(503);
    expect(res.body).toEqual({ error: "not_configured" });
  });
});

describe("POST /api/checkout SMS consent", () => {
  it("records consent with a version and server timestamp when opted in", async () => {
    await run(validBody({ smsConsent: true, lang: "es" }));
    const meta = createdMetadata();
    expect(meta.smsConsent).toBe("true");
    expect(meta.smsConsentVersion).toBeTruthy();
    expect(Number.isNaN(Date.parse(meta.smsConsentAt))).toBe(false);
    expect(meta.smsConsentLang).toBe("es");
  });

  it("treats anything but literal true as no consent", async () => {
    await run(validBody({ smsConsent: "true" }));
    const meta = createdMetadata();
    expect(meta.smsConsent).toBe("false");
    expect(meta.smsConsentAt).toBe("");
  });
});
