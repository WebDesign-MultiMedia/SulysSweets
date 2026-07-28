import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="bg-cream px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute -inset-4 rounded-[2.5rem] border border-mauve/30" />
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[2rem] bg-ivory shadow-lg shadow-plum/10">
            <img src="/logo.png" alt="Suly's Sweets logo" width={122} height={122} className="h-24 w-24 rounded-full shadow-md" />
            <p className="font-display text-2xl text-plum italic">Suly&apos;s Sweets</p>
          </div>
        </Reveal>

        <div className="text-center lg:text-left">
          <Reveal as="p" className="text-xs font-medium tracking-[0.35em] text-mauve-dark uppercase">
            About Us
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-4 font-display text-4xl text-plum sm:text-5xl">
              A small bakery with a big heart
            </h2>
          </Reveal>
          <Reveal
            delay={240}
            as="p"
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-plum/75 lg:mx-0"
          >
            Suly&apos;s Sweets started as a passion for baking and grew into a
            home bakery serving birthdays, quinceañeras, and every occasion
            worth celebrating. Every cake, cupcake, and treat is made fresh,
            by hand, right in Pelham Bay, Bronx.
          </Reveal>
          <Reveal
            delay={320}
            as="p"
            className="mx-auto mt-4 max-w-md text-base leading-relaxed text-plum/75 lg:mx-0"
          >
            From classic flavors to fully custom designs, we work closely
            with you to bring your vision to the table.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
