import { getOrderBySessionId } from "./_lib/stripeOrder.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id: sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: "Missing session_id." });
  }

  try {
    const order = await getOrderBySessionId(sessionId);
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Couldn't load your order." });
  }
}
