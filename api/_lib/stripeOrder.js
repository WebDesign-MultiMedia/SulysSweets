import Stripe from "stripe";

export class NotConfiguredError extends Error {}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new NotConfiguredError(
      "STRIPE_SECRET_KEY is not set. Add it to your Vercel project's environment variables.",
    );
  }
  return new Stripe(key);
}

// Stripe metadata values are capped at 500 characters, so the items JSON is
// split across items, items_1, items_2, ... (Stripe allows 50 keys total).
const META_VALUE_MAX = 500;
const MAX_ITEM_CHUNKS = 20;

export class CartTooLargeError extends Error {}

export function encodeItemsMetadata(items) {
  const json = JSON.stringify(items);
  const chunks = [];
  for (let i = 0; i < json.length; i += META_VALUE_MAX) chunks.push(json.slice(i, i + META_VALUE_MAX));
  if (chunks.length > MAX_ITEM_CHUNKS) throw new CartTooLargeError("Cart too large for Stripe metadata.");
  return Object.fromEntries(chunks.map((chunk, i) => [i === 0 ? "items" : `items_${i}`, chunk]));
}

function decodeItemsMetadata(metadata) {
  if (!metadata.items) return [];
  let json = metadata.items;
  for (let i = 1; metadata[`items_${i}`] !== undefined; i += 1) json += metadata[`items_${i}`];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

export function truncateMeta(value) {
  return String(value ?? "").slice(0, META_VALUE_MAX);
}

export function isValidSessionId(sessionId) {
  return typeof sessionId === "string" && /^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId);
}

export function reconstructOrder(session) {
  const metadata = session.metadata || {};
  return {
    orderId: `SS-${session.id.slice(-8).toUpperCase()}`,
    sessionId: session.id,
    date: new Date(session.created * 1000).toISOString(),
    paymentStatus: session.payment_status,
    items: decodeItemsMetadata(metadata),
    subtotal: Number(metadata.subtotal || 0),
    depositPaid: Number(metadata.depositDue || (session.amount_total ?? 0) / 100),
    remainingBalance: Number(metadata.remainingBalance || 0),
    fulfillment: metadata.fulfillment || "pickup",
    deliveryAddress: metadata.deliveryAddress || "",
    scheduledDate: metadata.scheduledDate || "",
    scheduledTime: metadata.scheduledTime || "",
    // Older orders stored the language under smsConsentLang.
    lang: (metadata.lang || metadata.smsConsentLang) === "es" ? "es" : "en",
    customer: {
      name: metadata.customerName || session.customer_details?.name || "",
      email: session.customer_details?.email || metadata.customerEmail || "",
      phone: metadata.customerPhone || "",
    },
  };
}

export async function retrieveSession(sessionId) {
  return getStripe().checkout.sessions.retrieve(sessionId);
}

export function formatUSD(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
