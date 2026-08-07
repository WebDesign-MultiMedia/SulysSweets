import { Resend } from "resend";
import twilio from "twilio";
import { formatUSD } from "./stripeOrder.js";
import { buildInvoiceHtml } from "./invoiceHtml.js";
import { formatScheduled } from "../../src/data/holidayMenu.js";

export async function sendEmailReceipt(order) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. Add it to your Vercel project's environment variables.");
  }
  if (!order.customer.email) {
    throw new Error("This order has no email on file.");
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || "Suly's Sweets <orders@sulyssweets.com>";

  const { error } = await resend.emails.send({
    from,
    to: order.customer.email,
    subject: `Your Suly's Sweets Order Receipt — ${order.orderId}`,
    html: buildInvoiceHtml(order),
  });

  if (error) throw new Error(error.message || "Resend failed to send the email.");
}

function toE164(phone) {
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+")) return phone;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

export async function sendSmsReceipt(order, origin) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    throw new Error(
      "Twilio env vars are not set (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER).",
    );
  }
  if (!order.customer.phone) {
    throw new Error("This order has no phone number on file.");
  }

  const link = `${origin}/holiday-order/success?session_id=${order.sessionId}`;
  const scheduledLine = formatScheduled(order.scheduledDate, order.scheduledTime);
  const timeLine = scheduledLine
    ? ` ${order.fulfillment === "delivery" ? "Delivery" : "Pickup"}: ${scheduledLine}.`
    : "";

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  await client.messages.create({
    from: TWILIO_FROM_NUMBER,
    to: toE164(order.customer.phone),
    body: `Suly's Sweets — Order ${order.orderId} confirmed! Deposit paid: ${formatUSD(order.depositPaid)}. Balance due at pickup: ${formatUSD(order.remainingBalance)}.${timeLine} Details: ${link}`,
  });
}
