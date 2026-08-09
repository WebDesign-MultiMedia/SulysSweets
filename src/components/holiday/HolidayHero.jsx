import { motion } from "framer-motion";
import { HOLIDAY_BANNER } from "../../data/holidayMenu";

export default function HolidayHero() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-12 pb-10 sm:px-8 sm:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold tracking-[0.35em] text-gold-light uppercase">
            Demo — no real payments
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-cashmere sm:text-6xl">
            Christmas<span className="text-gold-light">/</span>New Years
            <br />
            <span className="font-holiday-script text-6xl text-gold-light sm:-7xl">Menu</span>
          </h1>

          <ul className="mt-6 flex flex-col gap-1.5 text-lg text-gold-light">
            {HOLIDAY_BANNER.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-full bg-gold px-7 py-3 text-sm font-semibold tracking-wide text-forest uppercase transition-transform hover:-translate-y-0.5"
            >
              Shop the Menu
            </a>
            <a
              href="tel:3478595181"
              className="rounded-full border border-cashmere/30 px-7 py-3 text-sm text-cashmere transition-colors hover:border-gold-light hover:text-gold-light"
            >
              Order Now: 347-859-5181
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-sm"
        >
          <div className="absolute inset-6 rounded-full bg-gold/10 blur-2xl" />
          <img
            src="logo.png"
            alt="Holiday cake by Suly's Sweets"
            className="relative h-full w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
