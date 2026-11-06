import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { useLanguage } from "../i18n/LanguageContext";

export default function Hero({ onNavigate }) {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-8 sm:pt-40 lg:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <Reveal
            immediate
            as="p"
            className="inline-flex items-center gap-2 rounded-full border border-mauve/30 bg-cream/60 px-4 py-1.5 text-[11px] font-medium tracking-[0.3em] text-mauve-dark uppercase backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t.hero.eyebrow}
          </Reveal>

          <Reveal immediate delay={120}>
            <h1 className="mt-7 font-display text-[clamp(3rem,7.5vw,5.75rem)] leading-[1.02] tracking-tight text-plum">
              {t.hero.titleLine1}
              <br />
              <span className="italic text-mauve-dark">{t.hero.titleLine2}</span>
            </h1>
          </Reveal>

          <Reveal
            immediate
            delay={240}
            as="p"
            className="mx-auto mt-7 max-w-md text-base leading-relaxed text-plum/75 sm:text-lg lg:mx-0"
          >
            {t.hero.paragraph}
          </Reveal>

          <Reveal immediate delay={360} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#menu"
              onClick={(e) => onNavigate("menu", e)}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-plum px-8 py-3.5 text-sm tracking-wide text-cream shadow-[0_12px_24px_-12px_rgba(61,43,57,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4a3546]"
            >
              {t.hero.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              onClick={(e) => onNavigate("contact", e)}
              className="inline-flex items-center justify-center rounded-full border border-plum/25 bg-cream/40 px-8 py-3.5 text-sm tracking-wide text-plum backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-plum/50 hover:bg-cream/70"
            >
              {t.hero.ctaSecondary}
            </a>
          </Reveal>

          <Reveal immediate delay={480} as="ul" className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs tracking-wide text-plum/65 lg:justify-start">
            {t.hero.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-mauve-dark" aria-hidden="true" />
                {item}
              </li>
            ))}
          </Reveal>
        </div>

        {/* Showcase: arched panel with the signature cake, a supporting
            treat, and the logo as a floating seal. */}
        <Reveal immediate delay={200} className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-gradient-to-b from-cream/90 via-blush/80 to-ivory/90 ring-1 ring-white/70 shadow-[0_40px_70px_-30px_rgba(61,43,57,0.45)]">
            <div className="absolute inset-x-8 bottom-10 h-6 rounded-[50%] bg-plum/10 blur-md" aria-hidden="true" />
            <img
              src="/hero-white-cake.webp"
              alt="Two-tier white cake with gold leaf and sugar roses by Suly's Sweets"
              width={506}
              height={900}
              fetchPriority="high"
              className="cutout-shadow absolute inset-x-0 -bottom-6 mx-auto h-[112%] w-auto object-contain"
            />
          </div>

          <div className="animate-float absolute -bottom-6 -left-4 w-28 rounded-3xl bg-cream/90 p-2 ring-1 ring-white/70 shadow-[0_20px_35px_-18px_rgba(61,43,57,0.45)] backdrop-blur-sm sm:-left-10 sm:w-32">
            <img
              src="/hero-strawberry-cake.webp"
              alt="Fresh strawberry cake by Suly's Sweets"
              width={288}
              height={288}
              loading="lazy"
              className="cutout-shadow aspect-square w-full object-contain"
            />
          </div>

          <div className="absolute -top-4 -right-2 h-24 w-24 rounded-full bg-cream p-1.5 ring-1 ring-white/70 shadow-[0_16px_30px_-14px_rgba(61,43,57,0.5)] sm:-right-8 sm:h-28 sm:w-28">
            <img src="/logo-256.png" alt="Suly's Sweets logo" width={112} height={112} className="h-full w-full rounded-full" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
