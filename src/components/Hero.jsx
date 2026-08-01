import HeroCarousel from "./HeroCarousel";
import HeroSceneClient from "./three/HeroSceneClient";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <p className="text-xs font-medium tracking-[0.35em] text-sage-dark uppercase">
            Handmade in Pelham Bay, Bronx
          </p>

          <h1 className="mt-5 font-heading text-[clamp(3.2rem,7vw,6rem)] leading-[1.05] text-plum">
            Cakes made for
            <br />
            your celebration
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-plum/75 lg:mx-0">
            Every order is baked, filled, and decorated by hand — small batches,
            real ingredients, and a design made just for you.
          </p>

          <a
            href="#menu"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-plum px-9 py-3.5 text-sm tracking-wide text-cream uppercase transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            View the Menu
          </a>

          <div className="mt-10">
            <HeroCarousel />
          </div>
        </div>

        <div className="h-[420px] w-full sm:h-[520px] lg:h-[600px]">
          <HeroSceneClient />
        </div>
      </div>
    </section>
  );
}
