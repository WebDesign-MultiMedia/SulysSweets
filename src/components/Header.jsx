"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#policies", label: "Policies" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          scrolled
            ? "border-b border-plum/10 bg-cream/50 py-3 shadow-[0_8px_32px_rgba(78,61,66,0.12)] backdrop-blur-xl"
            : "bg-transparent py-6"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Suly's Sweets logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full ring-1 ring-white/60 shadow-[0_2px_6px_rgba(78,61,66,0.25)]"
            />
            <span className="font-heading text-2xl text-plum">Suly&apos;s Sweets</span>
          </a>

          <ul className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-heading text-xl text-plum/80 transition-colors hover:text-sage-dark"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/60 ring-1 ring-plum/10 backdrop-blur-md md:hidden"
          >
            <span className="flex h-3.5 w-4 flex-col justify-between">
              <span className="h-px w-full bg-plum" />
              <span className="h-px w-full bg-plum" />
              <span className="h-px w-full bg-plum" />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile nav overlay + panel rendered as siblings of <header>, not
          descendants — a backdrop-blur ancestor becomes a containing block
          for fixed children and would break their viewport-relative
          positioning. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-plum/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[80vw] bg-cream/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="font-heading text-xl text-plum">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blush text-plum"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col items-start gap-1 px-6">
          {navLinks.map((link) => (
            <li key={link.href} className="w-full">
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-heading text-3xl text-plum transition-colors hover:text-sage-dark"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
