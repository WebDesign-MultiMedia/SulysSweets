import { useMemo } from "react";
import { Snowflake } from "lucide-react";
import useMatchMedia from "../../hooks/useMatchMedia";

const FLAKE_COUNT = 28;
const FLAKE_COUNT_MOBILE = 55;
const MOBILE_QUERY = "(max-width: 1023px)";

function randomFlakes(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 6 + Math.random() * 14,
    duration: 10 + Math.random() * 14,
    delay: -Math.random() * 20,
    drift: (Math.random() - 0.5) * 120,
    opacity: 0.25 + Math.random() * 0.55,
    icon: Math.random() > 0.82,
  }));
}

export default function Snowfall() {
  const isMobile = useMatchMedia(MOBILE_QUERY);
  const count = isMobile ? FLAKE_COUNT_MOBILE : FLAKE_COUNT;
  const flakes = useMemo(() => randomFlakes(count), [count]);

  return (
    <div className="no-print pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-0"
          style={{
            left: `${flake.left}%`,
            opacity: flake.opacity,
            "--drift": `${flake.drift}px`,
            animation: `holiday-snowfall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          {flake.icon ? (
            <Snowflake
              className="text-white drop-shadow-[0_1px_2px_rgba(78,61,66,0.25)]"
              style={{ width: flake.size, height: flake.size }}
            />
          ) : (
            <div
              className="rounded-full bg-white shadow-[0_1px_2px_rgba(78,61,66,0.2)]"
              style={{ width: flake.size * 0.4, height: flake.size * 0.4 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
