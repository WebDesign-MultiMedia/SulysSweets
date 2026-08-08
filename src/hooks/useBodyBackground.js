import { useEffect } from "react";

// Keeps the real <html>/<body> background in sync with a page's theme
// color. Without this, iOS Safari's rubber-band overscroll can reveal the
// site-wide `body` background (ivory) for a frame past the page's edges.
export default function useBodyBackground(color) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    const prevOverscroll = html.style.overscrollBehaviorY;
    html.style.backgroundColor = color;
    body.style.backgroundColor = color;
    html.style.overscrollBehaviorY = "none";
    return () => {
      html.style.backgroundColor = prevHtmlBg;
      body.style.backgroundColor = prevBodyBg;
      html.style.overscrollBehaviorY = prevOverscroll;
    };
  }, [color]);
}
