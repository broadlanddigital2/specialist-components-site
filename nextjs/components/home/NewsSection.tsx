import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type NewsItem = { title: string; href: string; image: string; imageAlt?: string; tag?: string };

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={item.href}
      className="group flex w-full flex-col overflow-hidden rounded-[18px] border border-neutral-200 bg-white transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue pointer-fine:hover:-translate-y-0.75 pointer-fine:hover:border-neutral-300 pointer-fine:hover:shadow-[0_14px_30px_-14px_rgb(0_0_0/0.2)]"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-[#f4f4f4]">
        <Image
          src={item.image}
          alt={item.imageAlt ?? ""}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 48vw, 82vw"
          className="object-cover transition-transform duration-500 pointer-fine:group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col items-start gap-2.5 px-5 pt-4.5 pb-5">
        <span className="rounded-full bg-[#f4f4f4] px-2.5 py-0.75 text-[11px] font-extrabold tracking-wider uppercase">
          {item.tag ?? "News"}
        </span>
        <h3 className="line-clamp-2 text-lg leading-snug font-black first-letter:uppercase">{item.title}</h3>
        <span className="mt-auto inline-flex items-center gap-2 pt-1.5 text-[13px] font-black tracking-wide text-brand-orange uppercase">
          Read more
          <ArrowRight className="size-4 transition-transform duration-250 pointer-fine:group-hover:translate-x-0.75" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}

export function NewsSection({ items, title = "Latest news from Specialist Components" }: { items: NewsItem[]; title?: string }) {
  return (
    <section aria-labelledby="news-heading" className="mx-auto my-12 max-w-350 px-4 md:my-20 md:px-6">
      <div className="mb-6">
        <p className="text-xs font-black tracking-widest text-brand-orange uppercase">From the workshop</p>
        <h2 id="news-heading" className="mt-1.5 text-[26px] leading-tight font-black tracking-tight md:text-[34px]">{title}</h2>
      </div>
      <ul
        role="list"
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pt-1 pb-3 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li key={item.href} className="flex flex-[0_0_82%] snap-start sm:basis-[48%] lg:flex-none">
            <NewsCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
