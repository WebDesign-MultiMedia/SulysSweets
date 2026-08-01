const catalog = {
  en: {
    policyNotes: [
      "Cake toppers have an additional cost depending on the design requested.",
      "A 50% non-refundable deposit is required to confirm your order.",
      "Payment methods: Zelle or Cash.",
      "Pick-up location: Pelham Bay, Bronx.",
      "Delivery available — fee varies depending on location",
    ],
    startingPriceNotice: [
      "THESE ARE ALL STARTING PRICES.",
      "FINAL PRICE WILL DEPEND ON THE DESIGN/DECORATION.",
    ],
    cakeFlavors: ["Chocolate", "Funfetti", "Vanilla", "Red Velvet", "Marble", "Strawberry", "Oreo"],
    cakes: {
      title: "Cakes",
      startingPrices: [
        { label: '6” Round / Heart', price: "$100" },
        { label: '8” Round / Heart', price: "$145" },
        { label: '10” Round / Heart', price: "$175" },
      ],
      note: "* Tres Leches can be added to any flavor *",
    },
    churroCheesecake: {
      title: "Churro Cheesecake",
      priceLine: "Tray $60 / Cake Style $65",
      options: ["Original", "Oreo +$5", "Biscoff Cookie +$5"],
    },
    cupcakes: {
      title: "Cupcakes",
      prices: [
        { label: "Mini Cupcakes", price: "$35" },
        { label: "Regular Size Cupcakes", price: "$45" },
        { label: "2+ Dozen", price: "$5 OFF" },
      ],
    },
    bananaLoaf: {
      title: "Banana Loaf",
      price: "$20",
      addIns: ["Chocolate Chips", "Walnuts", "Pecans"],
    },
    pies: {
      title: "Pies",
      price: "$30",
      note: "(Min 2)",
      options: ["Apple Pie", "Pumpkin"],
    },
    jellos: {
      title: "Jellos / Gelatinas",
      price: "$60",
      options: ["Piña Colada", "Mangoneada", "Sponch", "Gansito"],
    },
    chocolateStrawberries: {
      title: "Chocolate Covered Strawberries",
      prices: [
        { label: "12-ct", price: "$50" },
        { label: "27ct Cake Style", price: "$115" },
      ],
      flavors: ["White Chocolate", "or", "Milk Chocolate"],
    },
    cheesecakes9in: {
      title: '9” Cheesecakes',
      price: "$50",
      options: ["Original", "Strawberry +$5", "Blueberry +$5", "Oreo +$5", "Biscoff Cookie +$5"],
    },
    bananaPudding: {
      title: "Banana Pudding",
      prices: [
        { label: "13x9 Tray", price: "$65" },
        { label: '9” Pan', price: "$45" },
      ],
    },
    tiramisu: {
      title: "Tiramisu",
      priceLine: "Cake Style $75",
    },
    thankYouNote: "Thank you for supporting my small business! ♡",
  },
  es: {
    policyNotes: [
      "Los toppers para pasteles tienen un costo adicional según el diseño solicitado.",
      "Se requiere un depósito no reembolsable del 50% para confirmar su pedido.",
      "Métodos de pago: Zelle o efectivo.",
      "Lugar de recogida: Pelham Bay, Bronx.",
      "Entrega disponible — el costo varía según la ubicación",
    ],
    startingPriceNotice: [
      "ESTOS SON PRECIOS INICIALES.",
      "EL PRECIO FINAL DEPENDERÁ DEL DISEÑO/DECORACIÓN.",
    ],
    cakeFlavors: ["Chocolate", "Funfetti", "Vainilla", "Red Velvet", "Mármol", "Fresa", "Oreo"],
    cakes: {
      title: "Pasteles",
      startingPrices: [
        { label: '6” Redondo / Corazón', price: "$100" },
        { label: '8” Redondo / Corazón', price: "$145" },
        { label: '10” Redondo / Corazón', price: "$175" },
      ],
      note: "* Se le puede agregar Tres Leches a cualquier sabor *",
    },
    churroCheesecake: {
      title: "Cheesecake de Churro",
      priceLine: "Charola $60 / Estilo Pastel $65",
      options: ["Original", "Oreo +$5", "Galleta Biscoff +$5"],
    },
    cupcakes: {
      title: "Cupcakes",
      prices: [
        { label: "Mini Cupcakes", price: "$35" },
        { label: "Cupcakes Tamaño Regular", price: "$45" },
        { label: "2+ Docenas", price: "$5 DE DESCUENTO" },
      ],
    },
    bananaLoaf: {
      title: "Pan de Plátano",
      price: "$20",
      addIns: ["Chispas de Chocolate", "Nueces", "Nueces Pecanas"],
    },
    pies: {
      title: "Pays",
      price: "$30",
      note: "(Mín. 2)",
      options: ["Pay de Manzana", "Pay de Calabaza"],
    },
    jellos: {
      title: "Jellos / Gelatinas",
      price: "$60",
      options: ["Piña Colada", "Mangoneada", "Sponch", "Gansito"],
    },
    chocolateStrawberries: {
      title: "Fresas Cubiertas de Chocolate",
      prices: [
        { label: "12 pzas", price: "$50" },
        { label: "27 pzas Estilo Pastel", price: "$115" },
      ],
      flavors: ["Chocolate Blanco", "o", "Chocolate de Leche"],
    },
    cheesecakes9in: {
      title: 'Cheesecakes de 9”',
      price: "$50",
      options: ["Original", "Fresa +$5", "Arándano +$5", "Oreo +$5", "Galleta Biscoff +$5"],
    },
    bananaPudding: {
      title: "Banana Pudding",
      prices: [
        { label: "Charola 13x9", price: "$65" },
        { label: 'Molde de 9”', price: "$45" },
      ],
    },
    tiramisu: {
      title: "Tiramisú",
      priceLine: "Estilo Pastel $75",
    },
    thankYouNote: "¡Gracias por apoyar mi pequeño negocio! ♡",
  },
};

export function getMenuData(lang) {
  return catalog[lang] ?? catalog.en;
}
