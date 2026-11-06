import { Resend } from "resend";
import twilio from "twilio";
import { buildInvoiceHtml } from "./invoiceHtml.js";
import { formatScheduled } from "../../src/data/holidayMenu.js";
import { translations } from "../../src/i18n/translations.js";

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

// SMS goes only to customers who ticked the consent checkbox at checkout.
export function canText(order) {
  return order.smsConsent === true && Boolean(order.customer.phone);
}

function toE164(phone) {
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

export async function sendSmsReceipt(order, origin) {
  if (!canText(order)) {
    throw new Error("SMS consent not given for this order — refusing to text.");
  }
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    throw new Error(
      "Twilio env vars are not set (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER).",
    );
  }

  const link = `${origin}/holiday-order/success?session_id=${order.sessionId}`;
  const t = translations[order.lang === "es" ? "es" : "en"];
  const scheduled = formatScheduled(order.scheduledDate, order.scheduledTime, t.holiday.locale);
  const body = t.sms.receipt({ ...order, scheduled, link });

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  await client.messages.create({ from: TWILIO_FROM_NUMBER, to: toE164(order.customer.phone), body });
}
