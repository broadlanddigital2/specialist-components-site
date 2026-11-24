# Specialist Components: redesigned components for the Next.js app

These are drop-in React components for the redesign work done on the static demo
(https://specialist-components-site.justin-b8f.workers.dev). They're written against the existing app's stack: Next.js App Router, Tailwind v4 with the site's tokens, `next/image`, `next/link` and `lucide-react`.

| File | What it is | Demo |
| --- | --- | --- |
| `components/product/ProductCard.tsx` | `ProductCard` and `ProductCardRow`: the homepage product cards with the large price | Homepage product rows |
| `components/product/ProductPage.tsx` | Full product page: breadcrumb, gallery, buy box and tabs | `/shop/sc-ecu-usb-can-pc-interface.html` |
| `components/product/ProductGallery.tsx` | Main image with thumbnail switcher (client) | |
| `components/product/ProductBuyBox.tsx` | Title, SKU, stock, large price (inc/ex VAT), option dropdowns, quantity box, Add to basket, mobile sticky bar (client) | |
| `components/product/ProductTabs.tsx` | Description / Tech spec / Video / FAQs in the light grey panel (client) | |
| `components/product/types.ts` | `Product`, `ProductOption`, `ProductSummary`, etc. | |
| `components/home/NewsSection.tsx` | `NewsSection` and `NewsCard` | Latest news section |
| `components/contact/GetInTouch.tsx` | Dark info panel plus labelled form (client) | Get in touch section |
| `components/product/ProductGrid.tsx` | Responsive grid of product cards for listing pages (2 columns on phones, 4 on desktop) | Category pages, search results |
| `components/category/CategoryGrid.tsx` | Image cards for categories or sub categories: bento layout at 5+, even row at 4, tall cards at 3 (client) | Homepage "Browse", category pages |
| `components/category/CategoryFaq.tsx` | FAQ accordion in a grey panel with call button, plus FAQPage JSON-LD | Bottom of each category page |
| `components/category/types.ts` | `Category`, `SubCategory`, `CategoryTile`, `Faq` | |
| `components/nav/MegaMenu.tsx` | Desktop mega menu: categories on the left, sub categories or products on the right, help card. Hover, click and keyboard (client) | Header "Categories" |
| `components/nav/MobileCategoryMenu.tsx` | Categories for the mobile menu: open by default, expandable sub categories (client) | Burger menu |
| `components/search/SiteSearch.tsx` | Header search button and dialog: live results with photo, SKU, price and stock; popular searches; `/` and Ctrl/Cmd+K (client) | Search icon |
| `components/search/SearchResults.tsx` | Full results page body with search form and product grid | `/search?q=` |
| `lib/faq.ts` | `buildCategoryFaqs()`: builds category FAQs from the range, prices and stock | |
| `lib/search.ts` | `SearchItem` type, `prepareIndex`, `searchIndex` (ranking), `highlight` | |
| `data/categories.ts` | The current category tree (7 top level, 21 sub categories) | |
| `lib/format.ts` | `formatPrice`, `priceParts`, `exVat` | |
| `examples/ecu-product.ts` | Example `Product` data for the ECU interface | |

## Install

1. Copy `components/` and `lib/` into the app. The imports use the `@/` alias; adjust them if the app uses a different one.
2. These need to be dependencies in the app (they already appear in the current build):
   - `lucide-react`
   - Tailwind v4
3. The components expect these Tailwind tokens, which the current app already defines in its CSS:
   - Colours: `brand-orange` (#fe5c3a), `brand-blue` (#305281), `secondary` (#000), `grey` (#707070)
   - Variants and sizes: the `pointer-fine:` variant and `max-w-350`
4. `next.config` must already allow `api.specialist-components.co.uk` under `images.remotePatterns`, as the current site does.

## Usage

```tsx
// app/shop/[slug]/page.tsx
import { ProductPage } from "@/components/product/ProductPage";
import { getProduct } from "@/lib/api"; // your existing data fetcher

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug); // map API data to the Product type
  return <ProductPage product={product} />;
}
```

```tsx
// Homepage
<ProductCardRow products={products.map(p => ({ name: p.name, price: p.price, href: `/shop/${p.slug}.html`, image: p.image }))} />
<NewsSection items={news.map(n => ({ title: n.title, href: `/news/${n.slug}`, image: n.image, imageAlt: n.imageAlt }))} />
<GetInTouch onSubmit={submitContact} />
```

### Wiring it up

- **Basket:** `ProductBuyBox` takes `onAddToBasket({ sku, options, quantity, unitPrice })`. Pass it through from `ProductPage` or wrap it with your basket context. The button is disabled when `inStock` is false.
- **Options:** configurable products pass `options`, each value with an optional `priceDelta` (inc VAT) that is added to the base price. Simple products leave `options` out and no dropdowns appear.
- **Tabs:** Tech spec and FAQs tabs are hidden when there's no data for them. Video shows a "Coming soon" panel until `videoUrl` is set (use a YouTube `-nocookie` or Vimeo embed URL).
- **Contact form:** `GetInTouch` passes `FormData` to `onSubmit`, so the existing handler or a server action can take it unchanged. The field names match the current form: `name`, `email`, `phone`, `enquiry_type`, `message`.

## Navigation, categories and search

```tsx
// Header (desktop)
import { MegaMenu } from "@/components/nav/MegaMenu";
import { SiteSearch } from "@/components/search/SiteSearch";
import { categories } from "@/data/categories"; // or build from the API

<MegaMenu categories={categories} productsByCategory={{ "/shop/category/ecus": ecuProducts }} />
<SiteSearch quickLinks={categories.map(c => ({ name: c.name, href: c.href }))} />

// Mobile menu
<MobileCategoryMenu categories={categories} onNavigate={closeMenu} />
```

```tsx
// app/shop/category/[slug]/page.tsx
const cat = await getCategory(slug);
const faqs = buildCategoryFaqs({ name: cat.name, subcategories: cat.subcategories.map(s => s.name), products: cat.products });

{cat.subcategories.length > 0 && (
  <CategoryGrid eyebrow="Browse" title={`${cat.name} categories`} tiles={cat.subcategories} />
)}
<ProductGrid products={cat.products} />
<CategoryFaq faqs={faqs} title={`${cat.name}: common questions`} />
```

```tsx
// app/search/page.tsx
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <SearchResults query={q} items={await getSearchIndex()} />;
}
```

### Data to build from the API

- **Categories:** `data/categories.ts` holds today's tree with demo image paths. Build the same `Category[]` shape from the API so new categories appear automatically, and use the API image URLs.
- **Search index:** `SiteSearch` loads `/search-index.json` by default, once, on first hover or open. Serve a `SearchItem[]` from a route handler (e.g. `app/search-index.json/route.ts`, cached and revalidated when products change), or pass your own `loadIndex`. Each item: `type` (`product` | `category` | `page`), `name`, `url`, plus optional `sku`, `price`, `image`, `category`, `stock` (`in` | `out`). For a large catalogue, swap `loadIndex` and `SearchResults` for an API search endpoint; the UI doesn't change.
- **Category FAQs:** `buildCategoryFaqs` only states what the data shows (range, price range, stock) plus the published phone, email, hours and delivery details. Add category-specific answers through `extra`. See `docs/FAQ-QUESTIONS-FOR-CLIENT.md` in the repo for the questions only the client can answer.
- **Other UI that opens search:** `window.dispatchEvent(new CustomEvent("open-site-search", { detail: "query" }))`.

## Hero banner (shorter)

No new component is needed, just class changes on the existing hero slide:

```diff
- className="relative h-120 w-full shrink-0 snap-start md:h-140 xl:h-180"
+ className="relative h-100 w-full shrink-0 snap-start md:h-110 xl:h-130"
```
and on the slide's inner container: `md:pt-18` → `md:pt-12`.

## Before going live

`examples/ecu-product.ts` marks the sample content. That's the two option dropdowns and three spec rows (operating system, dimensions, weight); everything else comes from the current product page. Swap the sample content for real product data.
