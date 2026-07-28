import { useEffect, useState } from "react";

const slides = [
  { src: "/cake-two.jpg", alt: "Custom floral birthday cake by Suly's Sweets" },
  { src: "/cake-three.png", alt: "Custom Toy Story themed cake by Suly's Sweets" },
];

export default function CakeSlideshow({ className }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`relative ${className ?? ""}`}>
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full rounded-md object-contain transition-opacity duration-[1500ms] ease-in-out ${
            i === index ? "opacity-60" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
