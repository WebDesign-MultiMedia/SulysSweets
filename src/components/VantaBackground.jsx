import { useEffect, useRef, useState } from "react";

// Bakery palette (see src/index.css @theme):
// blush #f8ece9, ivory #f7e8d0, mauve #b98c8c, mauve-dark #9c6c6c, bronze #a98859, terracotta #c2703d
const FOG_OPTIONS = {
  highlightColor: 0xf8ece9, // blush
  midtoneColor: 0xc2703d, // terracotta — reads clearly against the light base
  lowlightColor: 0x9c6c6c, // mauve-dark — deeper shadow for visible depth
  baseColor: 0xf7e8d0, // ivory
  blurFactor: 0.45,
  speed: 1.3,
  zoom: 0.9,
};

export default function VantaBackground() {
  const ref = useRef(null);
  const effectRef = useRef(null);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    let cancelled = false;

    Promise.all([import("three"), import("vanta/dist/vanta.fog.min")]).then(([THREE, { default: FOG }]) => {
      if (cancelled || !ref.current) return;
      effectRef.current = FOG({
        el: ref.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        ...FOG_OPTIONS,
      });
    });

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{ background: reducedMotion ? "var(--color-ivory)" : undefined }}
    />
  );
}
