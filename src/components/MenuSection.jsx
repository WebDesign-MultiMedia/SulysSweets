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
import {
  policyNotes,
  startingPriceNotice,
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
} from "../data/menu";

const thumbClass =
  "float-right ml-3 mb-2 h-32 w-32 rounded-xl object-cover shadow-sm shadow-plum/10 sm:h-36 sm:w-36";

export default function MenuSection() {
  return (
    <section id="menu" className="bg-ivory px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="text-xs font-medium tracking-[0.35em] text-mauve-dark uppercase">
            Our Menu
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl text-plum sm:text-5xl">Suly&apos;s Sweets Menu</h2>
          </Reveal>

          <Reveal delay={200} className="mt-6 space-y-1 text-sm text-plum/75">
            <>
              {policyNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </>
          </Reveal>

          <Reveal
            delay={300}
            className="mx-auto mt-6 max-w-xl rounded-3xl border border-mauve/40 bg-cream px-6 py-4 shadow-lg shadow-plum/10"
          >
            <>
              {startingPriceNotice.map((line) => (
                <p key={line} className="text-sm font-semibold tracking-wide text-plum">
                  {line}
                </p>
              ))}
            </>
          </Reveal>
        </div>

        <div className="mt-14 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={0}>
            <CategoryCard title={cakes.title}>
              <Label>Starting Prices</Label>
              <PriceList rows={cakes.startingPrices} />
              <ZoomableImage
                src="/SlideShow/whiteCake.png"
                alt="White cake by Suly's Sweets"
                className={thumbClass}
              />
              <Label>Cake Flavors</Label>
              <FlavorBlock lines={cakeFlavors} />
              <Note>{cakes.note}</Note>
            </CategoryCard>
          </Reveal>

          <Reveal delay={80}>
            <CategoryCard title={churroCheesecake.title}>
              <InlinePrice>{churroCheesecake.priceLine}</InlinePrice>
              <ZoomableImage
                src="/churroCheesecake.png"
                alt="Churro cheesecake by Suly's Sweets"
                className={thumbClass}
              />
              <FlavorBlock lines={churroCheesecake.options} />
            </CategoryCard>
          </Reveal>

          <Reveal delay={160}>
            <CategoryCard title={cupcakes.title}>
              <Label>By the Dozen</Label>
              <PriceList rows={cupcakes.prices} />
              <ZoomableImage
                src="/cupcakes.png"
                alt="Custom cupcake dozen by Suly's Sweets"
                className={thumbClass}
              />
              <Label>Flavors (Same as cakes)</Label>
              <FlavorInline>{cakeFlavors.join(", ")}</FlavorInline>
            </CategoryCard>
          </Reveal>

          <Reveal delay={0}>
            <CategoryCard title={chocolateStrawberries.title}>
              <PriceList rows={chocolateStrawberries.prices} />
              <ZoomableImage
                src="/chocolateCoveredStrawberries.png"
                alt="Chocolate covered strawberries by Suly's Sweets"
                className={thumbClass}
              />
              <FlavorBlock lines={chocolateStrawberries.flavors} />
            </CategoryCard>
          </Reveal>

          <Reveal delay={80}>
            <CategoryCard title={cheesecakes9in.title} inlinePrice={cheesecakes9in.price}>
              <ZoomableImage
                src="/cheesecakes.png"
                alt="9 inch cheesecake by Suly's Sweets"
                className={thumbClass}
              />
              <FlavorBlock lines={cheesecakes9in.options} />
            </CategoryCard>
          </Reveal>

          <Reveal delay={160}>
            <CategoryCard title="More Treats">
              <Subcategory title={bananaLoaf.title} price={bananaLoaf.price} />
              <Label>Add-ins</Label>
              <FlavorBlock lines={bananaLoaf.addIns} />

              <Subcategory title={pies.title} price={pies.price} note={pies.note} />
              <FlavorBlock lines={pies.options} />

              <Subcategory title={jellos.title} price={jellos.price} />
              <ZoomableImage
                src="/gelatinas.png"
                alt="Jellos / Gelatinas by Suly's Sweets"
                className={thumbClass}
              />
              <FlavorBlock lines={jellos.options} />

              <Subcategory title={bananaPudding.title} />
              <PriceList rows={bananaPudding.prices} />

              <Subcategory title={tiramisu.title} />
              <InlinePrice>{tiramisu.priceLine}</InlinePrice>
            </CategoryCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
