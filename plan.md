# ACEMEN Platform Enhancement Plan
> Version 1.0 — Prepared 28 September 2026
> Scope: UI overhaul + full taxonomy restructure (subcategories, Top Selling, New Arrivals)

---

## Status of Current System

| Layer | Status |
|---|---|
| Categories | 5 flat top-level categories (Jackets, Shoes, Bags, Wallets, Belts) |
| Shoes subcategories | **None** — all shoes lumped under `cat-shoes` |
| Bags subcategories | **None** — all bags lumped under `cat-bags` |
| Top Selling | Merchandising flag (`isTopSelling`) exists but has **no dedicated browse page** |
| New Arrivals | Merchandising flag (`isNewArrival`) exists but has **no dedicated browse page** |
| Homepage sections | Hero + 4-product grid + editorial break + accessories |
| Collection PLP | Single flat grid with filter dropdowns, no subcategory navigation |
| Admin categories | Categories managed in DB via seed; no in-admin CRUD UI yet |

---

## Phase 1 — Taxonomy Restructure (Database + Seed)

### 1.1 New Category Schema
The current flat `Category` table already supports everything. We add more rows — no migration required.

#### Shoe Sub-Categories (NEW)
| id | name | slug | priority |
|---|---|---|---|
| `cat-shoes-oxford` | Oxford Shoes | `shoes-oxford` | 89 |
| `cat-shoes-chelsea` | Chelsea Boots | `shoes-chelsea` | 88 |
| `cat-shoes-derby` | Derby Shoes | `shoes-derby` | 87 |
| `cat-shoes-loafer` | Loafers | `shoes-loafer` | 86 |
| `cat-shoes-monk` | Monk Straps | `shoes-monk` | 85 |
| `cat-shoes-boots` | Dress Boots | `shoes-boots` | 84 |

#### Bag Sub-Categories (NEW)
| id | name | slug | priority |
|---|---|---|---|
| `cat-bags-laptop` | Laptop Bags and Briefcases | `bags-laptop` | 79 |
| `cat-bags-handbag` | Handbags and Totes | `bags-handbag` | 78 |
| `cat-bags-weekender` | Weekender and Duffel | `bags-weekender` | 77 |
| `cat-bags-backpack` | Backpacks | `bags-backpack` | 76 |
| `cat-bags-messenger` | Messenger Bags | `bags-messenger` | 75 |

#### Merchandising Virtual Routes (NOT new DB categories)
These call the existing API with query params — no new DB rows needed.

| Route | Title | API Query |
|---|---|---|
| `/collection/top-selling` | Top Selling | `GET /api/products?topSelling=true` |
| `/collection/new-arrivals` | New Arrivals | `GET /api/products?newArrival=true` |

### 1.2 Implementation Steps
1. Update `prisma/seed.ts` — upsert all new subcategory rows (safe to re-run)
2. Update `src/lib/data.ts` — add `INITIAL_SUBCATEGORIES` for SSR fallback
3. Re-assign existing products in seed: Oxford -> `cat-shoes-oxford`, Chelsea -> `cat-shoes-chelsea`, Duffel -> `cat-bags-weekender`
4. Run `npx prisma db seed`

**Effort: ~2h**

---

## Phase 2 — Navigation Mega-Menu

### 2.1 Hover Mega-Panel for Shoes and Bags
Replace flat nav links with a hover mega-menu:

`
ACEMEN [center logo]

JACKETS  SHOES  BAGS  WALLETS          SEARCH  BAG(0)
         |
    All Shoes     Oxford     Chelsea
    Derby         Loafers    Monk Straps
    Dress Boots
    ─────────────────────────────────
    TOP SELLING   NEW ARRIVALS
`

- Desktop: hover-activated dropdown panel
- Mobile: accordion inside the existing drawer
- Top Selling and New Arrivals promoted as quick-access links in every panel

**Files to edit:** `src/components/Navbar.tsx`
**Effort: ~3h**

### 2.2 Footer Link Update
Add subcategory links under Shoes and Bags columns in the footer.

---

## Phase 3 — Homepage Enhancement

### 3.1 Top Selling Row (NEW section — after hero)
`
TOP SELLING                      [View All Top Selling ->]
─────────────────────────────────────────────────────────
[Card BESTSELLER]  [Card]  [Card]  [Card]
`
Fetches: `GET /api/products?topSelling=true`
Mobile: horizontal scroll. Desktop: 4-column grid.

### 3.2 New Arrivals Row (NEW section — before accessories)
`
NEW ARRIVALS AW/26               [View All New Arrivals ->]
─────────────────────────────────────────────────────────
[Card NEW]  [Card NEW]  [Card]  [Card]
`
Fetches: `GET /api/products?newArrival=true`

### 3.3 Shop by Category Tile Grid (NEW section)
`
SHOP BY CATEGORY
─────────────────────────────────────────────────────────
[Leather Jackets]  [Oxford Shoes]  [Chelsea Boots]
[Laptop Bags]      [Handbags]      [Wallets & SLG]
`
Each tile: real ACEMEN product photo, category name, hover zoom.
Links to `/collection/[slug]`.

### 3.4 Revised Homepage Section Order
1. Cinematic Hero (no change)
2. Top Selling row  (NEW)
3. Editorial Craft Break (no change)
4. Signature Allocations / Permanent Collection grid (no change)
5. New Arrivals row  (NEW)
6. Shop by Category tile grid  (NEW)
7. Accessories (existing, 2-col)

**Files to edit:** `src/app/page.tsx`
**Effort: ~4h**

---

## Phase 4 — Collection PLP Enhancement

### 4.1 Subcategory Pill Tab Strip
When on `/collection/shoes`, show tabs:
`
[ All Shoes ] [ Oxford ] [ Chelsea ] [ Derby ] [ Loafers ] [ Monk ] [ Boots ]
`
Active tab: bottom border underline. Clicking navigates to `/collection/shoes-oxford` etc.

When on `/collection/bags`:
`
[ All Bags ] [ Laptop / Briefcase ] [ Handbags ] [ Weekender ] [ Backpacks ] [ Messenger ]
`

### 4.2 Top Selling and New Arrivals PLP Routes
In `[slug]/page.tsx` detect these virtual slugs:
- `top-selling` -> fetch `?topSelling=true`, set title "Top Selling"
- `new-arrivals` -> fetch `?newArrival=true`, set title "New Arrivals"
No new route files needed.

### 4.3 Subcategory Breadcrumbs
`Home / Collections / Shoes / Oxford Shoes`

**Files to edit:** `src/app/collection/[slug]/page.tsx`
**Effort: ~3h**

---

## Phase 5 — Product Card Badges

### 5.1 Badge Overlays
`
┌────────────────────┐
│ NEW                │  <- amber pill, top-left, when isNewArrival
│ BESTSELLER         │  <- dark pill, top-left, when isTopSelling
│   [product image]  │
└────────────────────┘
`

Rules:
- If both flags set: show only NEW (takes precedence)
- Badges are small (`text-[9px] font-mono uppercase`) — non-intrusive

**Files to edit:** `src/components/ProductCard.tsx`
**Effort: ~1h**

---

## Phase 6 — Admin Category CRUD

### 6.1 `/admin/categories` Page
- List all categories: name, slug, priority, active status, product count
- Inline toggle active/inactive
- Add new category (with optional parent for subcategories)
- Edit name, description, display priority

### 6.2 New API Endpoints
- `POST /api/categories` — create
- `PUT /api/categories/[id]` — update
- `DELETE /api/categories/[id]` — soft-deactivate (sets `isActive = false`)

**New files:**
- `src/app/admin/categories/page.tsx`
- `src/app/api/categories/[id]/route.ts`

**Effort: ~3h**

---

## Phase 7 — Visual Refinements

### 7.1 Typography Standards
- Hero h1: `font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[1.05]`
- Section h2: `font-serif text-3xl font-light uppercase tracking-wide`
- Body: `text-sm text-[#767676] leading-relaxed`
- Mono labels: `text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676]`

### 7.2 Spacing System
- All sections: `py-16 sm:py-24`
- All containers: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card gaps: `gap-4 sm:gap-6`

### 7.3 Product Image Aspect Ratio
Enforce `aspect-[3/4]` on all product card images for visual consistency.

### 7.4 Micro-Animations
`
Card hover: image scale 1.03, transition 300ms ease-out
CTA arrows: translateX(4px) on group-hover
Nav links: underline scaleX 0->1 on hover
`

No glassmorphism, no neon, no gradients — ACEMEN restraint preserved.

### 7.5 Sticky Mobile Add-to-Bag Bar (PDP)
When user scrolls past the product form on mobile, show a sticky bottom bar:
`
[ The Sovereign Biker Jacket — 40R ]     [ ADD TO BAG — £1,850 ]
`

**Files to edit:** `src/app/products/[slug]/page.tsx`
**Effort: ~3h total for Phase 7**

---

## Implementation Sequence

| # | Phase | Effort | Priority |
|---|---|---|---|
| 1 | Taxonomy (seed + data.ts) | 2h | CRITICAL — unlocks all routing |
| 2 | Navbar mega-menu | 3h | CRITICAL — highest UX impact |
| 3 | Homepage Top Selling + New Arrivals + Category Grid | 4h | HIGH |
| 4 | PLP subcategory tabs + virtual routes | 3h | HIGH |
| 5 | Product card badges | 1h | MEDIUM |
| 7 | Visual refinements | 3h | MEDIUM |
| 6 | Admin category CRUD | 3h | LOW (nice to have) |

**Total: ~19h**

---

## File Change Map

| File | What Changes |
|---|---|
| `prisma/seed.ts` | Add 11 new subcategory upserts |
| `src/lib/data.ts` | Add `INITIAL_SUBCATEGORIES` constant |
| `src/components/Navbar.tsx` | Mega-menu with shoe/bag subcategory panels |
| `src/app/page.tsx` | Top Selling row + New Arrivals row + Category tiles |
| `src/app/collection/[slug]/page.tsx` | Subcategory pills + virtual slugs + breadcrumbs |
| `src/components/ProductCard.tsx` | NEW / BESTSELLER badge overlay |
| `src/app/products/[slug]/page.tsx` | Sticky mobile add-to-bag bar |
| `src/app/admin/categories/page.tsx` | NEW - category CRUD |
| `src/app/api/categories/route.ts` | Add POST handler |
| `src/app/api/categories/[id]/route.ts` | NEW - PUT + DELETE |

---

## Constraints (Do Not Violate)

- No stock images or placeholder images — category tiles use real ACEMEN product photos only
- Do not break `/collection/leather-jackets`, `/collection/shoes`, or `/collection/bags`
- `cat-shoes` parent category stays in DB — subcategories are additions, not replacements
- Top Selling and New Arrivals are virtual routes (API filter) — not real DB category rows
- Cart, checkout, Stripe, auth — untouched
- No glassmorphism, no neon, no gradients, no excessive shadows
