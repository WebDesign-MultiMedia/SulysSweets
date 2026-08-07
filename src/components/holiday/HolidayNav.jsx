import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useHolidayCart } from "../../context/HolidayCartContext";

export default function HolidayNav() {
  const { itemCount, setDrawerOpen } = useHolidayCart();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-forest/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-cashmere/85 transition-colors hover:text-gold-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Suly&apos;s Sweets
        </Link>

        <p className="hidden font-holiday-script text-xl text-gold-light sm:block">
          Christmas &amp; New Year&apos;s
        </p>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open cart"
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
    </header>
  );
}
