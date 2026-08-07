import { getStripe, reconstructOrder } from "./_lib/stripeOrder.js";
import { sendEmailReceipt, sendSmsReceipt } from "./_lib/sendReceipts.js";

// Stripe requires the raw, unparsed request body to verify the webhook
// signature — this opts the function out of Vercel's default JSON parsing.
export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
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

  const stripe = getStripe();
  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, req.headers["stripe-signature"], webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.payment_status === "paid") {
      const order = reconstructOrder(session);
      const origin = `https://${req.headers.host}`;

      const [emailResult, smsResult] = await Promise.allSettled([
        sendEmailReceipt(order),
        sendSmsReceipt(order, origin),
      ]);

      if (emailResult.status === "rejected") {
        console.error(`Auto-email failed for order ${order.orderId}:`, emailResult.reason);
      }
      if (smsResult.status === "rejected") {
        console.error(`Auto-SMS failed for order ${order.orderId}:`, smsResult.reason);
      }
    }
  }

  return res.status(200).json({ received: true });
}
