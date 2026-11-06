import { getStripe, reconstructOrder } from "./_lib/stripeOrder.js";
import { canText, sendEmailReceipt, sendSmsReceipt } from "./_lib/sendReceipts.js";
import { getReceiptState, sendWithReservation } from "./_lib/receiptState.js";

// Stripe requires the raw, unparsed request body to verify the webhook
// signature — this opts the function out of Vercel's default JSON parsing.
export const config = { api: { bodyParser: false } };

const PAID_EVENTS = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Sends one channel's receipt unless it was already sent for this order
// (Stripe can deliver the same event more than once).
async function sendOnce(session, channel, send) {
  if (getReceiptState(session, channel).sent) {
    console.log(`Skipping ${channel} receipt for ${session.id}: already sent.`);
    return;
  }
  try {
    await sendWithReservation(session, channel, send);
  } catch (err) {
    console.error(`Auto-${channel} receipt failed for ${session.id}:`, err);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set — can't verify incoming webhooks.");
    return res.status(500).json({ error: "Webhook not configured." });
  }

  let stripe;
  let event;
  try {
    stripe = getStripe();
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, req.headers["stripe-signature"], webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature." });
  }

  if (PAID_EVENTS.has(event.type)) {
    try {
      // Re-fetch so we see the latest receipt metadata, not the copy frozen
      // into this (possibly retried) event.
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id);

      if (session.payment_status === "paid") {
        const order = reconstructOrder(session);
        const origin = `https://${req.headers.host}`;

        // Sequential so the two metadata updates don't race each other.
        await sendOnce(session, "email", () => sendEmailReceipt(order));
        if (canText(order)) {
          await sendOnce(session, "sms", () => sendSmsReceipt(order, origin));
        }
      }
    } catch (err) {
      // Logged but still acknowledged: a retry would only risk duplicate
      // receipts, and the customer can resend from the success page.
      console.error(`Webhook processing failed for event ${event.id}:`, err);
    }
  }

  return res.status(200).json({ received: true });
}
