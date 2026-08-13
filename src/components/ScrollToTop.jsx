import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Runs on every route change (every click, no limit) so each new page
// always starts scrolled to the top instead of keeping the previous
// page's scroll position. "instant" avoids the global smooth-scroll CSS
// turning this into a visible animated scroll.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
