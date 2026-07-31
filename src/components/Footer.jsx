import Reveal from "./Reveal";
import { thankYouNote } from "../data/menu";
import { InstagramIcon } from "./icons";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#contact", label: "Contact" },
];

export default function Footer({ onNavigate }) {
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

          <p className="text-xs text-plum/50">
            {`© ${new Date().getFullYear()} Suly's Sweets. All rights reserved.`}
          </p>
        </>
      </Reveal>
    </footer>
  );
}
