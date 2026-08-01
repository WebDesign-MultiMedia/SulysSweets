import { useLanguage } from "../i18n/LanguageContext";

export default function LanguageToggle({ className = "" }) {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label="Switch language / Cambiar idioma"
      className={`inline-flex items-center rounded-full bg-plum/5 p-0.5 text-xs font-semibold tracking-wide ring-1 ring-plum/15 ${className}`}
    >
      <span
        className={`rounded-full px-2.5 py-1 transition-colors duration-200 ${
          lang === "en" ? "bg-plum text-cream" : "text-plum/60"
        }`}
      >
        EN
      </span>
      <span
        className={`rounded-full px-2.5 py-1 transition-colors duration-200 ${
          lang === "es" ? "bg-plum text-cream" : "text-plum/60"
        }`}
      >
        ES
      </span>
    </button>
  );
}
