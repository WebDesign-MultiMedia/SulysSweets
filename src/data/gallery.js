// Product photos (transparent cut-outs, 9:16) used across the home page.
export const GALLERY = [
  { src: "/SlideShow/whiteCake.png", en: "White cake", es: "Pastel blanco" },
  { src: "/SlideShow/strawberriesCakes.png", en: "Strawberry cake", es: "Pastel de fresas" },
  { src: "/SlideShow/hannaMontanaCake.png", en: "Hannah Montana cake", es: "Pastel de Hannah Montana" },
  { src: "/SlideShow/cupcakes.png", en: "Custom cupcakes", es: "Cupcakes personalizados" },
  { src: "/SlideShow/churroCheesecake.png", en: "Churro cheesecake", es: "Cheesecake de churro" },
  { src: "/SlideShow/chocolateCoveredStrawberries.png", en: "Chocolate covered strawberries", es: "Fresas cubiertas de chocolate" },
  { src: "/SlideShow/cheesecakes.png", en: "9\" cheesecake", es: "Cheesecake de 9\"" },
  { src: "/SlideShow/gelatinas.png", en: "Jellos / Gelatinas", es: "Gelatinas" },
  { src: "/SlideShow/cookies.png", en: "Cookies", es: "Galletas" },
  { src: "/SlideShow/flan.png", en: "Flan", es: "Flan" },
  { src: "/SlideShow/ChocoFlan.png", en: "Choco flan", es: "Chocoflan" },
];

export const altFor = (item, lang) => `${item[lang] ?? item.en} — Suly's Sweets`;
