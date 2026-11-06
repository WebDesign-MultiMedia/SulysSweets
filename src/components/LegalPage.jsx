import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../i18n/LanguageContext";

// Shared layout for /privacy and /terms. Content lives in
// translations.js under legal.<doc> so both languages stay in sync.
export default function LegalPage({ doc }) {
  const { t } = useLanguage();
  const page = t.legal[doc];

  return (
    <div className="min-h-screen bg-ivory text-plum">
      <header className="sticky top-0 z-40 border-b border-plum/10 bg-ivory/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-plum/80 transition-colors hover:text-mauve-dark">
            <ArrowLeft className="h-4 w-4" />
            {t.legal.backHome}
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <article className="rounded-3xl bg-white/70 p-6 shadow-[0_10px_30px_-12px_rgba(61,43,57,0.25)] ring-1 ring-plum/10 sm:p-10">
          <h1 className="font-display text-3xl sm:text-4xl">{page.title}</h1>
          <p className="mt-2 text-xs text-plum/60">{t.legal.effective}</p>
          <p className="mt-6 text-sm leading-relaxed text-plum/85">{page.intro}</p>

          {page.sections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="font-display text-xl">{section.heading}</h2>
              {section.paragraphs?.map((p) => (
                <p key={p} className="mt-3 text-sm leading-relaxed text-plum/85">
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-plum/85">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}
