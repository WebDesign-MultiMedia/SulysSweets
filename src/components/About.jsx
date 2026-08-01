import Reveal from "./Reveal";
import AboutSlideshow from "./AboutSlideshow";
import { useLanguage } from "../i18n/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-cream px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="h-full w-full  rounded-[2rem] bg-gradient-to-br from-ivory to-[#ecdcc0] shadow-[0_1px_1px_rgba(61,43,57,0.08),0_14px_24px_-10px_rgba(61,43,57,0.2),0_30px_45px_-20px_rgba(61,43,57,0.3),inset_0_1px_0_rgba(255,255,255,0.7)]" />
          <div className="absolute  inset-x-0 top-1/2 z-10 aspect-[9/16] w-full -translate-y-1/2">
            <AboutSlideshow className="h-full w-full rounded-[2rem] " />
          </div>
        </Reveal>

        <div className="text-center lg:text-left">
          <Reveal as="p" className="text-xs font-medium tracking-[0.35em] text-mauve-dark uppercase">
            {t.about.eyebrow}
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-4 font-display text-4xl text-plum sm:text-5xl">{t.about.title}</h2>
          </Reveal>
          <Reveal
            delay={240}
            as="p"
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-plum/75 lg:mx-0"
          >
            {t.about.paragraph1}
          </Reveal>
          <Reveal
            delay={320}
            as="p"
            className="mx-auto mt-4 max-w-md text-base leading-relaxed text-plum/75 lg:mx-0"
          >
            {t.about.paragraph2}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
