import { useEffect, useRef, useState } from "react";

// Christmas palette (see src/index.css @theme): forest #1e3a2b (background),
// a brighter green (mesh lines/dots) for visible contrast against it.
const TOPOLOGY_OPTIONS = {
  color: 0x4f9e6c, // bright green mesh
  backgroundColor: 0x1e3a2b, // forest
};

const MOBILE_QUERY = "(max-width: 1023px)";

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

// Skip Vanta on devices unlikely to handle a CPU-bound p5.js canvas smoothly:
// few cores, low RAM, or the user has opted into data saver. `deviceMemory`
// isn't exposed by every browser (notably Safari) — treat "unknown" as fine
// rather than penalizing it.
function isCapableDevice() {
  if (typeof navigator === "undefined") return true;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = navigator.deviceMemory;
  const saveData = navigator.connection?.saveData ?? false;
  if (saveData) return false;
  if (cores < 4) return false;
  if (typeof memory === "number" && memory < 4) return false;
  return true;
}

// Defer heavy work until the browser is idle (falls back to a timeout on
// Safari, which has no requestIdleCallback) so it lands after Time to
// Interactive instead of competing with initial page load.
function whenIdle(callback, timeout = 2000) {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, timeout);
  return () => window.clearTimeout(id);
}

function CssBackdrop() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-forest" aria-hidden="true">
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
  const [capable] = useState(isCapableDevice);
  const isMobile = useMatchMedia(MOBILE_QUERY);
  const [vantaReady, setVantaReady] = useState(false);
  const useVanta = capable && !reducedMotion;

  // The forest backdrop is painted by fixed-position layers, not the real
  // document background. On iOS Safari, rubber-band overscroll can reveal
  // whatever is *behind* fixed elements for a frame — without this, that's
  // the site-wide ivory `body` background, which flashes in as "white".
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    const prevOverscroll = html.style.overscrollBehaviorY;
    html.style.backgroundColor = "#1e3a2b";
    body.style.backgroundColor = "#1e3a2b";
    html.style.overscrollBehaviorY = "none";
    return () => {
      html.style.backgroundColor = prevHtmlBg;
      body.style.backgroundColor = prevBodyBg;
      html.style.overscrollBehaviorY = prevOverscroll;
    };
  }, []);

  useEffect(() => {
    if (!useVanta || !ref.current) return;

    let cancelled = false;
    let cancelIdle = () => {};

    const start = () => {
      cancelIdle = whenIdle(() => {
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
              // Lower internal render resolution on phones — same effect,
              // cheaper per-frame cost on weaker GPUs.
              scaleMobile: 0.65,
              ...TOPOLOGY_OPTIONS,
            });
            setVantaReady(true);
          },
        );
      });
    };

    // Wait for the page to finish loading, then wait for idle — pushes the
    // CPU-heavy init past Time to Interactive instead of blocking it.
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      cancelled = true;
      cancelIdle();
      window.removeEventListener("load", start);
      effectRef.current?.destroy();
      effectRef.current = null;
      setVantaReady(false);
    };
  }, [useVanta, isMobile]);

  if (!useVanta) return <CssBackdrop />;

  return (
    <>
      <CssBackdrop />
      <div
        ref={ref}
        aria-hidden="true"
        className={`fixed inset-0 -z-10 transition-opacity duration-700 ${
          vantaReady ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
