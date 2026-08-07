// Verbatim content from the Suly's Sweets holiday flyer — do not reword.

export const HOLIDAY_PHONE = "347-859-5181";
export const HOLIDAY_INSTAGRAM = "@SULYS_SWEETS";

export const HOLIDAY_BANNER = {
  title: "Christmas/New Years Menu",
  notes: [
    "All includes Merry Christmas/New Years Cake Toppers",
    "50% Non-refundable deposit required to secure your order",
    "Zelle/Apple Pay (347-859-5181)",
    "Pick Up Location : Pelham Bay (Bronx)",
    "Delivery Available with a fee (Bronx, Harlem, Dyckman, Queens & Westchester county)",
    "Order Now: 347-859-5181",
    "@SULYS_SWEETS",
  ],
};

export const DELIVERY_AREAS = ["Bronx", "Harlem", "Dyckman", "Queens", "Westchester County"];

// Each product has either:
//  - a flat `basePrice`, with optional non-price variant groups (type: "single"), or
//  - a "size" variant group whose options each carry their own absolute price.
export const HOLIDAY_PRODUCTS = [
  {
    id: "cheesecake-9in",
    name: "9\" Cheesecake's",
    basePrice: 55.0,
    image: "/SlideShow/cheesecakes.png",
    variantGroups: [
      {
        id: "flavor",
        label: "Flavor",
        type: "single",
        required: true,
        options: [
          { id: "apple-crumble", label: "Apple Crumble", priceDelta: 0 },
          { id: "strawberry", label: "Strawberry", priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: "pina-colada-jello",
    name: "Piña Colada Jello",
    basePrice: 60.0,
    image: "/SlideShow/gelatinas.png",
    variantGroups: [],
  },
  {
    id: "churro-cheesecake-tray",
    name: "Churro Cheesecake Tray",
    description: "Includes whippcream & Strawberries",
    image: "/SlideShow/churroCheesecake.png",
    variantGroups: [
      {
        id: "size",
        label: "Size",
        type: "size",
        required: true,
        options: [
          { id: "13x9", label: "13x9", price: 60.0 },
          { id: "8x6", label: "8x6", price: 45.0 },
        ],
      },
      {
        id: "drizzle",
        label: "Drizzle",
        type: "single",
        required: true,
        options: [
          { id: "nutella", label: "Nutella", priceDelta: 0 },
          { id: "lechera", label: "Lechera", priceDelta: 0 },
          { id: "dulce-de-leche", label: "Dulce de Leche", priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: "banana-pudding",
    name: "Banana Pudding",
    image: "/SlideShow/cookies.png",
    variantGroups: [
      {
        id: "size",
        label: "Size",
        type: "size",
        required: true,
        options: [
          { id: "tray-13x9", label: "Tray 13x9", price: 65.0 },
          { id: "9in-pan", label: '9" Pan', price: 45.0 },
        ],
      },
    ],
  },
  {
    id: "tiramisu-tray",
    name: "Tiramisu Tray 13x9",
    basePrice: 65.0,
    image: "/SlideShow/flan.png",
    variantGroups: [],
  },
  {
    id: "chocoflan-redvelvet-fresaflan",
    name: "Chocoflan/Redvelvet/FresaFlan",
    basePrice: 60.0,
    image: null,
    variantGroups: [
      {
        id: "flavor",
        label: "Flavor",
        type: "single",
        required: true,
        options: [
          { id: "chocoflan", label: "Chocoflan", priceDelta: 0, image: "/SlideShow/ChocoFlan.png" },
          { id: "redvelvet", label: "Red Velvet", priceDelta: 0, image: null },
          { id: "fresaflan", label: "Fresa Flan", priceDelta: 0, image: null },
        ],
      },
      {
        id: "shape",
        label: "Shape",
        type: "single",
        required: true,
        options: [
          { id: "8x3-round", label: "8x3 Round", priceDelta: 0 },
          { id: "10in-heart", label: '10" Heart Shape', priceDelta: 0 },
        ],
      },
    ],
  },
];

export function defaultSelections(product) {
  const selections = {};
  for (const group of product.variantGroups) {
    selections[group.id] = group.options[0].id;
  }
  return selections;
}

export function findOption(product, groupId, optionId) {
  const group = product.variantGroups.find((g) => g.id === groupId);
  return group?.options.find((o) => o.id === optionId);
}

// If a variant group's options carry their own `image`, the selected option's
// image replaces the product photo (and can be null, i.e. blank until added).
export function getDisplayImage(product, selections) {
  const imageGroup = product.variantGroups.find((g) => g.options.some((o) => "image" in o));
  if (imageGroup) {
    return findOption(product, imageGroup.id, selections[imageGroup.id])?.image ?? null;
  }
  return product.image ?? null;
}

export function computeUnitPrice(product, selections) {
  const sizeGroup = product.variantGroups.find((g) => g.type === "size");
  let price = sizeGroup ? (findOption(product, sizeGroup.id, selections[sizeGroup.id])?.price ?? 0) : product.basePrice;

  for (const group of product.variantGroups) {
    if (group.type !== "single") continue;
    const option = findOption(product, group.id, selections[group.id]);
    price += option?.priceDelta ?? 0;
  }

  return price;
}

export function describeSelections(product, selections) {
  return product.variantGroups
    .map((group) => {
      const option = findOption(product, group.id, selections[group.id]);
      return option ? `${group.label}: ${option.label}` : null;
    })
    .filter(Boolean)
    .join(" · ");
}

export function formatUSD(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatScheduled(date, time) {
  if (!date || !time) return "";
  const dt = new Date(`${date}T${time}`);
  const datePart = dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timePart = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${datePart} at ${timePart}`;
}
