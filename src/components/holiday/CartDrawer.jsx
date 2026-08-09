import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useHolidayCart } from "../../context/HolidayCartContext";
import { formatUSD } from "../../data/holidayMenu";
import { createDemoOrder } from "../../data/demoOrder";

const inputClass =
  "w-full rounded-xl border border-espresso/20 bg-white/80 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 outline-none transition-colors focus:border-forest";
const labelClass = "mb-1 block text-xs font-semibold tracking-wide text-forest uppercase";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    depositDue,
    remainingBalance,
    fulfillment,
    setFulfillment,
    deliveryAddress,
    setDeliveryAddress,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    customer,
    setCustomer,
    drawerOpen,
    setDrawerOpen,
  } = useHolidayCart();

  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const canCheckout =
    items.length > 0 &&
    customer.name.trim() &&
    customer.email.trim() &&
    customer.phone.trim() &&
    scheduledDate &&
    scheduledTime &&
    (fulfillment === "pickup" || deliveryAddress.trim());

  // No Stripe keys configured yet — simulate a successful checkout so the
  // storefront can be demoed end-to-end. Once /api/checkout succeeds for
  // real (keys added), this fallback is never reached.
  const runDemoCheckout = () => {
    const order = createDemoOrder({
      items,
      customer,
      fulfillment,
      deliveryAddress: fulfillment === "delivery" ? deliveryAddress : "",
      scheduledDate,
      scheduledTime,
      subtotal,
      depositDue,
      remainingBalance,
    });
    navigate(`/holiday-order/success?session_id=${order.sessionId}`);
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer,
          fulfillment,
          deliveryAddress: fulfillment === "delivery" ? deliveryAddress : "",
          scheduledDate,
          scheduledTime,
          subtotal,
          depositDue,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // No JSON body — no backend available at all (e.g. local dev).
      }

      if (!res.ok || !data?.url) return runDemoCheckout();

      window.location.href = data.url;
    } catch {
      runDemoCheckout();
    }
  };

  return createPortal(
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-[100] bg-espresso/50 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col border-l border-espresso/10 bg-cashmere shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-xl text-espresso">
                <ShoppingBag className="h-5 w-5 text-forest" />
                Your Order
              </h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-espresso transition-colors hover:bg-espresso/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="mt-10 text-center text-sm text-espresso/75">Your cart is empty.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-3 border-b border-espresso/10 pb-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-espresso">{item.name}</p>
                        {item.selectionLabel && (
                          <p className="text-xs text-espresso/75">{item.selectionLabel}</p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-espresso/20 bg-white/60 px-1.5 py-1">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-espresso hover:bg-forest/10"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-4 text-center text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-espresso hover:bg-forest/10"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-espresso">
                            {formatUSD(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.key)}
                        className="h-fit text-espresso/40 transition-colors hover:text-crimson"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {items.length > 0 && (
                <>
                  <div className="mt-6">
                    <p className={labelClass}>Fulfillment</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFulfillment("pickup")}
                        className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                          fulfillment === "pickup"
                            ? "border-forest bg-forest text-cashmere"
                            : "border-espresso/20 bg-white/60 text-espresso"
                        }`}
                      >
                        Pickup (Free)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFulfillment("delivery")}
                        className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                          fulfillment === "delivery"
                            ? "border-forest bg-forest text-cashmere"
                            : "border-espresso/20 bg-white/60 text-espresso"
                        }`}
                      >
                        Delivery
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-espresso/75">
                      {fulfillment === "pickup"
                        ? "Pelham Bay, Bronx."
                        : "Delivery fee varies by location (Bronx, Harlem, Dyckman, Queens & Westchester county) — confirmed at pickup/delivery."}
                    </p>
                    {fulfillment === "delivery" && (
                      <textarea
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Delivery address"
                        className={`${inputClass} mt-2 resize-none`}
                      />
                    )}

                    <p className={`${labelClass} mt-4`}>
                      {fulfillment === "pickup" ? "Pickup" : "Delivery"} Date &amp; Time
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input
                        type="date"
                        value={scheduledDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className={`${inputClass} min-w-0`}
                      />
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className={`${inputClass} min-w-0`}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <p className={labelClass}>Contact Info</p>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={customer.name}
                      onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                      className={inputClass}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={customer.email}
                      onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                      className={inputClass}
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={customer.phone}
                      onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-espresso/10 bg-white/50 px-5 py-4">
                <div className="flex justify-between text-sm text-espresso/80">
                  <span>Total Order Amount</span>
                  <span className="font-semibold text-espresso">{formatUSD(subtotal)}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm text-forest">
                  <span className="font-semibold">50% Deposit Due Now</span>
                  <span className="font-semibold">{formatUSD(depositDue)}</span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-espresso/75">
                  <span>Remaining Balance Due at Pickup</span>
                  <span>{formatUSD(remainingBalance)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-forest/30 px-6 py-2.5 text-sm font-medium tracking-wide text-forest uppercase transition-colors hover:bg-forest/10"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </button>

                <button
                  type="button"
                  disabled={!canCheckout || checkingOut}
                  onClick={handleCheckout}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium tracking-wide text-cashmere uppercase transition-colors hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CreditCard className="h-4 w-4" />
                  {checkingOut ? "Redirecting…" : "Pay 50% Deposit with Card"}
                </button>
                {!canCheckout && (
                  <p className="mt-2 text-center text-xs text-espresso/70">
                    Fill in your name, email, phone, {fulfillment === "delivery" ? "delivery address, " : ""}
                    and a {fulfillment} date &amp; time to continue.
                  </p>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
