import { getStripe } from "./_lib/stripeOrder.js";
import { HOLIDAY_PRODUCTS, computeUnitPrice, describeSelections } from "../src/data/holidayMenu.js";

// Prices are recomputed here from the product catalog rather than trusted from
// the client, so a tampered request can't check out at an arbitrary amount.
function revalidateItems(rawItems) {
  return rawItems.map((raw) => {
    const product = HOLIDAY_PRODUCTS.find((p) => p.id === raw.productId);
    if (!product) throw new Error(`Unknown product: ${raw.productId}`);

    const quantity = Math.max(1, Math.floor(Number(raw.quantity) || 1));
    const unitPrice = computeUnitPrice(product, raw.selections);
    const selectionLabel = describeSelections(product, raw.selections);

    return { name: product.name, selectionLabel, quantity, unitPrice };
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, customer, fulfillment, deliveryAddress, scheduledDate, scheduledTime } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Your cart is empty." });
    }
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ error: "Name, email, and phone are required." });
    }
    if (fulfillment === "delivery" && !deliveryAddress) {
      return res.status(400).json({ error: "Delivery address is required." });
    }
    if (!scheduledDate || !scheduledTime) {
      return res.status(400).json({ error: "A pickup/delivery date and time are required." });
    }

    const validatedItems = revalidateItems(items);
    const subtotal = validatedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const depositDue = Math.round(subtotal * 50) / 100;
    const remainingBalance = subtotal - depositDue;

    const stripe = getStripe();
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Suly's Sweets — Holiday Order (50% Deposit)",
              description: validatedItems.map((i) => `${i.quantity}x ${i.name}`).join(", "),
            },
            unit_amount: Math.round(depositDue * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/holiday-order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/holiday-order`,
      metadata: {
        customerName: customer.name,
        customerPhone: customer.phone,
        fulfillment,
        deliveryAddress: deliveryAddress || "",
        scheduledDate,
        scheduledTime,
        subtotal: subtotal.toFixed(2),
        depositDue: depositDue.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
        items: JSON.stringify(validatedItems),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Checkout failed." });
  }
}
