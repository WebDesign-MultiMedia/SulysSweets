import { useEffect, useRef, useState } from "react";

/**
 * Fades + gently rises content into view once it enters the viewport.
 * Respects prefers-reduced-motion by showing content immediately.
 */
export default function Reveal({ children, className = "", delay = 0, as = "div", immediate = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el || immediate) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  // Above the fold: animate with CSS on first paint (see .animate-rise).
  if (immediate) {
    return (
      <Tag style={{ animationDelay: `${delay}ms` }} className={`animate-rise ${className}`}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
