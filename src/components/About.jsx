import { HandHeart, Leaf, Palette } from "lucide-react";
import Reveal from "./Reveal";
import AboutSlideshow from "./AboutSlideshow";
import SectionHeading from "./SectionHeading";
import { useLanguage } from "../i18n/LanguageContext";

const VALUE_ICONS = [HandHeart, Leaf, Palette];

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-cream/85 px-5 py-24 backdrop-blur-md sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-4 rounded-t-[999px] rounded-b-[3rem] border border-mauve/30" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-gradient-to-b from-ivory to-blush ring-1 ring-white/70 shadow-[0_40px_70px_-30px_rgba(61,43,57,0.4)]">
            <AboutSlideshow className="cutout-shadow h-full w-full" />
          </div>
          <p className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-full bg-plum px-6 py-2 font-script text-2xl whitespace-nowrap text-cream shadow-lg">
            Suly&apos;s Sweets
          </p>
        </Reveal>

        <div>
          <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} align="left">
            {t.about.paragraph1}
          </SectionHeading>
          <Reveal
            delay={260}
            as="p"
            className="mx-auto mt-4 max-w-md text-center text-base leading-relaxed text-plum/70 lg:mx-0 lg:text-left"
          >
            {t.about.paragraph2}
          </Reveal>

          <ul className="mx-auto mt-10 grid max-w-md gap-3 lg:mx-0">
            {t.about.values.map((value, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <Reveal
                  as="li"
                  key={value.title}
                  delay={320 + i * 90}
                  className="flex items-center gap-4 rounded-2xl border border-mauve/20 bg-ivory/60 px-5 py-4 text-left"
                >
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-plum text-cream">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display text-lg text-plum">{value.title}</span>
                    <span className="block text-xs leading-relaxed text-plum/65">{value.text}</span>
                  </span>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
