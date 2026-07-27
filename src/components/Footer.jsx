import Reveal from "./Reveal";
import { thankYouNote } from "../data/menu";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-plum px-5 py-14 text-cream sm:px-8">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <>
          <p className="font-display text-xl">Suly&apos;s Sweets</p>

          <ul className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-cream/80 transition-colors hover:text-mauve">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="font-display text-lg italic">{thankYouNote}</p>

          <p className="text-xs text-cream/50">
            {`© ${new Date().getFullYear()} Suly's Sweets. All rights reserved.`}
          </p>
        </>
      </Reveal>
    </footer>
  );
}
