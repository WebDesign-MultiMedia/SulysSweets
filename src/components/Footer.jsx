import { Link } from "react-router-dom";
import { getMenuData } from "../data/menu";
import { InstagramIcon } from "./icons";
import { useLanguage } from "../i18n/LanguageContext";

const linkClass = "text-sm text-plum/70 transition-colors hover:text-mauve-dark";
const headingClass = "text-[11px] font-medium tracking-[0.3em] text-mauve-dark uppercase";

export default function Footer({ onNavigate }) {
  const { lang, t } = useLanguage();
  const { thankYouNote } = getMenuData(lang);
  const navLinks = [
    { href: "#home", label: t.header.nav.home },
    { href: "#about", label: t.header.nav.about },
    { href: "#gallery", label: t.header.nav.gallery },
    { href: "#menu", label: t.header.nav.menu },
    { href: "#contact", label: t.header.nav.contact },
  ];

  return (
    <footer className="border-t border-plum/10 bg-ivory px-5 pt-16 pb-8 text-plum sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full ring-1 ring-plum/10" />
            <p className="font-display text-2xl">Suly&apos;s Sweets</p>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-plum/65">{t.footer.tagline}</p>
          <p className="font-script text-2xl text-mauve-dark">{thankYouNote}</p>
        </div>

        <div>
          <p className={headingClass}>{t.footer.explore}</p>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={(e) => onNavigate(link.href.slice(1), e)} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/holiday-order" className={linkClass}>
                {t.header.holidayMenu}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className={headingClass}>{t.footer.contact}</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a href="mailto:sulyssweets24@gmail.com" className={linkClass}>
                sulyssweets24@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+13478595181" className={linkClass}>
                347-859-5181
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/sulys_sweets"
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} inline-flex items-center gap-2`}
              >
                <InstagramIcon className="h-4 w-4" />
                @sulys_sweets
              </a>
            </li>
            <li className="text-sm text-plum/55">Pelham Bay, Bronx, NY</li>
          </ul>
        </div>

        <div>
          <p className={headingClass}>{t.footer.legal}</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/privacy" className={linkClass}>
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link to="/terms" className={linkClass}>
                {t.footer.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl border-t border-plum/10 pt-6 text-center text-xs text-plum/50">
        {t.footer.copyright(new Date().getFullYear())}
      </div>
    </footer>
  );
}
