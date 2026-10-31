# Fanuna Shop – React Frontend

**Student name:** Ahmed Yassine Tifour

**Application/store name:** Fanuna Shop

## Project description

Fanuna Shop is a responsive e-commerce frontend rebuilt with React and TypeScript. It reproduces the approved Fanuna storefront design while keeping the TD/TP 2 scope frontend-only: products are loaded from local JSON data, the cart is managed with Redux Toolkit, and the pages are available without an API or backend.

## Objectives

- Rebuild the store interface with React and TSX.
- Reuse the Fanuna visual identity, responsive layout, colors, and Lucide icons.
- Implement product browsing, product details, cart management, coupons, contact, and information pages.
- Keep the frontend ready for the Node/Express/MongoDB work specified in TD/TP 3.

## Technologies

- React 18
- TypeScript (TSX)
- Vite
- Redux Toolkit and React Redux
- Tailwind CSS 4
- Lucide React
- Local JSON product catalogue

## Implemented features

- Home page with hero section and featured products.
- Products page with search, category filtering, sale filtering, and sorting.
- Single-product page with image gallery, stock state, quantity controls, add-to-cart, and related products.
- Cart drawer with add, increase, decrease, remove, subtotal, total, and local persistence.
- Coupon codes: `WELCOME10` and `FANUNA15`.
- Contact form with client-side validation for name, email, phone, subject, and message.
- Static About, FAQ, Shipping, Returns, and Privacy pages.
- Light/dark theme with responsive desktop and mobile navigation.
- Responsive layout matching the original Angular Fanuna storefront.
- Wishlist/favorites toggle persisted in local storage.

## Main React components

- `App`: application shell, navigation, theme state, and page composition.
- `ProductGrid`: reusable product-card grid with product actions.
- `CartDrawer`: cart display, quantity controls, coupons, and totals.
- `Contact`: validated contact form and store contact details.
- `InfoPage`: reusable static information-page layout.

## Redux state managed by the application

The Redux `cart` slice stores cart lines containing each product and its quantity, plus favorite product IDs. It defines `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, and `toggleFavorite` actions. React components read global state with `useSelector` and dispatch updates with `useDispatch`; cart and favorites are persisted to local storage.

## Project structure

```text
shop-react/
├── public/
│   └── data/products.json       # Local catalogue data
├── src/
│   ├── App.tsx                  # Page composition and frontend routes
│   ├── main.tsx                 # React entry point and Redux Provider
│   ├── styles.css               # Tailwind tokens and storefront styles
│   ├── types.ts                 # Shared TypeScript models
│   ├── lib/format.ts            # Price formatting helpers
│   ├── components/
│   │   ├── ProductGrid.tsx      # Reusable product cards and actions
│   │   └── CartDrawer.tsx       # Cart, quantity controls, and coupons
│   ├── pages/
│   │   ├── Contact.tsx          # Validated contact form and contact details
│   │   └── InfoPage.tsx         # Static information pages
│   └── store/
│       ├── cartSlice.ts         # Redux cart state and actions
│       └── store.ts             # Redux store and typed hooks
├── index.html
├── package.json
└── vite.config.ts
```

## Installation

Requirements: Node.js 18 or newer and npm.

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

Then open the local URL shown by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
```

The compiled frontend is generated in `dist/`.

