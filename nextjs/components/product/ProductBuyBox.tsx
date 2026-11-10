"use client";

import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { exVat, formatPrice, priceParts } from "@/lib/format";
import type { Product } from "./types";

type Props = {
  product: Product;
  /** Wire this to your basket. Receives the selected option values and quantity. */
  onAddToBasket?: (args: { sku: string; options: Record<string, string>; quantity: number; unitPrice: number }) => void;
};

const USPS = [
  "Expert technical help from the team who built it",
  "Worldwide express delivery",
  "Designed and built in Norfolk, UK",
];

export function ProductBuyBox({ product, onAddToBasket }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.options ?? []).map((o) => [o.id, o.values[0]?.value ?? ""])),
  );
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  const unitPrice = useMemo(() => {
    const extra = (product.options ?? []).reduce((sum, o) => {
      const v = o.values.find((x) => x.value === selected[o.id]);
      return sum + (v?.priceDelta ?? 0);
    }, 0);
    return product.price + extra;
  }, [product, selected]);

  const p = priceParts(unitPrice);
  const clamp = (n: number) => Math.min(99, Math.max(1, Number.isFinite(n) ? n : 1));
  const canBuy = product.inStock;

  // Mobile sticky bar: show once the main button has scrolled off the top.
  useEffect(() => {
    const onScroll = () => {
      const el = actionsRef.current;
      if (el) setShowSticky(el.getBoundingClientRect().bottom < 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const add = () => onAddToBasket?.({ sku: product.sku, options: selected, quantity: qty, unitPrice });

  return (
    <section aria-label="Purchase options" className="min-w-0 lg:sticky lg:top-30">
      {product.category && (
        <p className="text-xs font-black tracking-wider text-brand-orange uppercase">{product.category.name}</p>
      )}
      <h1 className="mt-1.5 text-[28px] leading-tight font-black tracking-tight md:text-4xl">{product.name}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-2.5 text-[13px] text-grey">
        <span>
          SKU: <strong className="font-extrabold text-secondary">{product.sku}</strong>
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold before:size-1.75 before:rounded-full before:bg-current ${
            product.inStock ? "bg-[#e8f6ee] text-[#147a3d]" : "bg-[#fdecea] text-[#b42318]"
          }`}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </span>
      </div>

      <div className="mt-5 border-y border-neutral-200 py-4.5">
        <p className="text-[44px] leading-none font-black tracking-tighter md:text-[52px]" aria-live="polite">
          <span className="mr-0.5 align-[0.55em] text-[0.55em]">{p.currency}</span>
          {p.pounds}
          <span className="text-[0.5em] text-grey">{p.pence}</span>
        </p>
        <p className="mt-2 text-[13px] text-grey">
          inc VAT · {formatPrice(exVat(unitPrice))} ex VAT
        </p>
      </div>

      <form className="mt-5 grid gap-4.5" onSubmit={(e) => { e.preventDefault(); if (canBuy) add(); }}>
        {!!product.options?.length && (
          <div className="grid gap-3.5 sm:grid-cols-2">
            {product.options.map((opt) => (
              <label key={opt.id} className="grid gap-1.5">
                <span className="text-xs font-extrabold tracking-wide uppercase">{opt.label}</span>
                <span className="relative block">
                  <select
                    value={selected[opt.id]}
                    onChange={(e) => setSelected((s) => ({ ...s, [opt.id]: e.target.value }))}
                    className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-neutral-300 bg-white pr-10 pl-3.5 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-blue"
                  >
                    {opt.values.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                        {v.priceDelta ? ` (+${formatPrice(v.priceDelta)})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4.5 -translate-y-1/2" />
                </span>
              </label>
            ))}
          </div>
        )}

        <div ref={actionsRef} className="flex items-end gap-3">
          <div className="grid gap-1.5">
            <span id="qty-label" className="text-xs font-extrabold tracking-wide uppercase">Quantity</span>
            <div role="group" aria-labelledby="qty-label" className="flex h-13 overflow-hidden rounded-xl border border-neutral-300 bg-white">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => clamp(q - 1))} className="grid w-11 cursor-pointer place-items-center hover:bg-neutral-100">
                <Minus className="size-4" />
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={99}
                value={qty}
                onChange={(e) => setQty(clamp(parseInt(e.target.value, 10)))}
                aria-label="Quantity"
                className="w-12 [appearance:textfield] border-0 text-center font-extrabold focus-visible:outline-2 focus-visible:outline-brand-blue [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => clamp(q + 1))} className="grid w-11 cursor-pointer place-items-center hover:bg-neutral-100">
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!canBuy}
            className="h-13 flex-1 cursor-pointer rounded-xl bg-brand-orange px-6 text-sm font-black tracking-wide text-white uppercase transition hover:bg-brand-orange/85 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
          >
            Add to basket
          </button>
        </div>

        {!canBuy && (
          <p className="text-[13px] leading-normal text-grey">
            Currently out of stock. Call{" "}
            <a href="tel:+441953789311" className="font-bold text-brand-blue underline">+44 (0)1953 789311</a> or{" "}
            <a href="mailto:info@specialist-components.co.uk" className="font-bold text-brand-blue underline">email us</a>{" "}
            for lead times and pricing.
          </p>
        )}
      </form>

      <ul className="mt-5.5 grid gap-2.5 text-sm font-semibold">
        {USPS.map((u) => (
          <li key={u} className="flex items-center gap-2.5">
            <span className="grid size-4.5 flex-none place-items-center rounded-full bg-brand-blue text-white">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {u}
          </li>
        ))}
      </ul>

      {/* Mobile sticky buy bar */}
      <div
        aria-hidden={!showSticky}
        className={`fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_-10px_rgb(0_0_0/0.2)] transition-transform duration-250 lg:hidden ${
          showSticky ? "translate-y-0" : "translate-y-[110%]"
        }`}
      >
        <div>
          <p className="text-[22px] leading-none font-black">
            {formatPrice(unitPrice * qty)}
            {qty > 1 && <span className="text-sm font-bold text-grey"> ({qty})</span>}
          </p>
          <p className={`mt-0.5 text-[11px] font-extrabold ${product.inStock ? "text-[#147a3d]" : "text-[#b42318]"}`}>
            {product.inStock ? "In stock" : "Out of stock"}
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={!canBuy}
          tabIndex={showSticky ? 0 : -1}
          className="h-11.5 cursor-pointer rounded-xl bg-brand-orange px-6 text-sm font-black tracking-wide text-white uppercase disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
        >
          Add to basket
        </button>
      </div>
    </section>
  );
}
