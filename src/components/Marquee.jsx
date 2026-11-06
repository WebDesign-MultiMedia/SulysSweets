import { useLanguage } from "../i18n/LanguageContext";

// Slow, endless ribbon of what the bakery makes. The list is rendered twice
// so the -50% translate loops seamlessly.
export default function Marquee() {
  const { t } = useLanguage();
  const items = t.orderForm.orderTypes.slice(0, -1); // drop "Other / Not sure yet"

  return (
    <div className="relative overflow-hidden border-y border-plum/10 bg-plum py-4 text-cream" aria-hidden="true">
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-8 pr-8 font-display text-lg italic whitespace-nowrap sm:text-xl">
                {item}
                <span className="text-mauve not-italic">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
