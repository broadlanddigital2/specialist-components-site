export type SubCategory = { name: string; href: string; image?: string };

export type Category = {
  name: string;
  href: string;
  image?: string;
  subcategories: SubCategory[];
};

/** One card in a category grid (a category, sub category or any linked tile). */
export type CategoryTile = { name: string; href: string; image?: string };

export type Faq = { question: string; answer: string };
