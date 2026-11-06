import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
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
        <CategoryCard image={{ src: "/SlideShow/whiteCake.png", alt: "White cake by Suly's Sweets" }} title={cakes.title}>
          <Label>{t.menu.startingPrices}</Label>
          <PriceList rows={cakes.startingPrices} />
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
        <CategoryCard image={{ src: "/SlideShow/churroCheesecake.png", alt: "Churro cheesecake by Suly's Sweets" }} title={churroCheesecake.title}>
          <InlinePrice>{churroCheesecake.priceLine}</InlinePrice>
          <FlavorBlock lines={churroCheesecake.options} />
        </CategoryCard>
      ),
    },
    {
      id: "cupcakes",
      label: t.menu.categoryLabels.cupcakes,
      node: (
        <CategoryCard image={{ src: "/SlideShow/cupcakes.png", alt: "Custom cupcake dozen by Suly's Sweets" }} title={cupcakes.title}>
          <Label>{t.menu.byTheDozen}</Label>
          <PriceList rows={cupcakes.prices} />
          <Label>{t.menu.flavorsSameAsCakes}</Label>
          <FlavorInline>{cakeFlavors.join(", ")}</FlavorInline>
        </CategoryCard>
      ),
    },
    {
      id: "strawberries",
      label: t.menu.categoryLabels.strawberries,
      node: (
        <CategoryCard image={{ src: "/SlideShow/chocolateCoveredStrawberries.png", alt: "Chocolate covered strawberries by Suly's Sweets" }} title={chocolateStrawberries.title}>
          <PriceList rows={chocolateStrawberries.prices} />
          <FlavorBlock lines={chocolateStrawberries.flavors} />
        </CategoryCard>
      ),
    },
    {
      id: "cheesecakes",
      label: t.menu.categoryLabels.cheesecakes,
      node: (
        <CategoryCard image={{ src: "/SlideShow/cheesecakes.png", alt: "9 inch cheesecake by Suly's Sweets" }} title={cheesecakes9in.title} inlinePrice={cheesecakes9in.price}>
          <FlavorBlock lines={cheesecakes9in.options} />
        </CategoryCard>
      ),
    },
    {
      id: "more",
      label: t.menu.categoryLabels.more,
      node: (
        <CategoryCard image={{ src: "/SlideShow/gelatinas.png", alt: "Jellos / Gelatinas by Suly's Sweets" }} title={t.menu.moreTreats}>
          <Subcategory title={bananaLoaf.title} price={bananaLoaf.price} />
          <Label>{t.menu.addIns}</Label>
          <FlavorBlock lines={bananaLoaf.addIns} />

          <Subcategory title={pies.title} price={pies.price} note={pies.note} />
          <FlavorBlock lines={pies.options} />

          <Subcategory title={jellos.title} price={jellos.price} />
          <FlavorBlock lines={jellos.options} />

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
    <section id="menu" className="bg-ivory/85 px-5 py-24 backdrop-blur-md sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.menu.eyebrow} title={t.menu.title} />

        <Reveal delay={200} className="mx-auto mt-10 max-w-4xl">
          <ul className="flex flex-wrap justify-center gap-2">
            {menu.policyNotes.map((note) => (
              <li
                key={note}
                className="w-full rounded-2xl border border-mauve/25 bg-cream/70 px-4 py-2.5 text-center text-xs leading-snug text-plum/75 backdrop-blur-sm sm:w-auto sm:rounded-full sm:py-2"
              >
                {note}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={300} className="mx-auto mt-6 max-w-xl">
          <div className="flex items-center gap-3 rounded-2xl border border-mauve-dark/20 bg-plum/[0.04] px-5 py-3 text-center">
            <Info className="h-4 w-4 flex-shrink-0 text-mauve-dark" aria-hidden="true" />
            <p className="text-xs font-medium tracking-wide text-plum/80">{menu.startingPriceNotice.join(" ")}</p>
          </div>
        </Reveal>

        <div className="mt-14 hidden items-stretch gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 80} className="h-full">
              {cat.node}
            </Reveal>
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm tracking-wide whitespace-nowrap transition-colors duration-200 ${
                  active === cat.id
                    ? "bg-plum text-cream shadow-md"
                    : "bg-cream/80 text-plum/70 ring-1 ring-plum/10"
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
