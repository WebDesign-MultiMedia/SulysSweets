import { useEffect, useState } from "react";

let cached = null;

// "live" when the server has Stripe configured, otherwise "demo" (including
// when there's no backend at all, e.g. the plain Vite dev server).
// Returns null while loading so nothing flashes.
export default function useCheckoutMode() {
  const [mode, setMode] = useState(cached);

  useEffect(() => {
    if (cached) return;
    let cancelled = false;
    fetch("/api/status")
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((data) => {
        cached = data?.checkout === "live" ? "live" : "demo";
        if (!cancelled) setMode(cached);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return mode;
}
