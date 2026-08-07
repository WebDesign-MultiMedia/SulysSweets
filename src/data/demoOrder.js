// Lets the holiday storefront be clicked through end-to-end with no Stripe/Resend/Twilio
// keys configured. Once real keys are added, /api/checkout succeeds and this is never used.
const SESSION_PREFIX = "demo_";
const STORAGE_PREFIX = "sulys-demo-order:";

export function isDemoSessionId(sessionId) {
  return typeof sessionId === "string" && sessionId.startsWith(SESSION_PREFIX);
}

export function createDemoOrder({
  items,
  customer,
  fulfillment,
  deliveryAddress,
  scheduledDate,
  scheduledTime,
  subtotal,
  depositDue,
  remainingBalance,
}) {
  const sessionId = `${SESSION_PREFIX}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  const order = {
    orderId: `SS-${sessionId.slice(-8).toUpperCase()}`,
    sessionId,
    date: new Date().toISOString(),
    paymentStatus: "paid",
    items: items.map((item) => ({
      name: item.name,
      selectionLabel: item.selectionLabel,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    subtotal,
    depositPaid: depositDue,
    remainingBalance,
    fulfillment,
    deliveryAddress,
    scheduledDate,
    scheduledTime,
    customer,
    isDemo: true,
  };

  sessionStorage.setItem(STORAGE_PREFIX + sessionId, JSON.stringify(order));
  return order;
}

export function getDemoOrder(sessionId) {
  const raw = sessionStorage.getItem(STORAGE_PREFIX + sessionId);
  return raw ? JSON.parse(raw) : null;
}
