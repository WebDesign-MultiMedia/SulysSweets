export function CategoryCard({ title, inlinePrice, children }) {
  return (
    <div className="[perspective:1200px]">
      <div
        className="group relative rounded-3xl bg-gradient-to-br from-cream to-[#ecdfd8] p-7 ring-1 ring-plum/5 transition-all duration-300 ease-out
        shadow-[0_1px_1px_rgba(61,43,57,0.08),0_10px_18px_-8px_rgba(61,43,57,0.18),0_24px_40px_-18px_rgba(61,43,57,0.28),inset_0_1px_0_rgba(255,255,255,0.7)]
        hover:ring-mauve/40 hover:[transform:translateY(-10px)_rotateX(4deg)_rotateY(-4deg)]
        hover:shadow-[0_2px_3px_rgba(61,43,57,0.1),0_20px_28px_-8px_rgba(61,43,57,0.25),0_40px_55px_-20px_rgba(61,43,57,0.35),inset_0_1px_0_rgba(255,255,255,0.8)]"
      >
        <div className="absolute inset-x-7 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-mauve-dark to-transparent transition-transform duration-300 group-hover:scale-x-100" />
        <h3 className="flex flex-wrap items-baseline gap-2 font-display text-2xl text-plum">
          {title}
          {inlinePrice && <PriceTag>{inlinePrice}</PriceTag>}
        </h3>
        <div className="my-3 h-px w-full bg-mauve/25" />
        <div className="flow-root space-y-3 text-sm text-plum/85">{children}</div>
      </div>
    </div>
  );
}

export function Subcategory({ title, price, note }) {
  return (
    <h4 className="mt-5 mb-1 flex flex-wrap items-baseline gap-2 font-display text-lg text-plum">
      {title}
      {price && <PriceTag>{price}</PriceTag>}
      {note && <span className="text-xs text-plum/60 italic">{note}</span>}
    </h4>
  );
}

export function PriceTag({ children }) {
  return <span className="text-sm font-semibold text-mauve-dark">{children}</span>;
}

export function PriceList({ rows }) {
  return (
    <ul className="list-none space-y-1 p-0 relative z-20">
      {rows.map((row) => (
        <li key={row.label} className="flex justify-between gap-4">
          <span>{row.label}</span>
          <span className="font-semibold text-plum">{row.price}</span>
        </li>
      ))}
    </ul>
  );
}

export function Label({ children }) {
  return <p className="text-xs font-medium tracking-wide text-mauve-dark uppercase">{children}</p>;
}

export function FlavorBlock({ lines }) {
  return (
    <p className="text-plum/80">
      {lines.map((line, i) => (
        <span key={line}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

export function FlavorInline({ children }) {
  return <p className="text-plum/80">{children}</p>;
}

export function InlinePrice({ children }) {
  return <p className="font-display text-lg text-plum">{children}</p>;
}

export function Note({ children }) {
  return <p className="text-xs text-plum/60 italic">{children}</p>;
}
