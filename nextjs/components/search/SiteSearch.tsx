"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { formatPrice } from "@/lib/format";
import { prepareIndex, searchIndex, type SearchItem } from "@/lib/search";
import { Highlight } from "./Highlight";

type Props = {
  /** Loads the index once, on first open or hover. Defaults to fetching /search-index.json. */
  loadIndex?: () => Promise<SearchItem[]>;
  /** Category shortcuts shown before typing and when nothing matches. */
  quickLinks?: { name: string; href: string }[];
  /** Suggested searches shown before typing. */
  suggestions?: string[];
  /** Where "View all results" goes. */
  resultsPath?: string;
  /** Visual style of the header trigger button. */
  triggerClassName?: string;
};

const DEFAULT_SUGGESTIONS = ["throttle body", "gearknob", "twinkam", "ECU", "split rim", "cylinder head"];

/**
 * Header search: an icon button that opens a search dialog with live results.
 * Also opens with "/" or Ctrl/Cmd+K. Arrow keys move through results; Enter opens one
 * (or the full results page). Full screen on phones, a centred panel on larger screens.
 * Exposes window.dispatchEvent(new CustomEvent("open-site-search", { detail: "query" }))
 * so other UI (e.g. the mobile menu search box) can open it.
 */
export function SiteSearch({
  loadIndex = () => fetch("/search-index.json").then((r) => r.json()),
  quickLinks = [],
  suggestions = DEFAULT_SUGGESTIONS,
  resultsPath = "/search",
  triggerClassName = "grid size-9 cursor-pointer place-items-center rounded-xl text-foreground transition hover:bg-foreground/10 md:size-10",
}: Props) {
  const router = useRouter();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(-1);
  const [index, setIndex] = useState<ReturnType<typeof prepareIndex> | null>(null);
  const loading = useRef<Promise<void> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<Element | null>(null);

  const ensureIndex = useCallback(() => {
    if (!loading.current) loading.current = loadIndex().then((items) => setIndex(prepareIndex(items))).catch(() => { loading.current = null; });
    return loading.current;
  }, [loadIndex]);

  const openSearch = useCallback((q?: string) => {
    lastFocus.current = document.activeElement;
    if (typeof q === "string") setQuery(q);
    setOpen(true);
    ensureIndex();
  }, [ensureIndex]);
  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
    (lastFocus.current as HTMLElement | null)?.focus?.();
  }, []);

  // keyboard shortcuts + external open event
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const typing = !!el && (/input|textarea|select/i.test(el.tagName) || el.isContentEditable);
      if (e.key === "Escape" && open) { e.preventDefault(); close(); }
      else if (e.key === "/" && !open && !typing) { e.preventDefault(); openSearch(); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open ? close() : openSearch(); }
    };
    const onOpen = (e: Event) => openSearch((e as CustomEvent<string>).detail);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-site-search", onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("open-site-search", onOpen); };
  }, [open, openSearch, close]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => { inputRef.current?.focus(); inputRef.current?.select(); });
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  useEffect(() => { const t = setTimeout(() => setDebounced(query), 90); return () => clearTimeout(t); }, [query]);
  useEffect(() => setActive(-1), [debounced]);

  const results = useMemo(() => (index && debounced.trim() ? searchIndex(index, debounced) : []), [index, debounced]);
  const cats = results.filter((r) => r.type !== "product").slice(0, 4);
  const prods = results.filter((r) => r.type === "product");
  const shown = prods.slice(0, 6);

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && shown.length) { e.preventDefault(); setActive((a) => (a + 1) % shown.length); }
    else if (e.key === "ArrowUp" && shown.length) { e.preventDefault(); setActive((a) => (a - 1 + shown.length) % shown.length); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const target = shown[active];
      if (target) { router.push(target.url); close(); }
      else if (query.trim()) { router.push(`${resultsPath}?q=${encodeURIComponent(query.trim())}`); close(); }
    }
  };

  const CategoryLinks = () => (
    <div className="grid gap-1.5 sm:grid-cols-2">
      {quickLinks.map((c) => (
        <Link key={c.href} href={c.href} onClick={close} className="group/c flex items-center justify-between gap-2.5 rounded-xl bg-[#f6f6f6] px-3.5 py-3 text-sm font-extrabold transition hover:bg-[#efefef]">
          {c.name}
          <ArrowRight className="size-4 text-brand-orange transition group-hover/c:translate-x-0.75" strokeWidth={2.5} />
        </Link>
      ))}
    </div>
  );
  const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="mx-1 mt-4 mb-2.5 text-[11px] font-black tracking-widest text-grey uppercase">{children}</p>
  );

  return (
    <>
      <button type="button" aria-label="Open search" onClick={() => openSearch()} onPointerEnter={ensureIndex} className={triggerClassName}>
        <Search className="size-6 md:size-7" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="fixed inset-0 z-60">
          <div aria-hidden onClick={close} className="absolute inset-0 animate-in bg-black/60 duration-200 fade-in" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="relative mx-auto flex h-dvh w-full max-w-208 animate-in flex-col bg-white duration-200 fade-in slide-in-from-top-2.5 md:mt-18 md:h-auto md:max-h-[calc(100dvh-120px)] md:rounded-[20px] md:shadow-[0_30px_70px_-30px_rgb(0_0_0/0.67)]"
          >
            <div className="flex items-center gap-2.5 border-b border-[#eee] p-3 md:pt-4 md:pr-4 md:pb-3.5 md:pl-5">
              <label className="flex h-13 flex-1 items-center gap-2.5 rounded-[14px] border-2 border-secondary bg-white px-3.5 focus-within:border-brand-orange focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand-orange)_18%,transparent)]">
                <Search aria-hidden className="size-5 flex-none" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Search parts, SKUs or categories"
                  autoComplete="off"
                  spellCheck={false}
                  role="combobox"
                  aria-expanded={shown.length > 0}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-[17px] font-semibold outline-0 [&::-webkit-search-cancel-button]:hidden"
                />
                <kbd className="hidden rounded-md border border-b-2 border-[#ddd] px-1.75 py-0.75 text-[11px] font-bold text-grey md:inline-block">Esc</kbd>
              </label>
              <button type="button" onClick={close} aria-label="Close search" className="grid size-11 flex-none cursor-pointer place-items-center rounded-xl hover:bg-[#f4f4f4] md:hidden">
                <X className="size-5.5" />
              </button>
            </div>

            <div aria-live="polite" className="overflow-y-auto overscroll-contain px-3 pt-2 pb-5 md:px-5 md:pt-2.5 md:pb-6">
              {!query.trim() ? (
                <>
                  <Label>Popular searches</Label>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => { setQuery(s); inputRef.current?.focus(); }} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#e3e3e3] px-3.5 py-2 text-sm font-bold transition hover:border-secondary hover:bg-[#fafafa]">
                        <Search aria-hidden className="size-3.5 text-grey" /> {s}
                      </button>
                    ))}
                  </div>
                  {quickLinks.length > 0 && (<><Label>Shop by category</Label><CategoryLinks /></>)}
                </>
              ) : !index ? (
                <p className="px-1 py-6 text-grey">Loading…</p>
              ) : !results.length ? (
                <div className="grid gap-3 px-1 py-5 text-[15px] leading-normal text-[#444]">
                  <p className="text-lg font-black text-secondary">No results for “{query}”</p>
                  <p>
                    Try a different spelling, a part number, or browse a category. You can also call us on{" "}
                    <a href="tel:+441953789311" className="font-bold text-brand-blue underline">+44 (0)1953 789311</a>.
                  </p>
                  {quickLinks.length > 0 && <CategoryLinks />}
                </div>
              ) : (
                <>
                  {cats.length > 0 && (
                    <>
                      <Label>Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {cats.map((c) => (
                          <Link key={c.url} href={c.url} onClick={close} className="rounded-full border border-[#ffd9cf] bg-[#fff4f1] px-3.5 py-2 text-sm font-bold text-[#b8391c] transition hover:border-brand-orange hover:bg-brand-orange hover:text-white">
                            <Highlight text={c.name} query={debounced} />
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                  {prods.length > 0 && (
                    <>
                      <Label>
                        Products <span className="ml-1 rounded-full bg-[#f1f1f1] px-1.75 py-px text-secondary">{prods.length}</span>
                      </Label>
                      <ul id={listId} role="listbox" className="grid gap-0.5">
                        {shown.map((it, i) => (
                          <li key={it.url} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                            <Link
                              href={it.url}
                              onClick={close}
                              className={`flex items-center gap-3.5 rounded-[14px] p-2.5 transition-colors hover:bg-[#f4f4f4] ${i === active ? "bg-[#f4f4f4] shadow-[inset_3px_0_0_var(--brand-orange)]" : ""}`}
                            >
                              <span className="h-13 w-16 flex-none overflow-hidden rounded-[10px] bg-[#f1f1f1] bg-[url('/logo.webp')] bg-[length:28px] bg-center bg-no-repeat">
                                {it.image && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={it.image} alt="" loading="lazy" className="size-full object-cover" onError={(e) => e.currentTarget.remove()} />
                                )}
                              </span>
                              <span className="grid min-w-0 flex-1 gap-0.75">
                                <span className="line-clamp-2 text-[15px] leading-snug font-extrabold"><Highlight text={it.name} query={debounced} /></span>
                                <span className="flex flex-wrap gap-x-2.5 gap-y-1 text-xs text-grey">
                                  {it.category && <span>{it.category}</span>}
                                  {it.sku && <span>SKU <Highlight text={it.sku} query={debounced} /></span>}
                                </span>
                              </span>
                              <span className="grid flex-none justify-items-end gap-1">
                                {it.price != null && <span className="text-[17px] font-black whitespace-nowrap">{formatPrice(it.price)}</span>}
                                {it.stock && (
                                  <span className={`text-[11px] font-extrabold ${it.stock === "in" ? "text-[#147a3d]" : "text-[#b42318]"}`}>
                                    {it.stock === "in" ? "In stock" : "Out of stock"}
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {prods.length > shown.length && (
                    <Link
                      href={`${resultsPath}?q=${encodeURIComponent(debounced)}`}
                      onClick={close}
                      className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-secondary p-3.5 text-[13px] font-black tracking-wide text-white uppercase transition hover:bg-brand-orange"
                    >
                      View all {prods.length} results <ArrowRight className="size-4" strokeWidth={2.5} />
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
