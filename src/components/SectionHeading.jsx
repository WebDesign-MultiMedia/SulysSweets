import Reveal from "./Reveal";

// Eyebrow + serif title (+ optional intro) used by every home section.
export default function SectionHeading({ eyebrow, title, children, align = "center", light = false }) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "text-center lg:text-left"}>
      <Reveal
        as="p"
        className={`inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.4em] uppercase ${
          light ? "text-mauve" : "text-mauve-dark"
        }`}
      >
        <span className={`h-px w-8 ${light ? "bg-mauve/60" : "bg-mauve-dark/50"}`} aria-hidden="true" />
        {eyebrow}
        {centered && <span className={`h-px w-8 ${light ? "bg-mauve/60" : "bg-mauve-dark/50"}`} aria-hidden="true" />}
      </Reveal>
      <Reveal delay={100}>
        <h2
          className={`mt-5 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.1] ${
            light ? "text-cream" : "text-plum"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal
          delay={200}
          as="p"
          className={`mt-5 text-base leading-relaxed ${centered ? "mx-auto max-w-lg" : "mx-auto max-w-md lg:mx-0"} ${
            light ? "text-cream/75" : "text-plum/70"
          }`}
        >
          {children}
        </Reveal>
      )}
    </div>
  );
}
