import Reveal from "./Reveal";

export default function Hero({ onNavigate }) {
  return (
    <section id="home" className="relative overflow-hidden px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <Reveal as="p" className="text-xs font-medium tracking-[0.35em] text-mauve-dark uppercase">
            Handmade in Pelham Bay, Bronx
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] text-plum">
              Cakes made for
              <br />
              <span className="italic">your celebration</span>
            </h1>
          </Reveal>

          <Reveal
            delay={240}
            as="p"
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-plum/75 lg:mx-0"
          >
            Every order is baked, filled, and decorated by hand — small batches,
            real ingredients, and a design made just for you.
          </Reveal>

          <Reveal delay={360}>
            <a
              href="#menu"
              onClick={(e) => onNavigate("menu", e)}
              className="mt-9 inline-flex items-center justify-center rounded-full bg-plum px-9 py-3.5 text-sm tracking-wide text-cream uppercase transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              View the Menu
            </a>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
          <div className="absolute inset-0 rounded-full border border-mauve/40" />
          <div className="absolute inset-6 rounded-full border border-mauve/25" />
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-cream to-[#e9dcd3] shadow-[0_2px_4px_rgba(61,43,57,0.1),0_15px_25px_-5px_rgba(61,43,57,0.25),0_35px_45px_-15px_rgba(61,43,57,0.3),inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-6px_10px_rgba(61,43,57,0.08)] sm:h-52 sm:w-52">
            <img
              src="/logo.png"
              alt="Suly's Sweets logo"
              width={122}
              height={122}
              className="h-auto w-full rounded-full ring-2 ring-white/50 shadow-[0_3px_10px_rgba(61,43,57,0.3),inset_0_2px_3px_rgba(255,255,255,0.5)] sm:h-auto sm:w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
