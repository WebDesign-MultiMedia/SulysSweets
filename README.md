# Suly's Sweets — Bakery Website & Holiday Ordering App

**Live site:** https://sulys-sweets.vercel.app

A production-style, bilingual (English / Español) website for **Suly's Sweets**, a home bakery in Pelham Bay, Bronx, NY that makes custom cakes, cupcakes, chocolate-covered strawberries and dessert tables. It is a real client project. It has a marketing site and a full **holiday pre-order web app** with a cart, Stripe Checkout (50% deposit), and automatic email and SMS receipts.

> **Demo mode:** the live deployment runs without payment or messaging keys, so nobody can be charged and no real receipts are sent. You can still click through the whole ordering flow; the app detects this and walks you through a realistic demo order instead. Add the keys and the same code runs for real (see [Running it for real](#running-it-for-real)).

![Suly's Sweets home page](docs/screenshots/home-desktop.jpg)

## Screenshots

| Holiday menu | Cart & checkout | Order confirmation |
| --- | --- | --- |
| ![Holiday ordering page with demo-mode banner](docs/screenshots/holiday-menu-desktop.jpg) | ![Cart drawer with pickup scheduling, contact info and SMS consent](docs/screenshots/cart-desktop.jpg) | ![Order confirmation with receipt and resend buttons](docs/screenshots/confirmation-desktop.jpg) |

| Menu | Gallery |
| --- | --- |
| ![Menu section with starting prices](docs/screenshots/menu-desktop.jpg) | ![Gallery of past cakes](docs/screenshots/gallery-desktop.jpg) |

<p align="center">
  <img src="docs/screenshots/home-mobile.jpg" alt="Home page on a phone" width="260" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/holiday-menu-mobile.jpg" alt="Holiday menu on a phone" width="260" />
</p>

---

## What to try (2-minute tour)

1. **Home page** (`/`): animated hero, gallery with a lightbox, the menu with prices, an Instagram section and a contact form.
2. **Language toggle:** switch between English and Spanish. The main site, cart, errors, legal pages and SMS text are all translated.
3. **Holiday menu** (`/holiday-order`): add items to the cart, choose pickup or delivery, pick a date and time, and opt in to text updates.
4. **Checkout:** in demo mode you land on the order confirmation page with a sample receipt, "Resend email" and "Resend text" buttons.
5. **Legal pages:** `/privacy` and `/terms`. These are the pages needed for SMS (A2P 10DLC) carrier registration.

---

## Features

### Customer experience
- **Bilingual EN/ES** with a toggle that is remembered across pages. All copy lives in one translation file.
- **Modern, animated UI:** Vanta.js 3D backgrounds (lazy-loaded), Framer Motion scroll reveals, a scrolling marquee, a holiday theme with snowfall and a garland.
- **Responsive from 360px phones to wide desktops**, with reduced-motion support.
- **Gallery and lightbox** with zoomable product photos.
- **Holiday cart:** quantities, sizes and flavors, pickup or delivery, scheduling, and a running total with the 50% deposit.
- **Order confirmation page** that loads the real order from Stripe and shows receipt status.

### Payments & messaging (serverless backend)
- **Stripe Checkout:** the server re-prices every cart item from its own price list, so nobody can change prices in the browser.
- **Stripe webhook** with signature verification sends receipts once the payment is confirmed.
- **Email receipts** through Resend and **SMS receipts** through Twilio, in the customer's language.
- **Duplicate-proof receipts:** the send count and timestamps are stored on the Stripe session. Each channel is limited to 2 sends with a 60-second cooldown, and a send that fails is rolled back.
- **SMS consent (TCPA / 10DLC):** an optional, unchecked opt-in checkbox. The consent, its timestamp, the policy version and the language are saved with the order. Texts are never sent without consent and always include STOP/HELP.
- **Large-cart support:** order items are split across Stripe's 500-character metadata limit.
- **Safe error handling:** the API returns generic error codes that the browser translates. Details are logged on the server only.
- **Automatic demo mode:** `/api/status` tells the browser whether checkout is live. The demo is used only when checkout isn't set up, never to hide a real error.

### Security & quality
- Security headers set in `vercel.json` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- No secrets in the repo; every key is an environment variable (see `.env.example`).
- **GitHub Actions CI** on every push: clean install, syntax check of every API function, production build, and `npm audit` for high-severity issues.

---

## Challenges & decisions

**1. Stopping duplicate and spam receipts**
- *Problem:* Stripe may deliver the same webhook event more than once, and customers can keep pressing "Resend". That could text a customer five times or let someone use the endpoint to spam a phone number.
- *Approach:* receipt state lives on the Stripe session itself. Before a send, the server writes the new count and timestamp (reserving the slot), then sends, and rolls the reservation back if the provider fails. Resends need a paid order, a valid session ID, and (for SMS) recorded consent.
- *Result:* at most 2 sends per channel per order (the automatic one counts), a 60-second cooldown, and a retry after a failure never double-sends. No extra infrastructure was needed.

**2. No database, on purpose**
- *Decision:* the Stripe Checkout session *is* the order record. Items, schedule, contact info, consent and receipt state are all stored in its metadata.
- *Trade-off:* orders can't be searched outside the Stripe Dashboard. In exchange there is nothing extra to host, pay for, back up or secure. For a one-person bakery that's the right call. A database can be added later without changing the checkout flow.

**3. Never trusting prices from the browser**
- *Problem:* anything in the cart can be edited in DevTools.
- *Approach:* the browser sends only product IDs, options and quantities. `/api/checkout` looks up every price in the server's own menu, caps quantities, and rejects unknown products before creating the Stripe session.

**4. A demo that never hides real failures**
- *Problem:* the site needs to be a clickable demo without live keys, but an earlier version showed a fake "Thank you!" page whenever checkout failed for *any* reason. A real customer could think they'd ordered when they hadn't.
- *Approach:* `/api/status` reports `live` or `demo`. The browser falls back to the demo only when checkout isn't configured or the API is unreachable. Real errors (bad input, Stripe declining) show a translated error message instead.

**5. SMS compliance (TCPA / A2P 10DLC)**
- *Problem:* US carriers block business numbers that text without clear consent.
- *Approach:* an optional, unchecked opt-in that links to the Privacy Policy and Terms. The server stores the consent flag, its timestamps, the policy version and the language with the order. Texts are only sent with consent and always include STOP/HELP. `/privacy` and `/terms` are bilingual and written to support carrier registration.

**6. Fitting big orders into Stripe metadata**
- *Problem:* Stripe allows only 500 characters per metadata value, so a large cart overflowed and checkout failed.
- *Approach:* the items are serialized and split across `items`, `items_1`, `items_2`, … and reassembled when the order is read back. A size limit returns a clear "cart too large" error instead of a crash.

---

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | React 18, Vite 6, React Router 7 |
| Styling | Tailwind CSS v4 (design tokens via `@theme`) |
| Animation & visuals | Framer Motion, Vanta.js (Three.js / p5.js), Lucide icons |
| Backend | Vercel Serverless Functions (Node.js, `/api`) |
| Payments | Stripe Checkout + webhooks (`stripe`, `@stripe/stripe-js`) |
| Email | Resend |
| SMS | Twilio |
| i18n | Custom React context + translation dictionary (EN/ES) |
| Hosting & CI/CD | Vercel (auto-deploys from `main`), GitHub Actions |

---

## Architecture

```
Browser (React SPA)
 ├─ /               Home: hero, about, gallery, menu, Instagram, contact
 ├─ /holiday-order  Holiday menu + cart drawer ──► POST /api/checkout ──► Stripe Checkout
 ├─ /holiday-order/success?session_id=…  ◄── GET /api/order (reads the Stripe session)
 └─ /privacy, /terms

Stripe ──(checkout.session.completed)──► POST /api/webhook
                                           ├─ email receipt (Resend)
                                           └─ SMS receipt (Twilio, only with consent)

POST /api/send-email, /api/send-sms   customer-triggered resend (rate-limited)
GET  /api/status                      { checkout: "live" | "demo" }
```

There is no database. **The Stripe Checkout session is the order record**: items, contact info, schedule, consent and receipt state all live in its metadata. That keeps the app cheap and simple to run for a small business.

### Project structure

```
api/                 Serverless functions (each file is an endpoint)
  _lib/              Shared helpers (not routes): Stripe order encoding,
                     receipt rate limiting, email/SMS senders
src/
  components/        Home page sections and shared UI
  components/holiday/  Holiday ordering UI (cart drawer, product cards, snow)
  pages/             Route pages (Home, HolidayOrder, Success, Privacy, Terms)
  context/           Holiday cart state
  hooks/             useCheckoutMode, useMatchMedia, useBodyBackground
  i18n/              Language context + all EN/ES translations
  data/              Menu, holiday products, gallery, demo order
public/              Images and logo
.github/workflows/   CI pipeline
```

---

## Running locally

```bash
npm install
npm run dev        # front end at http://localhost:5173 (checkout falls back to demo mode)
npm run build      # production build
```

To run the `/api` functions locally as well, use the Vercel CLI:

```bash
npm i -g vercel
cp .env.example .env.local   # fill in test keys
vercel dev
```

## Running it for real

Set these environment variables in Vercel (names only; see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Creates Checkout sessions; switches off demo mode |
| `STRIPE_WEBHOOK_SECRET` | Verifies `/api/webhook` events |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Email receipts |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | SMS receipts |

Use Stripe **test mode** keys first. Test card: `4242 4242 4242 4242`, any future date, any CVC.

---

## About

Designed and built by **WebDesign-MultiMedia** for Suly's Sweets.
Business: [@sulys_sweets on Instagram](https://www.instagram.com/sulys_sweets) · sulyssweets24@gmail.com · 347-859-5181
