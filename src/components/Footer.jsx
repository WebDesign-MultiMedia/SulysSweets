import { thankYouNote } from "@/data/menu";
import { InstagramIcon, MailIcon, PinIcon } from "./icons";

export default function Footer() {
  return (
    <footer id="contact" className="bg-plum px-5 py-16 text-cream sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <p className="font-heading text-3xl">Suly&apos;s Sweets</p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://www.instagram.com/sulys_sweets"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-cream/10 px-5 py-2.5 text-sm tracking-wide ring-1 ring-cream/20 transition-colors hover:bg-cream/20"
          >
            <InstagramIcon className="h-4 w-4" />
            @sulys_sweets
          </a>

          <a
            href="mailto:sulyssweets24@gmail.com"
            className="flex items-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-medium tracking-wide text-plum transition-colors hover:bg-sage-dark hover:text-cream"
          >
            <MailIcon className="h-4 w-4" />
            sulyssweets24@gmail.com
          </a>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-cream/70">
          <PinIcon className="h-4 w-4" />
          Pelham Bay, The Bronx NY
        </p>

        <p className="font-heading text-2xl italic text-cream/90">{thankYouNote}</p>

        <p className="text-xs text-cream/40">
          {`© ${new Date().getFullYear()} Suly's Sweets. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}
