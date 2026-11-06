import {
  CartTooLargeError,
  NotConfiguredError,
  encodeItemsMetadata,
  getStripe,
  truncateMeta,
} from "./_lib/stripeOrder.js";
import { HOLIDAY_PRODUCTS, computeUnitPrice, describeSelections, findOption } from "../src/data/holidayMenu.js";

class UnknownProductError extends Error {}

// Prices are recomputed here from the product catalog rather than trusted from
// the client, so a tampered request can't check out at an arbitrary amount.
function revalidateItems(rawItems) {
  return rawItems.map((raw) => {
    const product = HOLIDAY_PRODUCTS.find((p) => p.id === raw?.productId);
    if (!product) throw new UnknownProductError(`Unknown product: ${raw?.productId}`);

    // Every option group must name a real option. Without this, an invalid
    // size id would price the item at $0.
    for (const group of product.variantGroups) {
      if (!findOption(product, group.id, raw.selections?.[group.id])) {
        throw new UnknownProductError(`Invalid ${group.id} for ${product.id}`);
      }
    }

    const quantity = Math.min(99, Math.max(1, Math.floor(Number(raw.quantity) || 1)));
    const unitPrice = computeUnitPrice(product, raw.selections);
    const selectionLabel = describeSelections(product, raw.selections);

    // productId + selections let the confirmation page show names in the
    // customer's language; name/selectionLabel stay English for receipts.
    const selections = Object.fromEntries(
      product.variantGroups.map((group) => [group.id, String(raw.selections[group.id])]),
    );
    return { productId: product.id, selections, name: product.name, selectionLabel, quantity, unitPrice };
  });
}

// Errors go back to the browser as a short code (translated client-side);
// details are only logged server-side.
function fail(res, status, code) {
  return res.status(status).json({ error: code });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const {
      items,
      customer,
      fulfillment,
      deliveryAddress,
      scheduledDate,
      scheduledTime,
      lang,
    } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) return fail(res, 400, "cart_empty");
    if (!customer?.name || !customer?.email || !customer?.phone) return fail(res, 400, "missing_contact");
    if (fulfillment !== "pickup" && fulfillment !== "delivery") return fail(res, 400, "missing_contact");
    if (fulfillment === "delivery" && !deliveryAddress) return fail(res, 400, "missing_address");
    if (!scheduledDate || !scheduledTime) return fail(res, 400, "missing_schedule");

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
              description: truncateMeta(validatedItems.map((i) => `${i.quantity}x ${i.name}`).join(", ")),
            },
            unit_amount: Math.round(depositDue * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/holiday-order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/holiday-order`,
      metadata: {
        customerName: truncateMeta(customer.name),
        customerPhone: truncateMeta(customer.phone),
        fulfillment,
        deliveryAddress: fulfillment === "delivery" ? truncateMeta(deliveryAddress) : "",
        scheduledDate: truncateMeta(scheduledDate),
        scheduledTime: truncateMeta(scheduledTime),
        subtotal: subtotal.toFixed(2),
        depositDue: depositDue.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
        // The customer's language, so the email receipt matches the site.
        lang: lang === "es" ? "es" : "en",
        ...encodeItemsMetadata(validatedItems),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    if (err instanceof NotConfiguredError) {
      // Lets the storefront fall back to demo checkout until keys are added.
      console.warn("Checkout unavailable:", err.message);
      return fail(res, 503, "not_configured");
    }
    if (err instanceof UnknownProductError) return fail(res, 400, "unknown_product");
    if (err instanceof CartTooLargeError) return fail(res, 400, "cart_too_large");
    console.error("Checkout failed:", err);
    return fail(res, 500, "checkout_failed");
  }
}
