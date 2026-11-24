/** One entry in the search index. Build it from your API (see README: search index). */
export type SearchItem = {
  type: "product" | "category" | "page";
  name: string;
  url: string;
  sku?: string;
  price?: number;
  image?: string;
  category?: string;
  stock?: "in" | "out";
};

type Prepared = SearchItem & { _name: string; _hay: string; _sku: string };

export const normalise = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9£.\s-]/g, " ");

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function prepareIndex(items: SearchItem[]): Prepared[] {
  return items.map((it) => ({
    ...it,
    _name: normalise(it.name),
    _hay: normalise([it.name, it.sku, it.category].filter(Boolean).join(" ")),
    _sku: normalise(it.sku).replace(/\s/g, ""),
  }));
}

/**
 * Every search word must match the name, SKU or category.
 * Ranking: exact SKU first, then names starting with the query, whole-word matches,
 * categories slightly above products, in-stock slightly above out of stock.
 */
export function searchIndex(index: Prepared[], query: string): SearchItem[] {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const compact = terms.join("");
  const scored: [number, Prepared][] = [];
  for (const it of index) {
    if (!terms.every((t) => it._hay.includes(t))) continue;
    let score = 0;
    if (it._sku && it._sku === compact) score += 100;
    if (it._name.startsWith(terms[0])) score += 30;
    for (const t of terms) {
      if (new RegExp(`(^|\\s)${escapeRe(t)}`).test(it._name)) score += 10;
      else if (it._name.includes(t)) score += 4;
    }
    if (it.type === "category") score += 8;
    if (it.stock === "in") score += 2;
    scored.push([score, it]);
  }
  return scored.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name)).map(([, it]) => it);
}

/** Split text into parts with matches flagged, for <mark> highlighting. */
export function highlight(text: string, query: string): { text: string; match: boolean }[] {
  const terms = normalise(query).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [{ text, match: false }];
  const re = new RegExp(`(${terms.map(escapeRe).join("|")})`, "ig");
  // split() with a capture group puts the matched parts at odd indexes
  return text.split(re).map((part, i) => ({ text: part, match: i % 2 === 1 })).filter((p) => p.text);
}
