import ProductShot from "./ProductShot";

export function CategoryCard({ title, inlinePrice, image, children }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-cream/90 ring-1 ring-plum/8 shadow-[0_1px_2px_rgba(61,43,57,0.06),0_20px_40px_-24px_rgba(61,43,57,0.35)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_2px_4px_rgba(61,43,57,0.08),0_32px_50px_-24px_rgba(61,43,57,0.45)]">
      {image && (
        <ProductShot
          src={image.src}
          alt={image.alt}
          className="h-52 rounded-none ring-0 hover:shadow-none sm:h-56"
          imgClassName="p-4"
        />
      )}
      <div className="flex flex-1 flex-col p-7">
        <h3 className="flex flex-wrap items-baseline justify-between gap-2 font-display text-2xl text-plum">
          {title}
          {inlinePrice && <PriceTag>{inlinePrice}</PriceTag>}
        </h3>
        <div className="my-4 h-px w-12 bg-mauve-dark/50 transition-all duration-500 group-hover:w-full group-hover:bg-mauve/40" />
        <div className="flow-root space-y-3 text-sm text-plum/85">{children}</div>
      </div>
    </article>
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
  return <span className="rounded-full bg-mauve/15 px-2.5 py-0.5 font-body text-xs font-semibold tracking-wide text-mauve-dark">{children}</span>;
}

export function PriceList({ rows }) {
  return (
    <ul className="list-none space-y-1 p-0 relative z-20">
      {rows.map((row) => (
        <li key={row.label} className="flex items-baseline gap-2">
          <span>{row.label}</span>
          <span className="flex-1 border-b border-dotted border-plum/20" aria-hidden="true" />
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
