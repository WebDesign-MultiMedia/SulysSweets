import { describe, expect, it } from "vitest";
import {
  CartTooLargeError,
  encodeItemsMetadata,
  isValidSessionId,
  reconstructOrder,
} from "../api/_lib/stripeOrder.js";

const item = (n) => ({ name: `Cake number ${n}`, selectionLabel: "Flavor: Strawberry", quantity: 2, unitPrice: 55 });

function sessionWith(metadata) {
  return { id: "cs_test_abcdefghijklmnop", created: 1_700_000_000, payment_status: "paid", metadata };
}

describe("items metadata encoding", () => {
  it("keeps every chunk within Stripe's 500-character limit and round-trips", () => {
    const items = Array.from({ length: 25 }, (_, i) => item(i));
    const meta = encodeItemsMetadata(items);

    expect(Object.keys(meta).length).toBeGreaterThan(1);
    for (const value of Object.values(meta)) expect(value.length).toBeLessThanOrEqual(500);
    expect(reconstructOrder(sessionWith(meta)).items).toEqual(items);
  });

  it("uses a single `items` key for a small cart", () => {
    expect(Object.keys(encodeItemsMetadata([item(1)]))).toEqual(["items"]);
  });

  it("rejects carts too large for Stripe metadata", () => {
    const huge = Array.from({ length: 400 }, (_, i) => item(i));
    expect(() => encodeItemsMetadata(huge)).toThrow(CartTooLargeError);
  });
});

describe("isValidSessionId", () => {
  it.each(["cs_test_a1B2c3D4e5F6", "cs_live_ABCDEFGHIJKLMNOP"])("accepts %s", (id) => {
    expect(isValidSessionId(id)).toBe(true);
  });

  it.each(["", "cs_test_short", "pi_test_abcdefghijkl", "cs_test_abc/../../x", null, 42])("rejects %s", (id) => {
    expect(isValidSessionId(id)).toBe(false);
  });
});

describe("reconstructOrder SMS consent", () => {
  it("is true only for the exact string 'true'", () => {
    expect(reconstructOrder(sessionWith({ smsConsent: "true" })).smsConsent).toBe(true);
    expect(reconstructOrder(sessionWith({ smsConsent: "false" })).smsConsent).toBe(false);
    expect(reconstructOrder(sessionWith({ smsConsent: "yes" })).smsConsent).toBe(false);
  });

  it("treats older orders without the key as no consent", () => {
    expect(reconstructOrder(sessionWith({})).smsConsent).toBe(false);
  });
});
