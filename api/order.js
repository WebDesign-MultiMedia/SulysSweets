import { NotConfiguredError, isValidSessionId, reconstructOrder, retrieveSession } from "./_lib/stripeOrder.js";
import { publicReceiptState } from "./_lib/receiptState.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const { session_id: sessionId } = req.query;
  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({ error: "bad_request" });
  }

  try {
    const session = await retrieveSession(sessionId);
    return res.status(200).json({ ...reconstructOrder(session), receipts: publicReceiptState(session) });
  } catch (err) {
    if (err instanceof NotConfiguredError) {
      console.error("Order lookup unavailable:", err.message);
      return res.status(503).json({ error: "unavailable" });
    }
    console.error(`Order lookup failed for ${sessionId}:`, err);
    return res.status(404).json({ error: "not_found" });
  }
}
