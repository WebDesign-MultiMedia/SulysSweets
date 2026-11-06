import { FlaskConical } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import useCheckoutMode from "../../hooks/useCheckoutMode";

// Shown only while checkout runs in demo mode (no Stripe keys configured),
// so nobody mistakes a simulated checkout for a placed order.
export default function DemoNotice({ compact = false }) {
  const { t } = useLanguage();
  const mode = useCheckoutMode();
  if (mode !== "demo") return null;

  if (compact) {
    return (
      <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-gold/15 px-3 py-2 text-left text-xs text-espresso">
        <FlaskConical className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-forest" aria-hidden="true" />
        <span>{t.demo.cart}</span>
      </p>
    );
  }

  return (
    <div role="note" className="relative z-30 border-b border-gold/30 bg-gold-light/90 px-5 py-2.5 text-center text-xs text-forest sm:text-sm">
      <span className="font-semibold">{t.demo.title}</span> {t.demo.body}{" "}
      <a
        href="https://www.instagram.com/sulys_sweets"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline"
      >
        @sulys_sweets
      </a>{" "}
      {t.demo.orCall}{" "}
      <a href="tel:+13478595181" className="font-semibold whitespace-nowrap underline">
        347-859-5181
      </a>
      .
    </div>
  );
}
