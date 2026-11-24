"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { Category } from "@/components/category/types";

/**
 * The Categories block inside the mobile (burger) menu.
 * Open by default; categories with sub categories get an expand toggle,
 * and tapping a category name still goes to its page.
 * `onNavigate` lets the parent close the burger menu after a tap.
 */
export function MobileCategoryMenu({ categories, onNavigate }: { categories: Category[]; onNavigate?: () => void }) {
  const id = useId();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <details open className="group/cats">
      <summary className="flex cursor-pointer list-none items-center justify-between bg-white px-4 py-3 text-sm leading-tight font-bold uppercase group-open/cats:bg-foreground group-open/cats:text-white [&::-webkit-details-marker]:hidden">
        Categories
        <ChevronDown aria-hidden className="size-3.5 transition-transform group-open/cats:rotate-180" strokeWidth={2.5} />
      </summary>
      <ul className="grid gap-0.5 pt-1.5 pb-1">
        {categories.map((c, i) => {
          const subId = `${id}-sub-${i}`;
          const isOpen = !!expanded[c.href];
          return (
            <li key={c.href}>
              <div className="flex items-stretch rounded-xl">
                <Link href={c.href} onClick={onNavigate} className="flex-1 rounded-xl px-3 py-3.25 text-[15px] leading-snug font-extrabold active:bg-[#f4f4f4]">
                  {c.name}
                </Link>
                {c.subcategories.length > 0 && (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={subId}
                    aria-label={`${isOpen ? "Hide" : "Show"} ${c.name} sub categories`}
                    onClick={() => setExpanded((s) => ({ ...s, [c.href]: !s[c.href] }))}
                    className={`grid w-12 flex-none cursor-pointer place-items-center rounded-xl active:bg-[#f4f4f4] ${isOpen ? "text-brand-orange" : "text-grey"}`}
                  >
                    <ChevronDown aria-hidden className={`size-4.5 transition-transform ${isOpen ? "rotate-180" : ""}`} strokeWidth={2.5} />
                  </button>
                )}
              </div>
              {c.subcategories.length > 0 && (
                <ul id={subId} hidden={!isOpen} className="mb-2 ml-3 grid gap-px border-l-2 border-[#ffd9cf] pl-3">
                  {c.subcategories.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} onClick={onNavigate} className="block rounded-[10px] px-2.5 py-2.5 text-sm font-bold text-[#333] active:bg-[#f4f4f4]">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={c.href} onClick={onNavigate} className="flex items-center gap-1.5 rounded-[10px] px-2.5 py-2.5 text-xs font-black tracking-wide text-brand-orange uppercase">
                      Shop all {c.name} <ArrowRight className="size-3.5" strokeWidth={2.5} />
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
