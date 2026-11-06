import { Resend } from "resend";
import { buildInvoiceHtml } from "./invoiceHtml.js";

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
