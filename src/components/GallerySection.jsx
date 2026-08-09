import Reveal from "./Reveal";
import AboutSlideshow from "./AboutSlideshow";
import { useLanguage } from "../i18n/LanguageContext";

export default function GallerySection() {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="bg-blush/60 px-5 py-20 backdrop-blur-md sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal as="p" className="text-xs font-medium tracking-[0.35em] text-mauve-dark uppercase">
          {t.gallery.eyebrow}
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-4 font-display text-4xl text-plum sm:text-5xl">{t.gallery.title}</h2>
        </Reveal>
        <Reveal delay={240} as="p" className="mx-auto mt-6 max-w-md text-base leading-relaxed text-plum/75">
          {t.gallery.paragraph}
        </Reveal>
      </div>

      <Reveal delay={320} className="relative mx-auto mt-12 aspect-[4/3] w-full max-w-2xl">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-ivory to-[#ecdcc0] shadow-[0_1px_1px_rgba(61,43,57,0.08),0_14px_24px_-10px_rgba(61,43,57,0.2),0_30px_45px_-20px_rgba(61,43,57,0.3),inset_0_1px_0_rgba(255,255,255,0.7)]" />
        <AboutSlideshow className="h-full w-full rounded-[2rem]" />
      </Reveal>
    </section>
  );
}
