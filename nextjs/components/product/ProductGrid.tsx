import { ProductCard } from "./ProductCard";
import type { ProductSummary } from "./types";

/** Product listing grid for category / sub category pages and related products: 2 / 3 / 4 columns. */
export function ProductGrid({ products, className = "" }: { products: ProductSummary[]; className?: string }) {
  return (
    <ul role="list" className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6 ${className}`}>
      {products.map((p) => (
        <li key={p.href} className="flex min-w-0">
          <ProductCard product={p} compactOnMobile />
        </li>
      ))}
    </ul>
  );
}
