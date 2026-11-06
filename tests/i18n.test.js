import { describe, expect, it } from "vitest";
import { translations } from "../src/i18n/translations.js";
import { HOLIDAY_PRODUCTS, formatScheduled, localizeItem } from "../src/data/holidayMenu.js";

// Every key path in `obj`, e.g. "holiday.cart.title". Catalog entries are
// Spanish-only overrides (English comes from the menu data), so skip them.
function keyPaths(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (path === "holiday.catalog") return [path];
    if (value && typeof value === "object" && !Array.isArray(value)) return keyPaths(value, path);
    return [path];
  });
}

describe("translations", () => {
  it("English and Spanish have exactly the same keys", () => {
    expect(keyPaths(translations.es).sort()).toEqual(keyPaths(translations.en).sort());
  });

  it("lists of text have the same length in both languages", () => {
    for (const path of keyPaths(translations.en)) {
      const get = (lang) => path.split(".").reduce((o, k) => o[k], translations[lang]);
      if (Array.isArray(get("en"))) expect(get("es"), path).toHaveLength(get("en").length);
    }
  });

  it("has a Spanish name for every holiday product and option group", () => {
    const { products, groups } = translations.es.holiday.catalog;
    for (const product of HOLIDAY_PRODUCTS) {
      expect(products[product.id]?.name, product.id).toBeTruthy();
      for (const group of product.variantGroups) expect(groups[group.id], group.id).toBeTruthy();
    }
  });
});

describe("localizeItem", () => {
  const item = {
    productId: "cheesecake-9in",
    selections: { flavor: "strawberry" },
    name: "9\" Cheesecake's",
    selectionLabel: "Flavor: Strawberry",
  };

  it("shows Spanish names when a catalog is given", () => {
    expect(localizeItem(item, translations.es.holiday.catalog)).toEqual({
      name: 'Cheesecake de 9"',
      selectionLabel: "Sabor: Fresa",
    });
  });

  it("falls back to the stored text for older orders without productId", () => {
    const { productId, ...legacy } = item;
    expect(localizeItem(legacy, translations.es.holiday.catalog)).toEqual({
      name: legacy.name,
      selectionLabel: legacy.selectionLabel,
    });
  });
});

describe("formatScheduled", () => {
  it("formats in Spanish with the right article", () => {
    expect(formatScheduled("2026-12-20", "15:00", "es-US")).toMatch(/domingo.*a las/);
    expect(formatScheduled("2026-12-20", "13:00", "es-US")).toMatch(/a la 1/);
  });

  it("keeps English as the default", () => {
    expect(formatScheduled("2026-12-20", "14:00")).toBe("Sunday, December 20 at 2:00 PM");
  });
});
