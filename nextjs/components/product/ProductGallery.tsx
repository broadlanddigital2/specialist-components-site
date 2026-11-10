"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "./types";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <section aria-label="Product images" className="min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-neutral-100 md:aspect-4/3">
        {current && (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt ?? name}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="animate-in fade-in object-cover duration-200"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-2.5 flex gap-2.5 overflow-x-auto p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square flex-[0_0_72px] cursor-pointer overflow-hidden rounded-xl border-2 bg-neutral-100 transition md:basis-23 ${
                i === active ? "border-secondary opacity-100" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="92px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
