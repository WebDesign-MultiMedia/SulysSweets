import { useEffect, useRef, useState } from "react";
import useBodyBackground from "../../hooks/useBodyBackground";

// Christmas palette (see src/index.css @theme): forest #1e3a2b backdrop
// with a soft, low-contrast mesh — Topology has no line-density option, so
// a dimmer color plus a larger `scale` (spreads the pattern out, fewer
// strands visible at once) is how it's toned down instead of removed.
const TOPOLOGY_OPTIONS = {
  color: 0x9fb8ac,
  backgroundColor: 0x1e3a2b,
};

const BACKDROP_COLOR = "#1e3a2b";

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

  // The canvas is painted via fixed-position layers, not the real document
  // background. Keep <html>/<body> in sync so iOS Safari's rubber-band
  // overscroll doesn't flash the site-wide ivory background for a frame.
  useBodyBackground(BACKDROP_COLOR);

  useEffect(() => {
    if (!useVanta || !ref.current) return;

    let cancelled = false;
    let cancelIdle = () => {};

    const start = () => {
      cancelIdle = whenIdle(() => {
        Promise.all([import("p5"), import("vanta/dist/vanta.topology.min")]).then(
          ([{ default: p5 }, { default: TOPOLOGY }]) => {
            if (cancelled || !ref.current) return;
            // Silences p5's friendly-error-system console noise (harmless
            // global-name-collision warnings unrelated to this app).
            p5.disableFriendlyErrors = true;
            effectRef.current = TOPOLOGY({
              el: ref.current,
              p5,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.8,
              scaleMobile: 1.8,
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

  // No negative z-index here: these are `position: fixed`, so in the root
  // stacking context a negative z-index paints *behind the document body's
  // own background* (not just behind normal content) — which silently hid
  // this canvas entirely once the body got an opaque background color (see
  // useBodyBackground above). Being first in the DOM is enough to keep it
  // behind every later sibling without needing z-index at all.
  return (
    <>
      <div className="fixed inset-0 bg-forest" aria-hidden="true" />
      {useVanta && (
        <div
          ref={ref}
          aria-hidden="true"
          className={`fixed inset-0 transition-opacity duration-700 ${
            vantaReady ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}
