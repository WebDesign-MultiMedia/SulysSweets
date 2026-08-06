import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const slides = [
  { src: "/SlideShow/whiteCake.png", alt: "White cake by Suly's Sweets" },
  { src: "/SlideShow/strawberriesCakes.png", alt: "Strawberry cake by Suly's Sweets" },
  { src: "/SlideShow/hannaMontanaCake.png", alt: "Hannah Montana themed cake by Suly's Sweets" },
  { src: "/SlideShow/churroCheesecake.png", alt: "Churro cheesecake by Suly's Sweets" },
  { src: "/SlideShow/cupcakes.png", alt: "Custom cupcakes by Suly's Sweets" },
  { src: "/SlideShow/cheesecakes.png", alt: "9 inch cheesecake by Suly's Sweets" },
  { src: "/SlideShow/chocolateCoveredStrawberries.png", alt: "Chocolate covered strawberries by Suly's Sweets" },
  { src: "/SlideShow/gelatinas.png", alt: "Jellos / Gelatinas by Suly's Sweets" },
  { src: "/SlideShow/cookies.png", alt: "Cookies by Suly's Sweets" },
  { src: "/SlideShow/flan.png", alt: "Flan by Suly's Sweets" },
  { src: "/SlideShow/ChocoFlan.png", alt: "Choco flan by Suly's Sweets" },
];

export default function AboutSlideshow({ className }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen]);

  return (
    <>
      <div className={`relative overflow-hidden  ${className ?? ""}`}>
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading="lazy"
            onClick={() => i === index && setLightboxOpen(true)}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-[1500ms] ease-in-out ${
              i === index ? "cursor-zoom-in opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
        ))}
      </div>

      {lightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-plum/90 p-6 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-plum shadow-lg transition-transform hover:scale-105"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div
              className="relative aspect-[9/16] h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {slides.map((slide, i) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  className={`absolute  inset-0 h-full w-full rounded-2xl object-contain shadow-2xl transition-opacity duration-[1500ms] ease-in-out ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
