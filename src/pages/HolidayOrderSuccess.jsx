import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Printer } from "lucide-react";
import { formatUSD, formatScheduled } from "../data/holidayMenu";
import { clearStoredCart } from "../context/HolidayCartContext";
import { getDemoOrder, isDemoSessionId } from "../data/demoOrder";
import Snowfall from "../components/holiday/Snowfall";
import HolidayVantaBackground from "../components/holiday/HolidayVantaBackground";

function useOrder(sessionId) {
  const [state, setState] = useState({ loading: true, error: "", order: null });

  useEffect(() => {
    if (!sessionId) {
      setState({ loading: false, error: "Missing order reference.", order: null });
      return;
    }

    if (isDemoSessionId(sessionId)) {
      const order = getDemoOrder(sessionId);
      if (order) clearStoredCart();
      setState(
        order
          ? { loading: false, error: "", order }
          : { loading: false, error: "This demo order has expired.", order: null },
      );
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/order?session_id=${encodeURIComponent(sessionId)}`);
        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("The order service is unavailable right now.");
        }
        if (!res.ok) throw new Error(data.error || "Couldn't load your order.");
        if (!cancelled) {
          clearStoredCart();
          setState({ loading: false, error: "", order: data });
        }
      } catch (err) {
        if (!cancelled) setState({ loading: false, error: err.message, order: null });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return state;
}

function ActionButton({ icon: Icon, label, status, onClick }) {
  const text = { idle: label, sending: "Sending…", sent: "Sent!", error: "Try again" }[status];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "sending"}
      className="no-print flex flex-1 items-center justify-center gap-2 rounded-full border border-forest/30 bg-white px-4 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-cashmere disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon className="h-4 w-4" />
      {text}
    </button>
  );
}

export default function HolidayOrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { loading, error, order } = useOrder(sessionId);

  const [emailStatus, setEmailStatus] = useState("idle");
  const [smsStatus, setSmsStatus] = useState("idle");

  const sendEmail = async () => {
    if (!order) return;
    setEmailStatus("sending");
    if (order.isDemo) {
      setTimeout(() => setEmailStatus("sent"), 700);
      return;
    }
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error();
      setEmailStatus("sent");
    } catch {
      setEmailStatus("error");
    }
  };

  const sendSms = async () => {
    if (!order) return;
    setSmsStatus("sending");
    if (order.isDemo) {
      setTimeout(() => setSmsStatus("sent"), 700);
      return;
    }
    try {
      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error();
      setSmsStatus("sent");
    } catch {
      setSmsStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <HolidayVantaBackground />
      <Snowfall />

      <header className="no-print sticky top-0 z-40 border-b border-gold/20 bg-forest/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-3.5 sm:px-8">
          <Link
            to="/holiday-order"
            className="flex items-center gap-1.5 text-sm text-cashmere/85 transition-colors hover:text-gold-light"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Holiday Menu
          </Link>
        </div>
      </header>

      <div className="relative mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
        {loading && <p className="text-center text-cashmere/80">Loading your order…</p>}
        {error && <p className="text-center text-red-300">{error}</p>}

        {order && (
          <div className="print-area rounded-3xl border border-gold/30 bg-white/90 p-6 shadow-[0_10px_30px_-12px_rgba(30,58,43,0.3)] sm:p-9">
            <div className="text-center">
              <p className="font-holiday-script text-4xl text-forest">Thank You!</p>
              <p className="mt-2 text-sm text-espresso/70">
                {order.isDemo
                  ? "This is a demo checkout — no real charge was made."
                  : "Your deposit was received — order confirmed."}
              </p>
              <p className="mt-1 text-xs text-espresso/70">
                {order.isDemo
                  ? "Try the buttons below to preview the email and text receipt."
                  : "A receipt was automatically emailed and texted to you."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-2 border-y border-espresso/10 py-4 text-sm">
              <div>
                <p className="text-xs font-semibold tracking-wide text-forest uppercase">Order #</p>
                <p className="text-espresso">{order.orderId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-forest uppercase">Order Date</p>
                <p className="text-espresso">{new Date(order.date).toLocaleDateString("en-US", { dateStyle: "long" })}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-forest uppercase">Fulfillment</p>
                <p className="text-espresso capitalize">{order.fulfillment}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-1 text-center text-sm text-espresso/80 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-1">
              <p className="min-w-0 break-words">
                <span className="font-semibold text-espresso">Name:</span> {order.customer.name}
              </p>
              <p className="min-w-0 break-words">
                <span className="font-semibold text-espresso">Phone:</span> {order.customer.phone}
              </p>
              <p className="min-w-0 break-words">
                <span className="font-semibold text-espresso">Email:</span> {order.customer.email}
              </p>
            </div>

            {order.fulfillment === "delivery" && order.deliveryAddress && (
              <p className="mt-3 text-sm text-espresso/80">
                <span className="font-semibold">Delivery address:</span> {order.deliveryAddress}
              </p>
            )}
            {order.fulfillment === "pickup" && (
              <p className="mt-3 text-sm text-espresso/80">Pick Up Location: Pelham Bay (Bronx)</p>
            )}
            {order.scheduledDate && order.scheduledTime && (
              <p className="mt-1 text-sm text-espresso/80">
                <span className="font-semibold capitalize">{order.fulfillment} time:</span>{" "}
                {formatScheduled(order.scheduledDate, order.scheduledTime)}
              </p>
            )}

            <ul className="mt-5 flex flex-col gap-3">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between gap-4 border-b border-espresso/10 pb-3 text-sm">
                  <div>
                    <p className="font-semibold text-espresso">
                      {item.quantity}× {item.name}
                    </p>
                    {item.selectionLabel && <p className="text-xs text-espresso/75">{item.selectionLabel}</p>}
                  </div>
                  <span className="whitespace-nowrap text-espresso">{formatUSD(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-1.5 text-sm">
              <div className="flex justify-between text-espresso/80">
                <span>Total Order Amount</span>
                <span className="font-semibold text-espresso">{formatUSD(order.subtotal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-forest">
                <span>Deposit Amount Paid Today</span>
                <span>{formatUSD(order.depositPaid)}</span>
              </div>
              <div className="flex justify-between text-espresso/75">
                <span>Remaining Balance Due at Pickup</span>
                <span>{formatUSD(order.remainingBalance)}</span>
              </div>
            </div>

            <div className="no-print mt-8 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-cashmere transition-transform hover:-translate-y-0.5"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </button>
              <ActionButton icon={Mail} label="Resend Email" status={emailStatus} onClick={sendEmail} />
              <ActionButton icon={MessageSquare} label="Resend Text" status={smsStatus} onClick={sendSms} />
            </div>
          </div>
        )}

        {order && (
          <p className="no-print mt-8 text-center font-holiday-script text-2xl text-cashmere drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
            Happy Holidays from Suly&apos;s Sweets ♡
          </p>
        )}
      </div>
    </div>
  );
}
