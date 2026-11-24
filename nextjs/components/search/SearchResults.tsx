import Link from "next/link";
import { Search } from "lucide-react";
import { prepareIndex, searchIndex, type SearchItem } from "@/lib/search";
import { ProductGrid } from "@/components/product/ProductGrid";

/**
 * Full search results page body. Server component: pass the query (from searchParams)
 * and the index items. The form submits back to the same page with ?q=.
 *
 *   // app/search/page.tsx
 *   export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
 *     const { q = "" } = await searchParams;
 *     return <SearchResults query={q} items={await getSearchIndex()} />;
 *   }
 */
export function SearchResults({ query, items, action = "/search" }: { query: string; items: SearchItem[]; action?: string }) {
  const q = query.trim();
  const all = q ? searchIndex(prepareIndex(items), q) : [];
  const products = all.filter((r) => r.type === "product");
  const cats = all.filter((r) => r.type !== "product");

  return (
    <section className="mx-auto mt-8 mb-16 max-w-350 px-4 md:mt-12 md:mb-20 md:px-6">
      <div className="mb-6 grid gap-3.5">
        <h1 className="text-[28px] leading-tight font-black md:text-4xl">Search</h1>
        <form action={action} role="search" className="flex max-w-160 gap-2.5">
          <label className="flex h-13.5 flex-1 items-center gap-2.5 rounded-[14px] border-2 border-secondary bg-white px-3.5 focus-within:border-brand-orange">
            <Search aria-hidden className="size-5 flex-none" />
            <input type="search" name="q" defaultValue={q} placeholder="Search parts, SKUs or categories" aria-label="Search" className="h-full min-w-0 flex-1 border-0 bg-transparent text-[17px] font-semibold outline-0" />
          </label>
          <button type="submit" className="h-13.5 flex-none cursor-pointer rounded-[14px] bg-brand-orange px-5.5 text-[13px] font-black tracking-wide text-white uppercase">
            Search
          </button>
        </form>
        {q && (
          <p className="text-sm font-bold text-grey">
            {products.length} product{products.length === 1 ? "" : "s"} for “{q}”
          </p>
        )}
      </div>

      {!q ? (
        <p className="text-grey">Type a part name, SKU or category above.</p>
      ) : (
        <>
          {cats.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {cats.map((c) => (
                <Link key={c.url} href={c.url} className="rounded-full border border-[#ffd9cf] bg-[#fff4f1] px-3.5 py-2 text-sm font-bold text-[#b8391c] transition hover:bg-brand-orange hover:text-white">
                  {c.name}
                </Link>
              ))}
            </div>
          )}
          {products.length ? (
            <ProductGrid products={products.map((p) => ({ name: p.name, price: p.price ?? 0, href: p.url, image: p.image ?? "/placeholder.png" }))} />
          ) : (
            <div className="grid gap-3 py-5 text-[15px] leading-normal text-[#444]">
              <p className="text-lg font-black text-secondary">No products found</p>
              <p>
                Try a different spelling or a part number, or call us on{" "}
                <a href="tel:+441953789311" className="font-bold text-brand-blue underline">+44 (0)1953 789311</a>.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
