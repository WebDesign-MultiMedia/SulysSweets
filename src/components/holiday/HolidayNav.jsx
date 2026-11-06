import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useHolidayCart } from "../../context/HolidayCartContext";
import { useLanguage } from "../../i18n/LanguageContext";
import LanguageToggle from "../LanguageToggle";

export default function HolidayNav() {
  const { itemCount, setDrawerOpen } = useHolidayCart();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-forest/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-cashmere/85 transition-colors hover:text-gold-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Suly&apos;s Sweets
        </Link>

        <p className="hidden font-holiday-script text-3xl text-gold-light sm:block">{t.holiday.nav.title}</p>

        <div className="flex items-center gap-4">
          <span className="rounded-full bg-cashmere/90">
            <LanguageToggle />
          </span>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t.holiday.nav.openCart}
            className="relative flex items-center gap-2 text-cashmere transition-colors hover:text-gold-light"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-holly text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
