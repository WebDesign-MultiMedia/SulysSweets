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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(30,58,43,0.06),0_10px_24px_-16px_rgba(30,58,43,0.25)] transition-shadow duration-200 hover:shadow-[0_1px_2px_rgba(30,58,43,0.08),0_18px_32px_-16px_rgba(30,58,43,0.35)]">
      {hasImageSlot && (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-50">
          {displayImage && (
            <ZoomableImage
              src={displayImage}
              alt={product.name}
              className="h-full w-full scale-165 object-contain"
            />
          )}
          <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            <Snowflake className="h-4 w-4 text-holly" strokeWidth={2} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold text-espresso">{product.name}</h3>
          {product.description && <p className="mt-0.5 text-xs text-espresso/55">{product.description}</p>}
        </div>

        {product.variantGroups.map((group) => (
          <div key={group.id}>
            <p className="mb-1.5 text-[11px] font-medium tracking-wide text-espresso/50 uppercase">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.options.map((option) => {
                const active = selections[group.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(group.id, option.id)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-forest bg-forest text-white"
                        : "border-black/10 bg-white text-espresso/70 hover:border-forest/40"
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

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-base font-bold text-espresso">{formatUSD(unitPrice)}</span>

          <div className="flex items-center gap-1 rounded-lg border border-black/10 bg-white px-1 py-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-md text-espresso/70 transition-colors hover:bg-black/5"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-4 text-center text-sm text-espresso">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-espresso/70 transition-colors hover:bg-black/5"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="w-full rounded-lg bg-forest py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-forest-light"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
