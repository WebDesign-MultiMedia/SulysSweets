import { formatUSD } from "./stripeOrder.js";
import { formatScheduled } from "../../src/data/holidayMenu.js";

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

export function buildInvoiceHtml(order) {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;color:#4e3d42;">
          <strong>${item.quantity}× ${escapeHtml(item.name)}</strong>
          ${item.selectionLabel ? `<br/><span style="color:#4e3d4299;font-size:12px;">${escapeHtml(item.selectionLabel)}</span>` : ""}
        </td>
        <td style="padding:8px 0;text-align:right;color:#4e3d42;">${formatUSD(item.unitPrice * item.quantity)}</td>
      </tr>`,
    )
    .join("");

  const fulfillmentLine =
    order.fulfillment === "delivery"
      ? `Delivery to: ${escapeHtml(order.deliveryAddress)}`
      : "Pick Up Location: Pelham Bay (Bronx)";
  const scheduledLine = formatScheduled(order.scheduledDate, order.scheduledTime);

  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;background:#f3e6d8;padding:24px;border-radius:16px;">
    <h1 style="font-family:Georgia,serif;color:#1e3a2b;text-align:center;margin:0 0 4px;">Suly's Sweets</h1>
    <p style="text-align:center;color:#4e3d42;margin:0 0 20px;font-size:13px;">Holiday Order Receipt</p>
    <div style="background:#ffffff;border-radius:12px;padding:20px;">
      <p style="margin:0;color:#4e3d4299;font-size:12px;">Order #</p>
      <p style="margin:0 0 12px;color:#4e3d42;font-weight:600;">${order.orderId}</p>
      <p style="margin:0;color:#4e3d4299;font-size:12px;">Name: ${escapeHtml(order.customer.name)}</p>
      <p style="margin:0;color:#4e3d4299;font-size:12px;">Phone: ${escapeHtml(order.customer.phone)}</p>
      <p style="margin:0 0 12px;color:#4e3d4299;font-size:12px;">Email: ${escapeHtml(order.customer.email)}</p>
      <p style="margin:0;color:#4e3d4299;font-size:12px;">${fulfillmentLine}</p>
      ${scheduledLine ? `<p style="margin:2px 0 0;color:#4e3d4299;font-size:12px;">${order.fulfillment === "delivery" ? "Delivery" : "Pickup"} time: ${scheduledLine}</p>` : ""}
      <table width="100%" style="border-collapse:collapse;margin-top:16px;">
        ${itemRows}
      </table>
      <div style="border-top:1px solid #4e3d4222;margin-top:12px;padding-top:12px;">
        <table width="100%" style="font-size:14px;">
          <tr><td style="color:#4e3d42;">Total Order Amount</td><td style="text-align:right;color:#4e3d42;font-weight:600;">${formatUSD(order.subtotal)}</td></tr>
          <tr><td style="color:#1e3a2b;font-weight:600;">Deposit Paid Today</td><td style="text-align:right;color:#1e3a2b;font-weight:600;">${formatUSD(order.depositPaid)}</td></tr>
          <tr><td style="color:#4e3d4299;">Remaining Balance Due at Pickup</td><td style="text-align:right;color:#4e3d4299;">${formatUSD(order.remainingBalance)}</td></tr>
        </table>
      </div>
    </div>
    <p style="text-align:center;color:#4e3d4299;font-size:12px;margin-top:20px;">Thank you for supporting my small business! ♡<br/>Suly's Sweets · 347-859-5181 · @SULYS_SWEETS</p>
  </div>`;
}
