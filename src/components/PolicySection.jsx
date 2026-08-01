import { policyNotes, startingPriceNotice } from "@/data/menu";

export default function PolicySection() {
  return (
    <section id="policies" className="bg-blush px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium tracking-[0.35em] text-sage-dark uppercase">Good to Know</p>
        <h2 className="mt-4 font-heading text-4xl text-plum sm:text-5xl">Ordering &amp; Policies</h2>

        <div className="mt-8 rounded-3xl border border-plum/10 bg-cream/50 px-6 py-8 shadow-[0_8px_32px_rgba(78,61,66,0.12)] backdrop-blur-xl sm:px-10">
          <ul className="space-y-2 text-base text-plum/85">
            {policyNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-sage/15 px-5 py-4">
            {startingPriceNotice.map((line) => (
              <p key={line} className="text-sm font-semibold tracking-wide text-plum">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
