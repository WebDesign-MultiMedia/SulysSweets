import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Home as HomeIcon, Heart, Image as ImageIcon, UtensilsCrossed, Mail } from "lucide-react";
import { InstagramIcon } from "./icons";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageToggle from "./LanguageToggle";

// Ivory is the site's own warm cream tone (body/section backgrounds) —
// every tile shares it instead of the original "Multibox" rainbow, so the
// nav reads as part of this site.
const TILE_COLORS = ["bg-ivory"];

// Icon per tile instead of a text label — keyed by the link's hash id.
const TILE_ICONS = {
  home: HomeIcon,
  about: Heart,
  gallery: ImageIcon,
  menu: UtensilsCrossed,
  contact: Mail,
};

export default function Header({ activePage, onNavigate }) {
  const { t } = useLanguage();
  const navLinks = [
    { href: "#home", label: t.header.nav.home },
    { href: "#about", label: t.header.nav.about },
    { href: "#gallery", label: t.header.nav.gallery },
    { href: "#menu", label: t.header.nav.menu },
    { href: "#contact", label: t.header.nav.contact },
  ];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-ivory/90 py-3 shadow-sm backdrop-blur-sm" : "bg-transparent py-6"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <a
              href="#home"
              onClick={(e) => onNavigate("home", e)}
              className={`flex items-center gap-3 transition-all duration-700 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
            >
              <img
                src="/logo.png"
                alt="Suly's Sweets logo"
                width={40}
                height={40}
                className="h-20 w-20 rounded-full ring-1 ring-white/60 shadow-[0_1px_2px_rgba(61,43,57,0.2),0_4px_8px_-2px_rgba(61,43,57,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] transition-transform duration-300 hover:scale-105 hover:[transform:rotateY(-12deg)]"
              />
              <span className="font-script text-2xl tracking-wide text-plum"></span>
            </a>

            <div
              className={`md:hidden transition-all duration-700 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
            >
              <LanguageToggle />
            </div>
          </div>

          <ul className="hidden items-center gap-10 md:flex">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                style={{ transitionDelay: mounted ? `${150 + i * 90}ms` : "0ms" }}
                className={`transition-all duration-700 ease-out ${
                  mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                }`}
              >
                <a
                  href={link.href}
                  className="text-sm tracking-wide text-plum/80 transition-colors hover:text-mauve-dark"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li
              style={{ transitionDelay: mounted ? `${150 + navLinks.length * 90}ms` : "0ms" }}
              className={`transition-all duration-700 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
            >
              <Link
                to="/holiday-order"
                className="flex flex-col items-center rounded-full bg-forest px-4 py-1.5 leading-tight text-cashmere transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-sm tracking-wide">Holiday Menu</span>
                <span className="text-[10px] tracking-wide text-cashmere/70">Place Your Order</span>
              </Link>
            </li>
            <li
              style={{ transitionDelay: mounted ? `${150 + (navLinks.length + 1) * 90}ms` : "0ms" }}
              className={`transition-all duration-700 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
            >
              <LanguageToggle />
            </li>
          </ul>
        </nav>
      </header>

      {/* Rendered outside <header> — backdrop-filter on the scrolled header
          would otherwise become a containing block for these fixed elements,
          breaking their viewport-relative positioning. */}

      {/* Hamburger / close toggle — stays on top of the grid overlay below. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.header.toggleMenuAria}
        aria-expanded={open}
        className={`fixed z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-plum/10 shadow-lg transition-all duration-500 ease-out md:hidden ${
          mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        } ${open ? "top-5 right-5 bg-cream" : scrolled ? "top-4 right-5 bg-cream" : "top-6 right-5 bg-cream/90"}`}
      >
        <span className="flex h-4 w-4 flex-shrink-0 flex-col items-center justify-center gap-1">
          <span
            className={`h-px w-4 bg-plum transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span className={`h-px w-4 bg-plum transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-4 bg-plum transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* Full-screen grid navigation — one solid-color tile per link,
          staggered scale/fade reveal, mobile only. */}
      <div
        ref={panelRef}
        className={`fixed inset-0 z-50 grid grid-cols-2 auto-rows-fr gap-3 bg-plum p-4 pt-24 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {navLinks.map((link, i) => {
          const Icon = TILE_ICONS[link.href.slice(1)];
          const active = activePage === link.href.slice(1);
          return (
            <a
              key={link.href}
              href={link.href}
              aria-label={link.label}
              onClick={(e) => {
                setOpen(false);
                onNavigate(link.href.slice(1), e);
              }}
              style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
              className={`flex items-center justify-center rounded-2xl p-6 text-plum transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                TILE_COLORS[i % TILE_COLORS.length]
              } ${
                active
                  ? "ring-2 ring-plum shadow-[3px_3px_0_0_#3d2b39]"
                  : "shadow-[4px_4px_0_0_#3d2b39] hover:shadow-[2px_2px_0_0_#3d2b39] hover:translate-x-[2px] hover:translate-y-[2px]"
              } ${open ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
            >
              <Icon className="h-9 w-9" strokeWidth={1.75} />
            </a>
          );
        })}

        <Link
          to="/holiday-order"
          onClick={() => setOpen(false)}
          style={{ transitionDelay: open ? `${navLinks.length * 60}ms` : "0ms" }}
          className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-forest p-6 text-center text-cashmere shadow-[4px_4px_0_0_#0e2019] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#0e2019] ${
            open ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <span className="font-script text-3xl leading-tight">Holiday Menu</span>
          <span className="text-xs tracking-wide text-cashmere/70">Place Your Order</span>
        </Link>

        <a
          href="https://www.instagram.com/sulys_sweets"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          style={{ transitionDelay: open ? `${(navLinks.length + 1) * 60}ms` : "0ms" }}
          className={`col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-ivory p-6 text-center text-plum shadow-[4px_4px_0_0_#3d2b39] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#3d2b39] ${
            open ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <InstagramIcon className="h-5 w-5" />
          @sulys_sweets
        </a>
      </div>
    </>
  );
}
