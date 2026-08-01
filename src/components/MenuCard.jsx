function PriceRow({ label, price }) {
  return (
    <li className="flex items-baseline justify-between gap-4">
      <span>{label}</span>
      <span className="font-semibold text-plum">{price}</span>
    </li>
  );
}

function Label({ children }) {
  return <p className="text-xs font-medium tracking-wide text-sage-dark uppercase">{children}</p>;
}

export default function MenuCard({ item }) {
  const { title, startingPrices, prices, price, priceLine, options, addIns, flavors, note } = item;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-plum/10 bg-cream/50 p-6 shadow-[0_8px_32px_rgba(78,61,66,0.1)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
      <h3 className="flex flex-wrap items-baseline gap-2 font-heading text-2xl text-plum">
        {title}
        {price && <span className="text-base font-semibold text-sage-dark">{price}</span>}
      </h3>
      <div className="my-3 h-px w-full bg-plum/10" />

      <div className="flex flex-1 flex-col gap-3 text-sm text-plum/85">
        {priceLine && <p className="font-heading text-lg text-plum">{priceLine}</p>}

        {startingPrices && (
          <>
            <Label>Starting Prices</Label>
            <ul className="list-none space-y-1 p-0">
              {startingPrices.map((row) => (
                <PriceRow key={row.label} {...row} />
              ))}
            </ul>
          </>
        )}

        {prices && (
          <ul className="list-none space-y-1 p-0">
            {prices.map((row) => (
              <PriceRow key={row.label} {...row} />
            ))}
          </ul>
        )}

        {flavors && (
          <>
            <Label>Flavors</Label>
            <p className="text-plum/80">
              {flavors.map((f, i) => (
                <span key={f}>
                  {f}
                  {i < flavors.length - 1 && <br />}
                </span>
              ))}
            </p>
          </>
        )}

        {addIns && (
          <>
            <Label>Add-ins</Label>
            <p className="text-plum/80">{addIns.join(", ")}</p>
          </>
        )}

        {options && (
          <p className="text-plum/80">
            {options.map((o, i) => (
              <span key={o}>
                {o}
                {i < options.length - 1 && <br />}
              </span>
            ))}
          </p>
        )}

        {note && <p className="mt-auto text-xs text-plum/60 italic">{note}</p>}
      </div>
    </div>
  );
}
