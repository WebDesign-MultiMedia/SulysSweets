// Tracks receipt sends per order in the Stripe Checkout Session metadata so
// receipts are idempotent (webhook retries don't resend) and the resend
// button can't be used to spam a customer.
//
// Keys: receipt_email_count, receipt_email_sent_at. The webhook's automatic
// send counts toward the limit.

import { getStripe } from "./stripeOrder.js";

export const MAX_SENDS_PER_CHANNEL = 2;
export const RESEND_COOLDOWN_MS = 60 * 1000;

export const CHANNELS = ["email"];

function keys(channel) {
  return { count: `receipt_${channel}_count`, sentAt: `receipt_${channel}_sent_at` };
}

export function getReceiptState(session, channel) {
  const metadata = session.metadata || {};
  const k = keys(channel);
  const count = Number.parseInt(metadata[k.count] || "0", 10) || 0;
  const sentAt = metadata[k.sentAt] || "";
  return { count, sentAt, sent: count > 0 };
}

// Public view for the browser: only whether a receipt went out.
export function publicReceiptState(session) {
  return Object.fromEntries(CHANNELS.map((c) => [c, { sent: getReceiptState(session, c).sent }]));
}

async function writeState(sessionId, channel, count, sentAt) {
  const k = keys(channel);
  await getStripe().checkout.sessions.update(sessionId, {
    metadata: { [k.count]: String(count), [k.sentAt]: sentAt },
  });
}

// Reserve a send *before* calling Resend so a concurrent duplicate
// (e.g. a retried webhook) sees the updated count. Stripe metadata has no
// compare-and-set, so a tiny race window remains; the cooldown narrows it.
// If the provider call fails, the reservation is rolled back so the
// customer can still use a resend.
export async function sendWithReservation(session, channel, send) {
  const before = getReceiptState(session, channel);
  await writeState(session.id, channel, before.count + 1, new Date().toISOString());
  try {
    await send();
  } catch (err) {
    try {
      await writeState(session.id, channel, before.count, before.sentAt);
    } catch (rollbackErr) {
      console.error(`Couldn't roll back ${channel} receipt reservation for ${session.id}:`, rollbackErr);
    }
    throw err;
  }
  return { count: before.count + 1 };
}
