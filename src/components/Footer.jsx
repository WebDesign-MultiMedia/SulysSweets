import Reveal from "./Reveal";
import { getMenuData } from "../data/menu";
import { InstagramIcon } from "./icons";
import { useLanguage } from "../i18n/LanguageContext";

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
    <footer className="bg-ivory px-5 py-14 text-plum sm:px-8">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <>
          <p className="font-display text-xl">Suly&apos;s Sweets</p>

          <ul className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => onNavigate(link.href.slice(1), e)}
                  className="text-sm text-plum/80 transition-colors hover:text-mauve-dark"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="https://www.instagram.com/sulys_sweets"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-plum/80 transition-colors hover:text-mauve-dark"
          >
            <InstagramIcon className="h-5 w-5" />
            @sulys_sweets
          </a>

          <p className="font-display text-lg italic">{thankYouNote}</p>

          <p className="text-xs text-plum/50">{t.footer.copyright(new Date().getFullYear())}</p>
        </>
      </Reveal>
    </footer>
  );
}
