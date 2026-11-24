"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, Phone } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { formatPrice } from "@/lib/format";
import type { Category } from "@/components/category/types";

type ProductLink = { name: string; href: string; price?: number | null };

type Props = {
  categories: Category[];
  /** Products to list for categories with no sub categories (e.g. MG, Sale), keyed by category href. */
  productsByCategory?: Record<string, ProductLink[]>;
  /** Text for empty categories (no subs, no products). */
  emptyNote?: (c: Category) => React.ReactNode;
};

/**
 * Desktop mega menu: a "Categories" trigger for the header nav.
 * Categories down the left; hovering, focusing or arrowing to one shows its sub categories
 * (or products) on the right; an engineers help card on the far right.
 * Opens on hover (mouse) or click; Esc, outside click and leaving close it.
 * Render it inside the header, which must be position: relative/fixed.
 */
export function MegaMenu({ categories, productsByCategory = {}, emptyNote }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [top, setTop] = useState(88);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const topRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openedAt = useRef(0);
  const canHover = useRef(false);

  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const show = useCallback(() => {
    clearTimeout(closeTimer.current);
    if (!open) {
      const header = triggerRef.current?.closest("header");
      if (header) setTop(header.getBoundingClientRect().bottom);
      setActive(0);
      openedAt.current = Date.now();
    }
    setOpen(true);
  }, [open]);
  const hide = useCallback((focusTrigger = false) => {
    clearTimeout(closeTimer.current);
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);
  const hideSoon = () => { closeTimer.current = setTimeout(() => hide(), 180); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") hide(true); };
    const onResize = () => { if (window.innerWidth < 1024) hide(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open, hide]);

  const onTopKey = (e: KeyboardEvent, i: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = (i + (e.key === "ArrowDown" ? 1 : -1) + categories.length) % categories.length;
      topRefs.current[n]?.focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      panelRef.current?.querySelector<HTMLAnchorElement>(`[data-pane="${i}"] [data-item]`)?.focus();
    }
  };

  const cat = categories[active];
  const products = cat ? productsByCategory[cat.href] ?? [] : [];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mega-menu"
        onClick={() => (!open ? show() : Date.now() - openedAt.current > 400 && hide())}
        onMouseEnter={() => canHover.current && show()}
        onMouseLeave={() => canHover.current && hideSoon()}
        onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); show(); requestAnimationFrame(() => topRefs.current[0]?.focus()); } }}
        className={`inline-flex cursor-pointer items-center gap-1 uppercase transition-colors duration-300 hover:text-brand-orange ${open ? "text-brand-orange" : ""}`}
      >
        Categories
        <ChevronDown aria-hidden className={`size-3.5 transition-transform duration-250 ${open ? "rotate-180" : ""}`} strokeWidth={2.5} />
      </button>

      {open && (
        <>
          <div
            id="mega-menu"
            ref={panelRef}
            onMouseEnter={() => clearTimeout(closeTimer.current)}
            onMouseLeave={() => canHover.current && hideSoon()}
            onBlur={(e) => { if (!panelRef.current?.contains(e.relatedTarget as Node) && e.relatedTarget !== triggerRef.current) hide(); }}
            className="absolute inset-x-0 top-full z-41 animate-in border-t border-[#eee] bg-white font-normal tracking-normal normal-case shadow-[0_24px_40px_-20px_rgb(0_0_0/0.27)] duration-200 fade-in slide-in-from-top-1.5"
          >
            <div className="mx-auto grid max-w-350 grid-cols-[260px_minmax(0,1fr)_230px] gap-5.5 p-6 xl:grid-cols-[300px_minmax(0,1fr)_270px] xl:gap-7">
              <nav aria-label="Categories">
                <p className="mb-2.5 ml-3.5 text-[11px] font-black tracking-widest text-grey uppercase">Categories</p>
                <ul className="grid gap-0.5">
                  {categories.map((c, i) => (
                    <li key={c.href}>
                      <Link
                        ref={(el) => { topRefs.current[i] = el; }}
                        href={c.href}
                        onMouseEnter={() => { clearTimeout(hoverTimer.current); hoverTimer.current = setTimeout(() => setActive(i), 70); }}
                        onMouseLeave={() => clearTimeout(hoverTimer.current)}
                        onFocus={() => setActive(i)}
                        onKeyDown={(e) => onTopKey(e, i)}
                        className={`relative flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-3 text-[15px] font-extrabold transition-colors focus-visible:outline-none ${
                          i === active
                            ? "bg-[#fff4f1] text-[#b8391c] before:absolute before:inset-y-2.5 before:left-0 before:w-0.75 before:rounded-full before:bg-brand-orange"
                            : "text-secondary hover:bg-[#f6f6f6] focus-visible:bg-[#f6f6f6]"
                        }`}
                      >
                        {c.name}
                        <ChevronRight aria-hidden className={`size-4 transition ${i === active ? "translate-x-0.75 text-brand-orange" : "text-[#bbb]"}`} strokeWidth={2.5} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {cat && (
                <div
                  key={cat.href}
                  data-pane={active}
                  className="min-h-80 animate-in border-l border-[#eee] pl-5.5 duration-200 fade-in xl:pl-7"
                  onKeyDown={(e) => { if (e.key === "ArrowLeft") { e.preventDefault(); topRefs.current[active]?.focus(); } }}
                >
                  <div className="mb-3 flex items-end justify-between gap-4 border-b border-[#eee] pb-3.5">
                    <div>
                      <p className="text-[22px] leading-tight font-black">{cat.name}</p>
                      <p className="mt-0.75 text-xs font-bold tracking-wide text-grey uppercase">
                        {cat.subcategories.length ? `${cat.subcategories.length} ranges` : products.length ? `${products.length} products` : ""}
                      </p>
                    </div>
                    <Link href={cat.href} className="inline-flex flex-none items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-xs font-black tracking-wide text-white uppercase transition hover:bg-brand-orange">
                      Shop all <ArrowRight className="size-3.5" strokeWidth={2.5} />
                    </Link>
                  </div>

                  {cat.subcategories.length ? (
                    <ul className="grid grid-cols-2 gap-x-5 gap-y-0.5">
                      {cat.subcategories.map((s) => (
                        <li key={s.href}>
                          <Link data-item href={s.href} className="group/l flex items-center justify-between gap-2.5 rounded-[10px] px-3 py-2.75 text-[15px] leading-snug font-bold transition-colors hover:bg-[#f6f6f6] hover:text-[#b8391c] focus-visible:bg-[#f6f6f6] focus-visible:text-[#b8391c] focus-visible:outline-none">
                            {s.name}
                            <ArrowRight aria-hidden className="size-3.5 flex-none -translate-x-1 text-brand-orange opacity-0 transition group-hover/l:translate-x-0 group-hover/l:opacity-100 group-focus-visible/l:translate-x-0 group-focus-visible/l:opacity-100" strokeWidth={2.5} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : products.length ? (
                    <ul className="grid grid-cols-2 gap-x-5 gap-y-0.5">
                      {products.slice(0, 8).map((p) => (
                        <li key={p.href}>
                          <Link data-item href={p.href} className="flex items-baseline justify-between gap-3 rounded-[10px] px-3 py-2.5 text-sm leading-snug font-bold transition-colors hover:bg-[#f6f6f6] focus-visible:bg-[#f6f6f6] focus-visible:outline-none">
                            <span className="line-clamp-2">{p.name}</span>
                            {p.price != null && <strong className="flex-none font-black whitespace-nowrap">{formatPrice(p.price)}</strong>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-3 py-2 text-[15px] leading-relaxed text-[#444]">
                      {emptyNote ? emptyNote(cat) : <>New listings coming soon. Call us on <a className="font-extrabold text-brand-blue underline" href="tel:+441953789311">+44 (0)1953 789311</a>.</>}
                    </p>
                  )}
                </div>
              )}

              <aside className="relative grid gap-2 self-start overflow-hidden rounded-[18px] bg-secondary p-5.5 text-white after:pointer-events-none after:absolute after:-right-12.5 after:-bottom-12.5 after:size-37.5 after:rounded-full after:border-26 after:border-brand-orange after:opacity-20">
                <p className="text-[11px] font-black tracking-widest text-brand-orange uppercase">Not sure what you need?</p>
                <p className="text-xl leading-tight font-black">Talk to our engineers</p>
                <p className="text-[13px] leading-normal text-[#cfcfcf]">Help with parts, engine builds and fitment.</p>
                <a href="tel:+441953789311" className="relative z-1 mt-1.5 inline-flex items-center gap-2 font-black hover:text-brand-orange">
                  <Phone aria-hidden className="size-4.5 text-brand-orange" /> +44 (0)1953 789311
                </a>
                <Link href="/contact-us" className="relative z-1 inline-flex items-center gap-1.5 text-xs font-black tracking-wide text-[#ddd] uppercase hover:text-brand-orange">
                  Send us a message <ArrowRight className="size-3.5" strokeWidth={2.5} />
                </Link>
              </aside>
            </div>
          </div>
          <div aria-hidden onClick={() => hide()} className="fixed inset-x-0 bottom-0 z-39 animate-in bg-black/40 duration-200 fade-in" style={{ top }} />
        </>
      )}
    </>
  );
}
