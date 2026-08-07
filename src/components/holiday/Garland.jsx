const BULB_COLORS = ["#8f1f2b", "#cda449", "#f3e6d8", "#e6c878", "#8f1f2b", "#cda449", "#f3e6d8"];

export default function Garland() {
  const bulbs = Array.from({ length: 13 }, (_, i) => BULB_COLORS[i % BULB_COLORS.length]);

  return (
    <div className="relative mx-auto my-8 max-w-md" aria-hidden="true">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute inset-x-0 -top-1.5 flex justify-between px-2">
        {bulbs.map((color, i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 6px 1px ${color}99`,
              animation: `holiday-twinkle ${2 + (i % 3) * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
