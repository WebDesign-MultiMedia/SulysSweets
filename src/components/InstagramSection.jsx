import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { InstagramIcon } from "./icons";
import { GALLERY, altFor } from "../data/gallery";
import { useLanguage } from "../i18n/LanguageContext";

const INSTAGRAM_URL = "https://www.instagram.com/sulys_sweets";
const FEED = [GALLERY[1], GALLERY[3], GALLERY[4], GALLERY[10]];

export default function InstagramSection() {
  const { lang, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-plum px-5 py-24 text-cream sm:px-8 sm:py-28">
      <InstagramIcon className="pointer-events-none absolute -right-16 -bottom-16 h-72 w-72 text-cream/[0.04]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.instagram.eyebrow} title={t.instagram.title} light>
          {t.instagram.paragraph}
        </SectionHeading>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {FEED.map((item, i) => (
            <Reveal key={item.src} delay={i * 90}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${altFor(item, lang)} — Instagram`}
                className="group relative block aspect-square overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-mauve/40 to-mauve-dark/30 ring-1 ring-cream/10"
              >
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-plum/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <InstagramIcon className="h-7 w-7 text-cream" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-12 flex justify-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-cream px-8 py-3.5 text-sm tracking-wide text-plum transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-12px_rgba(0,0,0,0.5)]"
          >
            <InstagramIcon className="h-4 w-4" />
            @sulys_sweets
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
