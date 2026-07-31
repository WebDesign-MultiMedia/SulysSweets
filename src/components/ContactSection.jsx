import Reveal from "./Reveal";

const orderInfo = [
  "50% non-refundable deposit required",
  "Payment: Zelle or Cash",
  "Pick-up: Pelham Bay, Bronx",
  "Delivery available (fee varies)",
];

export default function ContactSection() {
  return (
    <section id="contact" className="bg-cream px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal as="p" className="text-xs font-medium tracking-[0.35em] text-mauve-dark uppercase">
          Get in Touch
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-4 font-display text-4xl text-plum sm:text-5xl">Let&apos;s Plan Your Order</h2>
        </Reveal>
        <Reveal delay={200} as="p" className="mx-auto mt-5 max-w-md text-base leading-relaxed text-plum/75">
          Reach out to talk flavors, design, and pick-up details for your next
          celebration.
        </Reveal>

        <Reveal delay={300}>
          <a
            href="mailto:hello@sulyssweets.com"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-plum px-9 py-3.5 text-sm tracking-wide text-cream uppercase transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Email Us
          </a>
        </Reveal>

        <Reveal
          delay={400}
          className="mx-auto mt-12 max-w-md rounded-3xl border border-mauve/30 bg-gradient-to-br from-ivory to-[#ecdcc0] px-6 py-6 shadow-[0_1px_1px_rgba(61,43,57,0.08),0_10px_18px_-8px_rgba(61,43,57,0.18),0_20px_32px_-16px_rgba(61,43,57,0.25),inset_0_1px_0_rgba(255,255,255,0.7)]"
        >
          <>
            <p className="text-xs font-medium tracking-[0.3em] text-mauve-dark uppercase">Order Info</p>
            <ul className="mt-4 grid gap-2 text-sm text-plum/80 sm:grid-cols-2">
              {orderInfo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        </Reveal>
      </div>
    </section>
  );
}
