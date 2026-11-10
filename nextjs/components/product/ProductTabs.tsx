"use client";

import { Play } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { Product } from "./types";

type TabKey = "description" | "specs" | "video" | "faqs";

/** Description / Tech spec / Video / FAQs in a light grey panel. Tabs with no content are hidden. */
export function ProductTabs({ product }: { product: Product }) {
  const id = useId();
  const tabs = (
    [
      ["description", "Description", true],
      ["specs", "Tech spec", !!product.specs?.length],
      ["video", "Video", true],
      ["faqs", "FAQs", !!product.faqs?.length],
    ] as const
  ).filter(([, , show]) => show);

  const [active, setActive] = useState<TabKey>(tabs[0][0]);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = tabs[(i + d + tabs.length) % tabs.length][0];
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <section aria-label="Product information" className="mt-12 rounded-[20px] bg-[#f4f4f4] px-3 pt-2 pb-5 md:mt-18 md:rounded-3xl md:px-8 md:pt-3 md:pb-9">
      <div role="tablist" className="flex gap-1.5 overflow-x-auto border-b border-[#e2e2e2] pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(([key, label], i) => (
          <button
            key={key}
            ref={(el) => { refs.current[key] = el; }}
            role="tab"
            id={`${id}-tab-${key}`}
            aria-controls={`${id}-panel-${key}`}
            aria-selected={active === key}
            tabIndex={active === key ? 0 : -1}
            onClick={() => setActive(key)}
            onKeyDown={(e) => onKey(e, i)}
            className={`-mb-px flex-none cursor-pointer rounded-t-xl border-b-3 px-4.5 py-3.5 text-sm font-extrabold tracking-wide uppercase ${
              active === key ? "border-brand-orange bg-white text-secondary" : "border-transparent text-grey hover:text-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tabs.map(([key]) => (
        <div key={key} role="tabpanel" id={`${id}-panel-${key}`} aria-labelledby={`${id}-tab-${key}`} hidden={active !== key} className="pt-6">
          {key === "description" && <Description product={product} />}
          {key === "specs" && <Specs product={product} />}
          {key === "video" && <Video product={product} />}
          {key === "faqs" && <Faqs product={product} />}
        </div>
      ))}
    </section>
  );
}

function Description({ product: { description: d } }: { product: Product }) {
  return (
    <div className="max-w-208 text-base leading-relaxed">
      {d.lead && <p className="text-lg leading-normal font-bold">{d.lead}</p>}
      {d.paragraphs?.map((t) => <p key={t} className="mt-3.5">{t}</p>)}
      {!!d.bullets?.length && (
        <ul className="mt-3.5 grid gap-2">
          {d.bullets.map((b) => (
            <li key={b} className="relative pl-5.5 before:absolute before:top-[0.65em] before:left-1 before:size-2 before:rounded-xs before:bg-brand-orange">
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Specs({ product }: { product: Product }) {
  return (
    <table className="w-full overflow-hidden rounded-[14px] bg-white text-[15px]">
      <tbody>
        {product.specs!.map((row) => (
          <tr key={row.label} className="even:bg-[#fafafa] [&:not(:last-child)>*]:border-b [&:not(:last-child)>*]:border-[#ececec]">
            <th scope="row" className="w-2/5 px-4 py-3.5 text-left align-top font-extrabold">{row.label}</th>
            <td className="px-4 py-3.5 align-top">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Video({ product }: { product: Product }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-[20px] bg-[#111] text-white">
      {product.videoUrl ? (
        <iframe
          src={product.videoUrl}
          title={`${product.name} video`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <div className="absolute inset-0 grid place-content-center justify-items-center gap-3.5 bg-[radial-gradient(circle_at_50%_40%,#2a3b55,#0d0d0d_70%)] text-center text-sm leading-normal">
          <span className="grid size-18 place-items-center rounded-full bg-brand-orange">
            <Play className="ml-1 size-7.5" fill="currentColor" />
          </span>
          <p><strong>Product video</strong><br />Coming soon</p>
        </div>
      )}
    </div>
  );
}

function Faqs({ product }: { product: Product }) {
  return (
    <div className="grid gap-2.5">
      {product.faqs!.map((f, i) => (
        <details key={f.question} open={i === 0} className="group rounded-[14px] border border-[#e6e6e6] bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4.5 py-4 font-extrabold [&::-webkit-details-marker]:hidden">
            {f.question}
            <span aria-hidden className="grid size-7 flex-none place-items-center rounded-full bg-[#f4f4f4] text-lg font-bold group-open:bg-brand-orange group-open:text-white">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <p className="px-4.5 pb-4.5 leading-relaxed text-[#333]">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
