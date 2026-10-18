# VELORÉ — Haute Parfumerie & Luxury E-Commerce Platform

> **Luxury Fragrances. Timeless Identity.**

VELORÉ is a full-featured, editorial luxury perfume e-commerce web application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed with an editorial Parisian aesthetic (Warm Ivory, Charcoal, Champagne Gold palette) and engineered with high performance, strict accessibility, and production security standards.

---

## 🌟 Key Platform Features

- **Editorial Luxury Storefront**:
  - Warm Ivory & Champagne Gold design system with Cormorant Garamond & Inter typography.
  - Interactive discovery quiz (**Fragrance Finder**) recommending bespoke scents based on personal preferences.
  - Curated collection pages (Woody, Floral, Fresh, Amber, Best Sellers, New Arrivals) with editorial storytelling.
  - Dynamic Product Detail Pages (PDP) with high-res zoomable gallery, olfactory pyramids (top, heart, base notes), and 2ml sample guarantee.
  - Slide-out persistent Shopping Bag drawer with live complimentary shipping threshold calculator.
  - Client Wishlist & Save-for-Later with persistent storage.
  - Multi-step luxury checkout flow with sample selection, address autofill, and order confirmation.
  - Client Account Portal with order history, printable invoice viewer, address book, and submitted impressions.

- **Verified Reviews & Rating Engine**:
  - Automatic verified purchase detection cross-referencing completed customer orders in the database.
  - Star ratings, 5-star distribution breakdowns, helpful voting, and community report flags.
  - Integrated customer impression management in account portal.

- **Promotional Campaigns & Coupons**:
  - Support for percentage-based, fixed-amount, minimum order spend, and per-customer usage limits.
  - Server-side price recalculation preventing cart tampering.

- **Executive Admin Dashboard (`/admin`)**:
  - Secure session-based administrative authentication.
  - Full catalog and product management with real-time inventory adjustments and audit logs.
  - Orders monitoring, courier dispatch status updates, and customer lifetime spend tiers.
  - Review moderation dashboard (Approve, Reject, Flagged review inspection with curator notes).
  - Promotional campaign & coupon code manager.

- **SEO, Performance & Security**:
  - Dynamic XML Sitemap (`/sitemap.xml`) and Crawler Control (`/robots.txt`).
  - Schema.org JSON-LD structured data (`Organization`, `WebSite`, `Product`, `CollectionPage`, `BreadcrumbList`).
  - Strict Content-Security-Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
  - Optimized for Core Web Vitals (LCP image priority, fixed aspect ratios preventing CLS, zero layout shift).
  - Comprehensive GA4/GTM analytics dispatcher (`lib/analytics.ts`).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2 (App Router, Server & Client Components)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4 with custom luxury tokens
- **Typography**: `@next/font/google` (Cormorant Garamond & Inter)
- **Icons**: Lucide React
- **Data Architecture**: Centralized typed catalog & persistent server-side JSON store with atomic file writes

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ or Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/chandabbasjoiya121450-beep/perfumesite.git
cd perfumesite

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Run production build
npm run build

# Start production server
npm start
```

---

## 🧪 Test Verification

Run the automated verification test suites:

```bash
# Verify Coupons & Promotions
node scripts/verify-module15.mjs

# Verify Reviews & Ratings
node scripts/verify-module16.mjs

# Verify SEO & Structured Data
node scripts/verify-module17.mjs

# Run Full End-to-End Suite (35 scenarios)
node scripts/verify-all-modules.mjs
```

---

## 📄 License & Attribution

Designed and developed for **VELORÉ Haute Parfumerie**. All rights reserved.
