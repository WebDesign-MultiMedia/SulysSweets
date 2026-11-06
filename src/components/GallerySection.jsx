import Reveal from "./Reveal";
import ProductShot from "./ProductShot";
import SectionHeading from "./SectionHeading";
import { GALLERY, altFor } from "../data/gallery";
import { useLanguage } from "../i18n/LanguageContext";

// Alternating panel tints keep the grid lively while staying on-palette.
const PANELS = ["from-ivory to-blush", "from-blush to-cream", "from-cream to-ivory"];

// Three 2×2 feature tiles + eight singles = 20 cells, which fills both the
// 2-column (mobile) and 4-column grids with no gaps.
const FEATURED = new Set([0, 5, 9]);

export default function GallerySection() {
  const { lang, t } = useLanguage();

  return (
    <section id="gallery" className="bg-blush/60 px-5 py-24 backdrop-blur-md sm:px-8 sm:py-32">
      <SectionHeading eyebrow={t.gallery.eyebrow} title={t.gallery.title}>
        {t.gallery.paragraph}
      </SectionHeading>

      <div className="mx-auto mt-14 grid max-w-6xl grid-flow-dense grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {GALLERY.map((item, i) => (
          <Reveal
            key={item.src}
            delay={(i % 4) * 80}
            className={FEATURED.has(i) ? "col-span-2 row-span-2" : ""}
          >
            <ProductShot
              src={item.src}
              alt={altFor(item, lang)}
              caption={item[lang] ?? item.en}
              panel={PANELS[i % PANELS.length]}
              className={`rounded-[1.75rem] ${FEATURED.has(i) ? "aspect-square h-full" : "aspect-square"}`}
              imgClassName={FEATURED.has(i) ? "p-6 sm:p-10" : "p-3 sm:p-5"}
            />
          </Reveal>
        ))}
      </div>

      <Reveal as="p" className="mt-8 text-center text-xs tracking-wide text-plum/55">
        {t.gallery.hint}
      </Reveal>
    </section>
  );
}
