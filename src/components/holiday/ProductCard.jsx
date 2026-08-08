import { useState } from "react";
import { Minus, Plus, Snowflake } from "lucide-react";
import { computeUnitPrice, defaultSelections, formatUSD, getDisplayImage } from "../../data/holidayMenu";
import { useHolidayCart } from "../../context/HolidayCartContext";
import ZoomableImage from "../ZoomableImage";

export default function ProductCard({ product, showImages = true }) {
  const { addItem } = useHolidayCart();
  const [selections, setSelections] = useState(() => defaultSelections(product));
  const [quantity, setQuantity] = useState(1);

  const unitPrice = computeUnitPrice(product, selections);
  const displayImage = getDisplayImage(product, selections);
  const hasImageSlot =
    showImages &&
    (Boolean(product.image) || product.variantGroups.some((g) => g.options.some((o) => "image" in o)));

  const handleSelect = (groupId, optionId) => {
    setSelections((prev) => ({ ...prev, [groupId]: optionId }));
  };

  const handleAdd = () => {
    addItem(product, selections, quantity);
    setQuantity(1);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-forest bg-cashmere shadow-[5px_5px_0_0_#8f1f2b] transition-all duration-150 ease-out hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_#8f1f2b]">
      {/* Flat holiday badge — no gradient, no blur, just a solid mark. */}
      <div className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-holly">
        <Snowflake className="h-4 w-4 text-cashmere" strokeWidth={2} />
      </div>

      {hasImageSlot && (
        <div className="aspect-[4/3] w-full overflow-hidden border-b-2 border-forest bg-white/40">
          {displayImage && (
            <ZoomableImage
              src={displayImage}
              alt={product.name}
              className="h-full w-full scale-165 object-contain"
            />
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-xl text-forest">{product.name}</h3>
          {product.description && <p className="mt-0.5 text-sm text-espresso/80">{product.description}</p>}
          <div className="mt-2 h-1 w-10 rounded-full bg-holly" />
        </div>

        {product.variantGroups.map((group) => (
          <div key={group.id}>
            <p className="mb-1.5 text-xs font-semibold tracking-wide text-forest uppercase">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const active = selections[group.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(group.id, option.id)}
                    className={`rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-holly bg-holly text-cashmere"
                        : "border-forest/20 bg-white text-espresso hover:border-forest/50"
                    }`}
                  >
                    {option.label}
                    {group.type === "size" && ` — ${formatUSD(option.price)}`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2">
          <span className="font-display text-lg text-forest">{formatUSD(unitPrice)}</span>

          <div className="flex items-center gap-2 rounded-full border-2 border-forest/20 bg-white px-1.5 py-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-espresso transition-colors hover:bg-forest/10"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-4 text-center text-sm text-espresso">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-espresso transition-colors hover:bg-forest/10"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-1 w-full rounded-full border-2 border-forest bg-forest px-6 py-2.5 text-sm font-medium tracking-wide text-cashmere uppercase transition-colors duration-150 hover:bg-holly hover:border-holly active:bg-forest"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
