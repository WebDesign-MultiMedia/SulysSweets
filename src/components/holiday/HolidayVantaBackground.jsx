import { useEffect, useRef, useState } from "react";

// Christmas palette (see src/index.css @theme): forest #1e3a2b (background),
// a brighter green (mesh lines/dots) for visible contrast against it.
const TOPOLOGY_OPTIONS = {
  color: 0x4f9e6c, // bright green mesh
  backgroundColor: 0x1e3a2b, // forest
};

// Vanta Topology renders via p5.js on Canvas2D — CPU-bound, and expensive
// on phone-class hardware (this alone was ~7s of Total Blocking Time on a
// Lighthouse mobile run). Desktop/tablet CPUs handle it fine, so it only
// runs there; phones get a near-zero-cost CSS blob animation instead.
const DESKTOP_QUERY = "(min-width: 1024px)";

function useMatchMedia(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

function CssBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-forest" aria-hidden="true">
      <div className="absolute -top-1/4 -left-1/4 h-[70vmax] w-[70vmax] rounded-full bg-forest-light/50 blur-3xl motion-safe:[animation:holiday-drift-a_22s_ease-in-out_infinite]" />
      <div className="absolute -right-1/4 -bottom-1/4 h-[65vmax] w-[65vmax] rounded-full bg-gold/10 blur-3xl motion-safe:[animation:holiday-drift-b_26s_ease-in-out_infinite]" />
      <div className="absolute top-1/3 right-1/4 h-[50vmax] w-[50vmax] rounded-full bg-forest-light/30 blur-3xl motion-safe:[animation:holiday-drift-c_30s_ease-in-out_infinite]" />
    </div>
  );
}

export default function HolidayVantaBackground() {
  const ref = useRef(null);
  const effectRef = useRef(null);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const isDesktop = useMatchMedia(DESKTOP_QUERY);
  const useVanta = isDesktop && !reducedMotion;

  useEffect(() => {
    if (!useVanta || !ref.current) return;

    let cancelled = false;

    Promise.all([import("p5"), import("vanta/dist/vanta.topology.min")]).then(
      ([{ default: p5 }, { default: TOPOLOGY }]) => {
        if (cancelled || !ref.current) return;
        effectRef.current = TOPOLOGY({
          el: ref.current,
          p5,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          ...TOPOLOGY_OPTIONS,
        });
      },
    );

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, [useVanta]);

  if (!useVanta) return <CssBackdrop />;

  return <div ref={ref} aria-hidden="true" className="fixed inset-0 -z-10" />;
}
