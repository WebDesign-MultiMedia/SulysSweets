import Reveal from "./Reveal";
import { InstagramIcon } from "./icons";

export default function InstagramSection() {
  return (
    <section className="relative overflow-hidden bg-plum px-5 py-16 text-cream sm:px-8">
      <InstagramIcon className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 text-cream/5 sm:h-72 sm:w-72" />

      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <>
          <InstagramIcon className="h-8 w-8 text-mauve" />
          <p className="text-xs font-medium tracking-[0.35em] text-mauve uppercase">Follow Along</p>
          <h2 className="font-display text-3xl sm:text-4xl">See our latest cakes on Instagram</h2>
          <p className="max-w-md text-sm leading-relaxed text-cream/75">
            New designs, behind-the-scenes baking, and daily inspiration — all on our feed.
          </p>
          <a
            href="https://www.instagram.com/sulys_sweets"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-cream px-8 py-3.5 text-sm tracking-wide text-plum uppercase transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <InstagramIcon className="h-4 w-4" />
            @sulys_sweets
          </a>
        </>
      </Reveal>
    </section>
  );
}
