import Link from "next/link";
import { ProductBuyBox } from "./ProductBuyBox";
import { ProductGallery } from "./ProductGallery";
import { ProductTabs } from "./ProductTabs";
import type { Product } from "./types";

/**
 * Full product detail layout: breadcrumb, gallery + buy box, then the tabbed info panel.
 * Server component; the interactive parts are client components.
 */
export function ProductPage({ product }: { product: Product }) {
  return (
    <div className="mx-auto max-w-350 px-4 pt-4 pb-10 md:px-6 md:pt-6 md:pb-16">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap gap-1.5 text-xs text-grey">
        <Link href="/" className="hover:text-brand-orange">Home</Link>
        <span aria-hidden>/</span>
        {product.category && (
          <>
            <Link href={product.category.href} className="hover:text-brand-orange">{product.category.name}</Link>
            <span aria-hidden>/</span>
          </>
        )}
        <span aria-current="page" className="font-bold text-secondary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />
        <ProductBuyBox product={product} />
      </div>

      <ProductTabs product={product} />
    </div>
  );
}
