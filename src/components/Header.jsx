import { useEffect, useRef, useState } from "react";
import { InstagramIcon } from "./icons";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
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
    const onPointerDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
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
          <a
            href="#home"
            className={`flex items-center gap-3 transition-all duration-700 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            <img src="/logo.png" alt="Suly's Sweets logo" width={40} height={40} className="h-10 w-10 rounded-full" />
            <span className="font-script text-2xl tracking-wide text-plum">Suly&apos;s Sweets</span>
          </a>

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
          </ul>
        </nav>
      </header>

      {/* Rendered outside <header> — backdrop-filter on the scrolled header
          would otherwise become a containing block for these fixed elements,
          breaking their viewport-relative positioning. */}

      {/* Dimmed backdrop behind the mobile nav panel — click to close. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-plum/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Floating capsule that morphs from a compact "Menu" pill into a
          small dropdown card, instead of pushing header content. */}
      <div
        className={`fixed z-50 md:hidden transition-all duration-500 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        } ${open ? "top-5 right-5" : scrolled ? "top-4 right-5" : "top-6 right-5"}`}
        style={{
          width: open ? "16rem" : "7.5rem",
          height: open ? "22rem" : "3.25rem",
        }}
      >
        <div
          ref={panelRef}
          className={`relative h-full w-full overflow-hidden border border-plum/10 shadow-lg transition-all duration-500 ease-out ${
            open ? "rounded-3xl bg-cream shadow-2xl" : "rounded-full bg-cream"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex w-full items-center gap-2.5 px-4 py-3.5 transition-transform duration-150 active:scale-95"
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
            <span
              className={`overflow-hidden whitespace-nowrap font-script text-xl leading-none text-plum transition-all duration-300 ${
                open ? "max-w-0 opacity-0" : "max-w-[4rem] opacity-100"
              }`}
            >
              Menu
            </span>
          </button>

          <div
            className={`flex flex-col items-center px-6 pb-8 text-center transition-opacity duration-300 ${open ? "opacity-100 delay-150" : "opacity-0"}`}
          >
            <p className="mb-1 font-script text-xl text-plum/50">Menu</p>
            <ul className="flex flex-col items-center">
              {navLinks.map((link, i) => (
                <li
                  key={link.href}
                  style={{ transitionDelay: open ? `${150 + i * 70}ms` : "0ms" }}
                  className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-1.5 font-script text-3xl leading-tight text-plum transition-all duration-150 hover:text-terracotta active:scale-95"
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
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${150 + navLinks.length * 70}ms` : "0ms" }}
              className={`mt-6 flex items-center gap-2 text-sm tracking-wide text-plum/70 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:text-terracotta ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <InstagramIcon className="h-5 w-5" />
              @sulys_sweets
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
