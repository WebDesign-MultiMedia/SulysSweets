// Tells the storefront whether real checkout is configured, so it can show
// a "demo mode" notice. Reports only booleans — never env values.
export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ checkout: process.env.STRIPE_SECRET_KEY ? "live" : "demo" });
}
