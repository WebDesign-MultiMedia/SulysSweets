import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your Vercel project's environment variables.",
    );
  }
  return new Stripe(key);
}

export function reconstructOrder(session) {
  const metadata = session.metadata || {};
  return {
    orderId: `SS-${session.id.slice(-8).toUpperCase()}`,
    sessionId: session.id,
    date: new Date(session.created * 1000).toISOString(),
    paymentStatus: session.payment_status,
    items: metadata.items ? JSON.parse(metadata.items) : [],
    subtotal: Number(metadata.subtotal || 0),
    depositPaid: Number(metadata.depositDue || (session.amount_total ?? 0) / 100),
    remainingBalance: Number(metadata.remainingBalance || 0),
    fulfillment: metadata.fulfillment || "pickup",
    deliveryAddress: metadata.deliveryAddress || "",
    scheduledDate: metadata.scheduledDate || "",
    scheduledTime: metadata.scheduledTime || "",
    customer: {
      name: metadata.customerName || session.customer_details?.name || "",
      email: session.customer_details?.email || metadata.customerEmail || "",
      phone: metadata.customerPhone || "",
    },
  };
}

export async function getOrderBySessionId(sessionId) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return reconstructOrder(session);
}

export function formatUSD(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
