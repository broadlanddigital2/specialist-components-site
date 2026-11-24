"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { CategoryTile } from "./types";

type Props = {
  tiles: CategoryTile[];
  eyebrow?: string;
  title: string;
  /** Right-hand slot in the heading, e.g. a count or an "All categories" link. */
  aside?: React.ReactNode;
  id?: string;
  /** Show 01, 02… tags on the cards. */
  numbered?: boolean;
};

/**
 * Photo-led category cards used for sub categories and the homepage category blocks.
 * Layout adapts to the count: 5+ = bento (first card large), 4 = even row, 3 = three tall cards.
 * Phones: two columns, first card full width.
 */
export function CategoryGrid({ tiles, eyebrow, title, aside, id, numbered = true }: Props) {
  const n = tiles.length;
  const layout = n >= 5 ? "bento" : n === 4 ? "four" : "three";
  const grid = {
    bento: "md:grid-cols-3 lg:grid-cols-4",
    four: "md:grid-cols-2 lg:grid-cols-4",
    three: "md:grid-cols-3",
  }[layout];
  const headingId = `${id ?? "cat"}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="mx-auto my-10 max-w-350 px-4 md:my-16 md:px-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="text-xs font-black tracking-widest text-brand-orange uppercase">{eyebrow}</p>}
          <h2 id={headingId} className="mt-1.5 text-[26px] leading-tight font-black tracking-tight md:text-[34px]">{title}</h2>
        </div>
        {aside && <div className="flex-none">{aside}</div>}
      </div>
      <ul role="list" className={`grid grid-flow-dense grid-cols-2 gap-3 md:gap-4 lg:gap-5 ${grid}`}>
        {tiles.map((t, i) => {
          const feature = i === 0 && (layout === "bento" || layout === "three");
          const featureCls =
            layout === "bento" ? "col-span-2 md:row-span-2" : layout === "three" && feature ? "col-span-2 md:col-span-1" : "";
          const aspect =
            layout === "bento" && feature
              ? "aspect-video md:aspect-auto md:h-full"
              : layout === "three"
                ? feature ? "aspect-video md:aspect-[4/5] lg:aspect-[4/3]" : "aspect-square md:aspect-[4/5] lg:aspect-[4/3]"
                : "aspect-square";
          return (
            <li key={t.href} className={`flex min-h-0 ${featureCls}`}>
              <Card tile={t} index={i} aspect={aspect} big={layout === "bento" && feature} numbered={numbered} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Card({ tile, index, aspect, big, numbered }: { tile: CategoryTile; index: number; aspect: string; big: boolean; numbered: boolean }) {
  const [broken, setBroken] = useState(!tile.image);
  return (
    <Link
      href={tile.href}
      className={`group relative isolate block w-full overflow-hidden rounded-[18px] bg-[#1a1a1a] text-white transition duration-300 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-orange pointer-fine:hover:-translate-y-1 pointer-fine:hover:shadow-[0_18px_36px_-18px_rgb(0_0_0/0.45)] ${aspect}`}
    >
      {!broken ? (
        <Image
          src={tile.image!}
          alt=""
          fill
          sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
          onError={() => setBroken(true)}
          className="object-cover transition-transform duration-600 ease-[cubic-bezier(.2,.7,.2,1)] pointer-fine:group-hover:scale-[1.07] motion-reduce:transition-none"
        />
      ) : (
        <span aria-hidden className="absolute inset-0 bg-[url('/logo.webp')] bg-[length:72px] bg-[position:center_40%] bg-no-repeat" />
      )}
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(0_0_0/0.67)_75%,rgb(0_0_0/0.85))]" />
      {numbered && (
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.25 py-1 text-[11px] font-black tracking-wider text-secondary md:top-4 md:left-4">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2.5 p-3 md:py-4.5 md:pr-4.5 md:pl-5">
        <span
          className={`relative pb-1.5 leading-tight font-black text-balance after:absolute after:bottom-0 after:left-0 after:h-0.75 after:w-7 after:rounded-full after:bg-brand-orange after:transition-[width] after:duration-350 pointer-fine:group-hover:after:w-full ${
            big ? "text-xl md:max-w-[22ch] md:text-[28px]" : "text-[13px] md:text-[17px]"
          }`}
        >
          {tile.name}
        </span>
        <span
          aria-hidden
          className="grid size-7.5 flex-none place-items-center rounded-full bg-brand-orange text-white transition duration-300 md:size-10.5 pointer-fine:group-hover:translate-x-0.75 pointer-fine:group-hover:-rotate-45 pointer-fine:group-hover:bg-white pointer-fine:group-hover:text-brand-orange"
        >
          <ArrowRight className="size-4 md:size-4.5" strokeWidth={2.5} />
        </span>
      </span>
    </Link>
  );
}
