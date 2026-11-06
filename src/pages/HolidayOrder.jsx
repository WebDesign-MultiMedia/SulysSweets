import { useState } from "react";
import { Image as ImageIcon, List as ListIcon, TreePine } from "lucide-react";
import { HolidayCartProvider } from "../context/HolidayCartContext";
import HolidayNav from "../components/holiday/HolidayNav";
import HolidayHero from "../components/holiday/HolidayHero";
import ProductCard from "../components/holiday/ProductCard";
import CartDrawer from "../components/holiday/CartDrawer";
import Snowfall from "../components/holiday/Snowfall";
import Garland from "../components/holiday/Garland";
import HolidayVantaBackground from "../components/holiday/HolidayVantaBackground";
import HolidayFooter from "../components/holiday/HolidayFooter";
import DemoNotice from "../components/holiday/DemoNotice";
import { HOLIDAY_PRODUCTS } from "../data/holidayMenu";
import { useLanguage } from "../i18n/LanguageContext";

function HolidayOrderContent() {
  const [viewMode, setViewMode] = useState("image");
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <HolidayVantaBackground />
      <Snowfall />

      <HolidayNav />
      <DemoNotice />
      <HolidayHero />

      <div id="menu" className="relative mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <Garland />

        <h2 className="flex items-center justify-center gap-3 text-center font-display text-3xl text-cashmere">
          <TreePine className="h-6 w-6 text-gold-light" aria-hidden="true" />
          {t.holiday.menu.title}
          <TreePine className="h-6 w-6 -scale-x-100 text-gold-light" aria-hidden="true" />
        </h2>

        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-full bg-white/70 p-1 ring-1 ring-gold/30">
            <button
              type="button"
              onClick={() => setViewMode("image")}
              aria-pressed={viewMode === "image"}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm tracking-wide transition-colors duration-200 ${
                viewMode === "image" ? "bg-forest text-cashmere" : "text-espresso"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              {t.holiday.menu.imageView}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm tracking-wide transition-colors duration-200 ${
                viewMode === "list" ? "bg-forest text-cashmere" : "text-espresso"
              }`}
            >
              <ListIcon className="h-4 w-4" />
              {t.holiday.menu.listView}
            </button>
          </div>
        </div>

        <div className="mt-6 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {HOLIDAY_PRODUCTS.map((product) => (
            <div key={product.id} className="mb-6 break-inside-avoid">
              <ProductCard product={product} showImages={viewMode === "image"} />
            </div>
          ))}
        </div>

      </div>

      <HolidayFooter />

      <CartDrawer />
    </div>
  );
}

export default function HolidayOrder() {
  return (
    <HolidayCartProvider>
      <HolidayOrderContent />
    </HolidayCartProvider>
  );
}
