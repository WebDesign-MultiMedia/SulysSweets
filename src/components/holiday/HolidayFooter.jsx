import { Link } from "react-router-dom";
import { InstagramIcon } from "../icons";
import { useLanguage } from "../../i18n/LanguageContext";
import { getMenuData } from "../../data/menu";

export default function HolidayFooter() {
  const { lang, t } = useLanguage();
  const { thankYouNote } = getMenuData(lang);

  return (
    <footer className="relative border-t border-gold/20 bg-forest/70 px-5 py-12 text-cashmere sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
        <p className="font-display text-xl">Suly&apos;s Sweets</p>

        <Link to="/" className="text-sm text-cashmere/80 transition-colors hover:text-gold-light">
          ← Back to Main Site
        </Link>

        <a
          href="https://www.instagram.com/sulys_sweets"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-cashmere/80 transition-colors hover:text-gold-light"
        >
          <InstagramIcon className="h-5 w-5" />
          @sulys_sweets
        </a>

        <p className="font-display text-lg text-gold-light italic">{thankYouNote}</p>

        <p className="text-xs text-cashmere/50">{t.footer.copyright(new Date().getFullYear())}</p>
      </div>
    </footer>
  );
}
