import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import ZoomableImage from "./ZoomableImage";
import {
  CategoryCard,
  Subcategory,
  PriceTag,
  PriceList,
  Label,
  FlavorBlock,
  FlavorInline,
  InlinePrice,
  Note,
} from "./MenuParts";
import { getMenuData } from "../data/menu";
import { useLanguage } from "../i18n/LanguageContext";

const thumbClass =
  "float-right ml-3 mb-2 h-32 w-32 rounded-xl object-cover ring-1 ring-white/60 shadow-[0_1px_2px_rgba(61,43,57,0.15),0_8px_14px_-6px_rgba(61,43,57,0.3)] sm:h-36 sm:w-36";

function buildCategories(menu, t) {
  const {
    cakes,
    cakeFlavors,
    churroCheesecake,
    cupcakes,
    bananaLoaf,
    pies,
    jellos,
    chocolateStrawberries,
    cheesecakes9in,
    bananaPudding,
    tiramisu,
  } = menu;

  return [
    {
      id: "cakes",
      label: t.menu.categoryLabels.cakes,
      node: (
        <CategoryCard title={cakes.title}>
          <Label>{t.menu.startingPrices}</Label>
          <PriceList rows={cakes.startingPrices} />
          <ZoomableImage
            src="/SlideShow/whiteCake.png"
            alt="White cake by Suly's Sweets"
            className={thumbClass}
          />
          <Label>{t.menu.cakeFlavors}</Label>
          <FlavorBlock lines={cakeFlavors} />
          <Note>{cakes.note}</Note>
        </CategoryCard>
      ),
    },
    {
      id: "churro",
      label: t.menu.categoryLabels.churro,
      node: (
        <CategoryCard title={churroCheesecake.title}>
          <InlinePrice>{churroCheesecake.priceLine}</InlinePrice>
          <ZoomableImage
            src="/SlideShow/churroCheesecake.png"
            alt="Churro cheesecake by Suly's Sweets"
            className={thumbClass}
          />
          <FlavorBlock lines={churroCheesecake.options} />
        </CategoryCard>
      ),
    },
    {
      id: "cupcakes",
      label: t.menu.categoryLabels.cupcakes,
      node: (
        <CategoryCard title={cupcakes.title}>
          <Label>{t.menu.byTheDozen}</Label>
          <PriceList rows={cupcakes.prices} />
          <ZoomableImage
            src="/SlideShow/cupcakes.png"
            alt="Custom cupcake dozen by Suly's Sweets"
            className={thumbClass}
          />
          <Label>{t.menu.flavorsSameAsCakes}</Label>
          <FlavorInline>{cakeFlavors.join(", ")}</FlavorInline>
        </CategoryCard>
      ),
    },
    {
      id: "strawberries",
      label: t.menu.categoryLabels.strawberries,
      node: (
        <CategoryCard title={chocolateStrawberries.title}>
          <PriceList rows={chocolateStrawberries.prices} />
          <ZoomableImage
            src="/SlideShow/chocolateCoveredStrawberries.png"
            alt="Chocolate covered strawberries by Suly's Sweets"
            className={thumbClass}
          />
          <FlavorBlock lines={chocolateStrawberries.flavors} />
        </CategoryCard>
      ),
    },
    {
      id: "cheesecakes",
      label: t.menu.categoryLabels.cheesecakes,
      node: (
        <CategoryCard title={cheesecakes9in.title} inlinePrice={cheesecakes9in.price}>
          <ZoomableImage
            src="/SlideShow/cheesecakes.png"
            alt="9 inch cheesecake by Suly's Sweets"
            className={thumbClass}
          />
          <FlavorBlock lines={cheesecakes9in.options} />
        </CategoryCard>
      ),
    },
    {
      id: "more",
      label: t.menu.categoryLabels.more,
      node: (
        <CategoryCard title={t.menu.moreTreats}>
          <Subcategory title={bananaLoaf.title} price={bananaLoaf.price} />
          <Label>{t.menu.addIns}</Label>
          <FlavorBlock lines={bananaLoaf.addIns} />

          <Subcategory title={pies.title} price={pies.price} note={pies.note} />
          <FlavorBlock lines={pies.options} />

          <Subcategory title={jellos.title} price={jellos.price} />
          <ZoomableImage
            src="/SlideShow/gelatinas.png"
            alt="Jellos / Gelatinas by Suly's Sweets"
            className={thumbClass}
          />
          <FlavorBlock lines={jellos.options} />

          <div className="clear-both sm:clear-none" />
          <Subcategory title={bananaPudding.title} />
          <PriceList rows={bananaPudding.prices} />

          <Subcategory title={tiramisu.title} />
          <InlinePrice>{tiramisu.priceLine}</InlinePrice>
        </CategoryCard>
      ),
    },
  ];
}

export default function MenuSection() {
  const { lang, t } = useLanguage();
  const menu = useMemo(() => getMenuData(lang), [lang]);
  const categories = useMemo(() => buildCategories(menu, t), [menu, t]);

  const [active, setActive] = useState(categories[0].id);
  const activeCategory = categories.find((cat) => cat.id === active) ?? categories[0];

  return (
    <section id="menu" className="bg-ivory/85 px-5 py-20 backdrop-blur-md sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="text-xs font-medium tracking-[0.35em] text-mauve-dark uppercase">
            {t.menu.eyebrow}
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl text-plum sm:text-5xl">{t.menu.title}</h2>
          </Reveal>

          <Reveal delay={200} className="mt-6 space-y-1 text-sm text-plum/75">
            <>
              {menu.policyNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </>
          </Reveal>

          <Reveal
            delay={300}
            className="mx-auto mt-6 max-w-xl rounded-3xl border border-mauve/40 bg-gradient-to-br from-cream to-[#ecdfd8] px-6 py-4 shadow-[0_1px_1px_rgba(61,43,57,0.08),0_10px_18px_-8px_rgba(61,43,57,0.18),0_20px_32px_-16px_rgba(61,43,57,0.25),inset_0_1px_0_rgba(255,255,255,0.7)]"
          >
            <>
              {menu.startingPriceNotice.map((line) => (
                <p key={line} className="text-sm font-semibold tracking-wide text-plum">
                  {line}
                </p>
              ))}
            </>
          </Reveal>
        </div>

        <div className="mt-14 hidden items-start gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 80}>
              {cat.node}
            </Reveal>
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm tracking-wide whitespace-nowrap transition-colors duration-200 ${
                  active === cat.id
                    ? "bg-plum text-cream"
                    : "bg-cream text-plum/70 ring-1 ring-plum/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mt-6">{activeCategory.node}</div>
        </div>
      </div>
    </section>
  );
}
