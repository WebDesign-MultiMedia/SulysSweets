import { useState } from "react";
import { Minus, Plus } from "lucide-react";
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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-cashmere shadow-[0_1px_1px_rgba(78,61,66,0.06),0_8px_14px_-8px_rgba(78,61,66,0.15)] transition-shadow duration-200 hover:shadow-[0_10px_20px_-8px_rgba(78,61,66,0.25)]">
      {hasImageSlot && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-white/40">
          {displayImage && (
            <ZoomableImage
              src={displayImage}
              alt={product.name}
              className="h-full w-full scale-125 object-contain"
            />
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-xl text-espresso">{product.name}</h3>
          {product.description && <p className="mt-0.5 text-sm text-espresso/80">{product.description}</p>}
          <div className="mt-2 h-px w-10 bg-gold/50" />
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
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-forest bg-forest text-cashmere"
                        : "border-espresso/20 bg-white/60 text-espresso hover:border-forest/50"
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
          <span className="font-display text-lg text-espresso">{formatUSD(unitPrice)}</span>

          <div className="flex items-center gap-2 rounded-full border border-espresso/20 bg-white/60 px-1.5 py-1">
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
          className="mt-1 w-full rounded-full bg-forest px-6 py-2.5 text-sm font-medium tracking-wide text-cashmere uppercase transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
