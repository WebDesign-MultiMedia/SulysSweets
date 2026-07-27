export function CategoryCard({ title, inlinePrice, children }) {
  return (
    <div className="rounded-2xl bg-cream p-7 shadow-sm shadow-plum/5">
      <h3 className="flex flex-wrap items-baseline gap-2 font-display text-2xl text-plum">
        {title}
        {inlinePrice && <PriceTag>{inlinePrice}</PriceTag>}
      </h3>
      <div className="my-3 h-px w-full bg-mauve/25" />
      <div className="space-y-3 text-sm text-plum/85">{children}</div>
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
    <ul className="list-none space-y-1 p-0">
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
