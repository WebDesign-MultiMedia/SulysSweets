import { getOrderBySessionId } from "./_lib/stripeOrder.js";
import { sendSmsReceipt } from "./_lib/sendReceipts.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId." });

    const order = await getOrderBySessionId(sessionId);
    const origin = req.headers.origin || `https://${req.headers.host}`;
    await sendSmsReceipt(order, origin);

    return res.status(200).json({ sent: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Couldn't send the SMS receipt." });
  }
}
