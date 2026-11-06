import { useEffect, useState } from "react";
import Lightbox from "./Lightbox";

// A transparent product cut-out on a soft tinted panel. Click to enlarge.
export default function ProductShot({ src, alt, caption, className = "", imgClassName = "", panel = "from-ivory to-blush" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt}
        className={`group relative block w-full cursor-zoom-in overflow-hidden bg-gradient-to-b ${panel} ring-1 ring-plum/5 transition-shadow duration-500 hover:shadow-[0_24px_40px_-20px_rgba(61,43,57,0.35)] ${className}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`cutout-shadow h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06] ${imgClassName}`}
        />
        {caption && (
          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-plum/70 to-transparent px-4 pt-8 pb-3 text-left font-display text-sm text-cream italic transition-transform duration-500 group-hover:translate-y-0">
            {caption}
          </span>
        )}
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
