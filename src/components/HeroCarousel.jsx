"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  { src: "/cake-one.png", alt: "Custom cake by Suly's Sweets" },
  { src: "/cake-two.jpg", alt: "Custom cake by Suly's Sweets" },
  { src: "/cake-three.png", alt: "Custom cake by Suly's Sweets" },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-[1.75rem] border border-plum/10 bg-cream/60 shadow-[0_12px_32px_rgba(78,61,66,0.18)] backdrop-blur-md lg:mx-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            sizes="(max-width: 640px) 55vw, 220px"
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
        {slides.map((slide, i) => (
          <span
            key={slide.src}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-cream" : "w-1.5 bg-cream/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
