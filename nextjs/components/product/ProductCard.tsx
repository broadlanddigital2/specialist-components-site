import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice, priceParts } from "@/lib/format";
import type { ProductSummary } from "./types";

/** Homepage / listing product card: large price, clean bordered card, always-visible arrow. */
export function ProductCard({ product }: { product: ProductSummary }) {
  const p = priceParts(product.price);
  return (
    <Link
      href={product.href}
      aria-label={`${product.name}, ${formatPrice(product.price)}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-secondary transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue pointer-fine:hover:-translate-y-0.75 pointer-fine:hover:border-neutral-300 pointer-fine:hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.2)]"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 44vw, 72vw"
          className="object-cover transition-transform duration-500 pointer-fine:group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3.5 px-4 pt-4 pb-4.5 md:px-5 md:pt-4.5 md:pb-5">
        <h3 className="line-clamp-2 min-h-[2.7em] text-[15px] leading-snug font-bold">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-3">
          <p className="text-[26px] leading-none font-black tracking-tight whitespace-nowrap md:text-3xl">
            <span className="mr-px align-[0.45em] text-[0.6em] font-extrabold">{p.currency}</span>
            {p.pounds}
            <span className="text-[0.55em] font-extrabold text-grey">{p.pence}</span>
          </p>
          <span
            aria-hidden="true"
            className="grid size-10 flex-none place-items-center rounded-full bg-brand-orange text-white transition duration-300 pointer-fine:group-hover:translate-x-0.5 pointer-fine:group-hover:bg-brand-blue"
          >
            <ArrowRight className="size-4.5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Swipe row on mobile (next card peeks in), 4-column grid from lg. */
export function ProductCardRow({ products }: { products: ProductSummary[] }) {
  return (
    <ul
      role="list"
      className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pt-1 pb-3 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {products.map((product) => (
        <li key={product.href} className="flex flex-[0_0_72%] snap-start sm:basis-[44%] lg:flex-none">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
