import { NotConfiguredError, isValidSessionId, reconstructOrder, retrieveSession } from "./stripeOrder.js";
import { sendEmailReceipt } from "./sendReceipts.js";
import {
  MAX_SENDS_PER_CHANNEL,
  RESEND_COOLDOWN_MS,
  getReceiptState,
  sendWithReservation,
} from "./receiptState.js";

// Handler behind /api/send-email (customer-triggered receipt resend). Responses carry
// a short `error` code that the success page translates; details are only
// logged server-side.
export async function handleResend(req, res, channel) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const sessionId = req.body?.sessionId;
  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({ error: "bad_request" });
  }

  let session;
  try {
    session = await retrieveSession(sessionId);
  } catch (err) {
    if (err instanceof NotConfiguredError) {
      console.error(`Resend ${channel} unavailable:`, err.message);
      return res.status(503).json({ error: "send_failed" });
    }
    console.error(`Resend ${channel}: couldn't load session ${sessionId}:`, err);
    return res.status(404).json({ error: "not_found" });
  }

  if (session.payment_status !== "paid") {
    return res.status(403).json({ error: "not_paid" });
  }

  const order = reconstructOrder(session);
  const state = getReceiptState(session, channel);
  if (state.count >= MAX_SENDS_PER_CHANNEL) {
    return res.status(429).json({ error: "limit_reached" });
  }

  const lastSent = Date.parse(state.sentAt);
  if (!Number.isNaN(lastSent)) {
    const waitMs = lastSent + RESEND_COOLDOWN_MS - Date.now();
    if (waitMs > 0) {
      const retryAfter = Math.ceil(waitMs / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ error: "cooldown", retryAfter });
    }
  }

  try {
    const { count } = await sendWithReservation(session, channel, () => sendEmailReceipt(order));
    return res.status(200).json({ sent: true, remaining: Math.max(0, MAX_SENDS_PER_CHANNEL - count) });
  } catch (err) {
    console.error(`Resend ${channel} failed for ${sessionId}:`, err);
    return res.status(502).json({ error: "send_failed" });
  }
}
