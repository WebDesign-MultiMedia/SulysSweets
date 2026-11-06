// Placeholders in [square brackets] in the legal text are intentionally left
// in English in both languages so a single find-and-replace fills them in.
const usd = (amount) => Number(amount || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

export const translations = {
  en: {
    header: {
      nav: { home: "Home", about: "About", gallery: "Gallery", menu: "Menu", contact: "Contact" },
      mobileMenuLabel: "Menu",
      toggleMenuAria: "Toggle menu",
    },
    hero: {
      eyebrow: "Handmade in Pelham Bay, Bronx",
      titleLine1: "Cakes made for",
      titleLine2: "your celebration",
      paragraph:
        "Every order is baked, filled, and decorated by hand — small batches, real ingredients, and a design made just for you.",
      cta: "View the Menu",
    },
    about: {
      eyebrow: "About Us",
      title: "A small bakery with a big heart",
      paragraph1:
        "Suly's Sweets started as a passion for baking and grew into a home bakery serving birthdays, quinceañeras, and every occasion worth celebrating. Every cake, cupcake, and treat is made fresh, by hand, right in Pelham Bay, Bronx.",
      paragraph2:
        "From classic flavors to fully custom designs, we work closely with you to bring your vision to the table.",
    },
    instagram: {
      eyebrow: "Follow Along",
      title: "See our latest cakes on Instagram",
      paragraph: "New designs, behind-the-scenes baking, and daily inspiration — all on our feed.",
    },
    gallery: {
      eyebrow: "Our Work",
      title: "A Look at Our Creations",
      paragraph: "A few favorites from past orders — every piece baked, filled, and decorated by hand.",
    },
    menu: {
      eyebrow: "Our Menu",
      title: "Suly's Sweets Menu",
      startingPrices: "Starting Prices",
      cakeFlavors: "Cake Flavors",
      byTheDozen: "By the Dozen",
      flavorsSameAsCakes: "Flavors (Same as cakes)",
      addIns: "Add-ins",
      moreTreats: "More Treats",
      categoryLabels: {
        cakes: "Cakes",
        churro: "Churro Cheesecake",
        cupcakes: "Cupcakes",
        strawberries: "Strawberries",
        cheesecakes: "Cheesecakes",
        more: "More Treats",
      },
    },
    contact: {
      eyebrow: "Get in Touch",
      title: "Let's Plan Your Order",
      paragraph: "Reach out to talk flavors, design, and pick-up details for your next celebration.",
      emailUs: "Email Us",
      orderInfoTitle: "Order Info",
      orderInfo: [
        "50% non-refundable deposit required",
        "Payment: Zelle or Cash",
        "Pick-up: Pelham Bay, Bronx",
        "Delivery available (fee varies)",
      ],
    },
    orderForm: {
      eyebrow: "Request a Quote",
      title: "Tell us about your order",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@email.com",
      phoneLabel: "Phone",
      optional: "(optional)",
      phonePlaceholder: "(555) 555-5555",
      eventDateLabel: "Event date",
      interestLabel: "What are you interested in?",
      orderTypes: [
        "Cakes",
        "Cupcakes",
        "Churro Cheesecake",
        "9” Cheesecakes",
        "Chocolate Covered Strawberries",
        "Banana Loaf",
        "Pies",
        "Jellos / Gelatinas",
        "Banana Pudding",
        "Tiramisu",
        "Other / Not sure yet",
      ],
      detailsLabel: "Details",
      detailsPlaceholder: "Flavor, size, design ideas, how many people, budget...",
      submit: "Send Request",
      noteBeforeSend:
        "This opens your email app with everything filled in so you can send it straight to us.",
      noteAfterSend: "Opening your email app with your request filled in — just hit send!",
      email: {
        subject: (orderType, name) => `Quote request — ${orderType} for ${name}`,
        heading: "🎂 New Order Request — Suly's Sweets",
        name: "Name:",
        email: "Email:",
        phone: "Phone:",
        eventDate: "Event date:",
        orderType: "Order type:",
        details: "Details:",
        dateLocale: "en-US",
      },
    },
    footer: {
      copyright: (year) => `© ${year} Suly's Sweets. All rights reserved.`,
      privacy: "Privacy Policy",
      terms: "Terms",
    },
    cart: {
      smsConsent: {
        before: "Text me order updates and receipts for this order. Msg & data rates may apply. Msg frequency varies. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. See our ",
        privacy: "Privacy Policy",
        and: " and ",
        terms: "Terms",
        after: ".",
        optional: "(optional)",
      },
      errors: {
        cart_empty: "Your cart is empty.",
        missing_contact: "Please fill in your name, email, and phone.",
        missing_address: "Please add a delivery address.",
        missing_schedule: "Please choose a date and time.",
        unknown_product: "An item in your cart is no longer available. Please remove it and try again.",
        cart_too_large: "Your order is too large to check out online. Please call or text us to place it.",
        checkout_failed: "We couldn't start checkout. Please try again in a moment.",
      },
    },
    success: {
      receiptSentEmail: "Receipt sent to your email.",
      receiptSentBoth: "Receipt sent to your email and phone.",
      receiptPending: "Your receipt is on its way — it should arrive by email shortly.",
      demoNote: "This is a demo — the buttons below preview sending a receipt (nothing is actually sent).",
      resendEmail: "Resend email",
      resendText: "Resend text",
      sending: "Sending…",
      sent: "Sent!",
      tryAgain: "Try again",
      errors: {
        not_paid: "This order hasn't been paid yet, so we can't send a receipt.",
        no_consent: "Text receipts weren't requested for this order.",
        limit_reached: "You've reached the resend limit for this order. Please contact us if you still need a copy.",
        cooldown: (seconds) => `Please wait ${seconds} seconds before sending again.`,
        not_found: "We couldn't find this order.",
        send_failed: "We couldn't send that right now. Please try again in a minute.",
      },
    },
    sms: {
      receipt: ({ orderId, depositPaid, remainingBalance, fulfillment, scheduled, link }) =>
        `Suly's Sweets — Order ${orderId} confirmed! Deposit paid: ${usd(depositPaid)}. Balance due at pickup: ${usd(remainingBalance)}.` +
        (scheduled ? ` ${fulfillment === "delivery" ? "Delivery" : "Pickup"}: ${scheduled}.` : "") +
        ` Details: ${link} Reply STOP to opt out, HELP for help.`,
    },
    legal: {
      backHome: "Back to Suly's Sweets",
      effective: "Effective date: [Effective date]",
      privacy: {
        title: "Privacy Policy",
        intro:
          "This Privacy Policy explains how [Business legal name] (\"Suly's Sweets,\" \"we,\" \"us\") collects, uses, and protects your information when you visit this website or place an order.",
        sections: [
          {
            heading: "Information we collect",
            list: [
              "Contact details you give us: your name, email address, and phone number.",
              "Order details: the items you choose, pickup or delivery preference, delivery address, and requested date and time.",
              "Payment information is entered on Stripe's secure checkout page. We do not see or store your full card number.",
              "Your language preference and shopping cart, stored only in your own browser.",
              "Basic technical information (such as IP address and browser type) recorded by our hosting provider when you visit the site.",
            ],
          },
          {
            heading: "How we use your information",
            list: [
              "To take, prepare, and deliver your order.",
              "To send your order receipt and order updates by email.",
              "To send order updates and receipts by text message, only if you opt in at checkout.",
              "To answer your questions and provide customer support.",
            ],
          },
          {
            heading: "Service providers",
            paragraphs: [
              "We share information only with service providers that help us run the business: Stripe (payments), Resend (email delivery), Twilio (text message delivery), and Vercel (website hosting). They may use your information only to provide their services to us.",
              "We do not sell your personal information.",
            ],
          },
          {
            heading: "Text messaging (SMS)",
            paragraphs: [
              "If you opt in, we use your mobile number only to send messages about your order, such as receipts and order updates.",
              "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Information sharing to subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.",
              "You can opt out at any time by replying STOP. Reply HELP for help. See our Terms for full SMS terms.",
            ],
          },
          {
            heading: "How long we keep information",
            paragraphs: ["We keep order information for [Data retention period], or longer if required by law."],
          },
          {
            heading: "Your choices",
            paragraphs: [
              "You can ask us to access, correct, or delete your personal information by contacting us at [Contact email].",
            ],
          },
          {
            heading: "Children",
            paragraphs: ["This website is not directed to children under 13, and we do not knowingly collect their information."],
          },
          {
            heading: "Changes to this policy",
            paragraphs: ["We may update this policy from time to time. The effective date above shows when it was last changed."],
          },
          {
            heading: "Contact us",
            paragraphs: ["[Business legal name] · [Business mailing address] · [Contact email] · [Support phone number]"],
          },
        ],
      },
      terms: {
        title: "Terms of Service",
        intro:
          "These Terms apply to your use of this website and to orders placed with [Business legal name] (\"Suly's Sweets,\" \"we,\" \"us\"). By placing an order, you agree to these Terms.",
        sections: [
          {
            heading: "Orders and deposits",
            list: [
              "A 50% non-refundable deposit is required to secure your order.",
              "The remaining balance is due at pickup or delivery.",
              "Delivery is available for a fee that varies by location.",
              "[Cancellation & refund policy details]",
            ],
          },
          {
            heading: "Allergens",
            paragraphs: ["[Allergen notice]"],
          },
          {
            heading: "SMS terms",
            list: [
              "Program name: Suly's Sweets Order Updates.",
              "What you'll receive: receipts and updates about orders you place with us. We do not send marketing texts.",
              "Message frequency varies by order.",
              "Message and data rates may apply.",
              "Reply STOP to opt out at any time. You'll receive one confirmation message, and no further texts after that.",
              "Reply HELP for help, or contact us at [Support phone number] or [Contact email].",
              "Consent to receive texts is not a condition of purchase.",
              "Carriers are not liable for delayed or undelivered messages.",
              "See our Privacy Policy for how we handle your information.",
            ],
          },
          {
            heading: "Governing law",
            paragraphs: ["These Terms are governed by the laws of the State of [State of governing law]."],
          },
          {
            heading: "Contact us",
            paragraphs: ["[Business legal name] · [Business mailing address] · [Contact email] · [Support phone number]"],
          },
        ],
      },
    },
  },
  es: {
    header: {
      nav: { home: "Inicio", about: "Nosotros", gallery: "Galería", menu: "Menú", contact: "Contacto" },
      mobileMenuLabel: "Menú",
      toggleMenuAria: "Alternar menú",
    },
    hero: {
      eyebrow: "Hecho a mano en Pelham Bay, Bronx",
      titleLine1: "Pasteles hechos para",
      titleLine2: "tu celebración",
      paragraph:
        "Cada pedido se hornea, rellena y decora a mano — en pequeños lotes, con ingredientes reales y un diseño hecho solo para ti.",
      cta: "Ver el Menú",
    },
    about: {
      eyebrow: "Nosotros",
      title: "Una pequeña pastelería con un gran corazón",
      paragraph1:
        "Suly's Sweets comenzó como una pasión por la repostería y se convirtió en una pastelería casera que atiende cumpleaños, quinceañeras y toda ocasión que valga la pena celebrar. Cada pastel, cupcake y postre se hace fresco, a mano, en Pelham Bay, Bronx.",
      paragraph2:
        "Desde sabores clásicos hasta diseños totalmente personalizados, trabajamos de cerca contigo para hacer realidad tu visión.",
    },
    instagram: {
      eyebrow: "Síguenos",
      title: "Mira nuestros pasteles más recientes en Instagram",
      paragraph: "Nuevos diseños, el detrás de cámaras de la repostería, e inspiración diaria — todo en nuestro feed.",
    },
    gallery: {
      eyebrow: "Nuestro Trabajo",
      title: "Un Vistazo a Nuestras Creaciones",
      paragraph: "Algunos favoritos de pedidos anteriores — cada pieza horneada, rellena y decorada a mano.",
    },
    menu: {
      eyebrow: "Nuestro Menú",
      title: "Menú de Suly's Sweets",
      startingPrices: "Precios Iniciales",
      cakeFlavors: "Sabores de Pastel",
      byTheDozen: "Por Docena",
      flavorsSameAsCakes: "Sabores (Igual que los pasteles)",
      addIns: "Ingredientes Extra",
      moreTreats: "Más Postres",
      categoryLabels: {
        cakes: "Pasteles",
        churro: "Cheesecake de Churro",
        cupcakes: "Cupcakes",
        strawberries: "Fresas",
        cheesecakes: "Cheesecakes",
        more: "Más Postres",
      },
    },
    contact: {
      eyebrow: "Contáctanos",
      title: "Planeemos tu Pedido",
      paragraph: "Contáctanos para hablar sobre sabores, diseño y detalles de recogida para tu próxima celebración.",
      emailUs: "Envíanos un Correo",
      orderInfoTitle: "Información del Pedido",
      orderInfo: [
        "Depósito no reembolsable del 50% requerido",
        "Pago: Zelle o efectivo",
        "Recogida: Pelham Bay, Bronx",
        "Entrega disponible (el costo varía)",
      ],
    },
    orderForm: {
      eyebrow: "Solicitar una Cotización",
      title: "Cuéntanos sobre tu pedido",
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      phoneLabel: "Teléfono",
      optional: "(opcional)",
      phonePlaceholder: "(555) 555-5555",
      eventDateLabel: "Fecha del evento",
      interestLabel: "¿Qué te interesa?",
      orderTypes: [
        "Pasteles",
        "Cupcakes",
        "Cheesecake de Churro",
        "Cheesecakes de 9”",
        "Fresas Cubiertas de Chocolate",
        "Pan de Plátano",
        "Pays",
        "Jellos / Gelatinas",
        "Banana Pudding",
        "Tiramisú",
        "Otro / Aún no estoy seguro",
      ],
      detailsLabel: "Detalles",
      detailsPlaceholder: "Sabor, tamaño, ideas de diseño, cuántas personas, presupuesto...",
      submit: "Enviar Solicitud",
      noteBeforeSend:
        "Esto abrirá tu aplicación de correo con todo completado para que puedas enviárnoslo directamente.",
      noteAfterSend: "Abriendo tu aplicación de correo con tu solicitud completada — ¡solo dale enviar!",
      email: {
        subject: (orderType, name) => `Solicitud de cotización — ${orderType} para ${name}`,
        heading: "🎂 Nueva Solicitud de Pedido — Suly's Sweets",
        name: "Nombre:",
        email: "Correo:",
        phone: "Teléfono:",
        eventDate: "Fecha del evento:",
        orderType: "Tipo de pedido:",
        details: "Detalles:",
        dateLocale: "es",
      },
    },
    footer: {
      copyright: (year) => `© ${year} Suly's Sweets. Todos los derechos reservados.`,
      privacy: "Política de Privacidad",
      terms: "Términos",
    },
    cart: {
      smsConsent: {
        before: "Envíenme actualizaciones y recibos de este pedido por mensaje de texto. Pueden aplicarse tarifas de mensajes y datos. La frecuencia de los mensajes varía. Responde STOP para cancelar, HELP para ayuda. El consentimiento no es una condición de compra. Consulta nuestra ",
        privacy: "Política de Privacidad",
        and: " y nuestros ",
        terms: "Términos",
        after: ".",
        optional: "(opcional)",
      },
      errors: {
        cart_empty: "Tu carrito está vacío.",
        missing_contact: "Por favor completa tu nombre, correo y teléfono.",
        missing_address: "Por favor agrega una dirección de entrega.",
        missing_schedule: "Por favor elige una fecha y hora.",
        unknown_product: "Un artículo de tu carrito ya no está disponible. Elimínalo e inténtalo de nuevo.",
        cart_too_large: "Tu pedido es demasiado grande para pagarlo en línea. Llámanos o envíanos un mensaje para hacerlo.",
        checkout_failed: "No pudimos iniciar el pago. Inténtalo de nuevo en un momento.",
      },
    },
    success: {
      receiptSentEmail: "Recibo enviado a tu correo.",
      receiptSentBoth: "Recibo enviado a tu correo y teléfono.",
      receiptPending: "Tu recibo está en camino — debería llegar a tu correo en breve.",
      demoNote: "Esto es una demostración — los botones de abajo simulan el envío de un recibo (no se envía nada).",
      resendEmail: "Reenviar correo",
      resendText: "Reenviar mensaje",
      sending: "Enviando…",
      sent: "¡Enviado!",
      tryAgain: "Intentar de nuevo",
      errors: {
        not_paid: "Este pedido aún no ha sido pagado, así que no podemos enviar un recibo.",
        no_consent: "No se solicitaron recibos por mensaje de texto para este pedido.",
        limit_reached: "Alcanzaste el límite de reenvíos para este pedido. Contáctanos si aún necesitas una copia.",
        cooldown: (seconds) => `Espera ${seconds} segundos antes de enviar de nuevo.`,
        not_found: "No pudimos encontrar este pedido.",
        send_failed: "No pudimos enviarlo en este momento. Inténtalo de nuevo en un minuto.",
      },
    },
    sms: {
      receipt: ({ orderId, depositPaid, remainingBalance, fulfillment, scheduled, link }) =>
        `Suly's Sweets — ¡Pedido ${orderId} confirmado! Depósito pagado: ${usd(depositPaid)}. Saldo a pagar al recoger: ${usd(remainingBalance)}.` +
        (scheduled ? ` ${fulfillment === "delivery" ? "Entrega" : "Recogida"}: ${scheduled}.` : "") +
        ` Detalles: ${link} Responde STOP para cancelar, HELP para ayuda.`,
    },
    legal: {
      backHome: "Volver a Suly's Sweets",
      effective: "Fecha de entrada en vigor: [Effective date]",
      privacy: {
        title: "Política de Privacidad",
        intro:
          "Esta Política de Privacidad explica cómo [Business legal name] (\"Suly's Sweets\", \"nosotros\") recopila, usa y protege tu información cuando visitas este sitio web o haces un pedido.",
        sections: [
          {
            heading: "Información que recopilamos",
            list: [
              "Los datos de contacto que nos das: tu nombre, correo electrónico y número de teléfono.",
              "Detalles del pedido: los productos que eliges, si prefieres recogida o entrega, la dirección de entrega y la fecha y hora solicitadas.",
              "La información de pago se ingresa en la página de pago segura de Stripe. No vemos ni guardamos el número completo de tu tarjeta.",
              "Tu preferencia de idioma y tu carrito de compras, guardados solo en tu propio navegador.",
              "Información técnica básica (como la dirección IP y el tipo de navegador) que registra nuestro proveedor de hosting cuando visitas el sitio.",
            ],
          },
          {
            heading: "Cómo usamos tu información",
            list: [
              "Para recibir, preparar y entregar tu pedido.",
              "Para enviarte el recibo y las actualizaciones de tu pedido por correo electrónico.",
              "Para enviarte actualizaciones y recibos por mensaje de texto, solo si das tu consentimiento al pagar.",
              "Para responder tus preguntas y brindarte atención al cliente.",
            ],
          },
          {
            heading: "Proveedores de servicios",
            paragraphs: [
              "Solo compartimos información con proveedores de servicios que nos ayudan a operar el negocio: Stripe (pagos), Resend (envío de correos), Twilio (envío de mensajes de texto) y Vercel (hosting del sitio web). Solo pueden usar tu información para prestarnos sus servicios.",
              "No vendemos tu información personal.",
            ],
          },
          {
            heading: "Mensajes de texto (SMS)",
            paragraphs: [
              "Si das tu consentimiento, usamos tu número móvil solo para enviarte mensajes sobre tu pedido, como recibos y actualizaciones.",
              "No compartiremos información móvil con terceros ni afiliados para fines de marketing o promoción. Se permite compartir información con subcontratistas de servicios de apoyo, como atención al cliente. Todas las demás categorías excluyen los datos de consentimiento (opt-in) de mensajes de texto; esta información no se compartirá con ningún tercero.",
              "Puedes cancelar en cualquier momento respondiendo STOP. Responde HELP para obtener ayuda. Consulta nuestros Términos para ver los términos completos de SMS.",
            ],
          },
          {
            heading: "Cuánto tiempo guardamos la información",
            paragraphs: ["Guardamos la información de los pedidos durante [Data retention period], o más tiempo si la ley lo exige."],
          },
          {
            heading: "Tus opciones",
            paragraphs: [
              "Puedes pedirnos acceder, corregir o eliminar tu información personal escribiéndonos a [Contact email].",
            ],
          },
          {
            heading: "Menores de edad",
            paragraphs: ["Este sitio web no está dirigido a menores de 13 años y no recopilamos su información de forma intencional."],
          },
          {
            heading: "Cambios a esta política",
            paragraphs: ["Podemos actualizar esta política de vez en cuando. La fecha de entrada en vigor indica cuándo se cambió por última vez."],
          },
          {
            heading: "Contáctanos",
            paragraphs: ["[Business legal name] · [Business mailing address] · [Contact email] · [Support phone number]"],
          },
        ],
      },
      terms: {
        title: "Términos de Servicio",
        intro:
          "Estos Términos se aplican al uso de este sitio web y a los pedidos hechos con [Business legal name] (\"Suly's Sweets\", \"nosotros\"). Al hacer un pedido, aceptas estos Términos.",
        sections: [
          {
            heading: "Pedidos y depósitos",
            list: [
              "Se requiere un depósito no reembolsable del 50% para asegurar tu pedido.",
              "El saldo restante se paga al recoger o al recibir la entrega.",
              "La entrega está disponible con un costo que varía según la ubicación.",
              "[Cancellation & refund policy details]",
            ],
          },
          {
            heading: "Alérgenos",
            paragraphs: ["[Allergen notice]"],
          },
          {
            heading: "Términos de SMS",
            list: [
              "Nombre del programa: Suly's Sweets Order Updates.",
              "Qué recibirás: recibos y actualizaciones de los pedidos que hagas con nosotros. No enviamos mensajes de marketing.",
              "La frecuencia de los mensajes varía según el pedido.",
              "Pueden aplicarse tarifas de mensajes y datos.",
              "Responde STOP para cancelar en cualquier momento. Recibirás un mensaje de confirmación y ningún mensaje más después de eso.",
              "Responde HELP para obtener ayuda, o contáctanos al [Support phone number] o a [Contact email].",
              "El consentimiento para recibir mensajes de texto no es una condición de compra.",
              "Los operadores no son responsables de mensajes retrasados o no entregados.",
              "Consulta nuestra Política de Privacidad para saber cómo manejamos tu información.",
            ],
          },
          {
            heading: "Ley aplicable",
            paragraphs: ["Estos Términos se rigen por las leyes del Estado de [State of governing law]."],
          },
          {
            heading: "Contáctanos",
            paragraphs: ["[Business legal name] · [Business mailing address] · [Contact email] · [Support phone number]"],
          },
        ],
      },
    },
  },
};
