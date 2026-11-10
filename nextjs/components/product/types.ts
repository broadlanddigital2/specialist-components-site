export type ProductImage = { src: string; alt?: string };

export type ProductOptionValue = {
  value: string;
  label: string;
  /** Added to the base price when selected (inc VAT). */
  priceDelta?: number;
};

export type ProductOption = {
  id: string;
  label: string;
  values: ProductOptionValue[];
};

export type SpecRow = { label: string; value: string };
export type Faq = { question: string; answer: string };

export type Product = {
  name: string;
  slug: string;
  sku: string;
  category?: { name: string; href: string };
  /** Inc VAT. */
  price: number;
  inStock: boolean;
  images: ProductImage[];
  /** Configurable products only. */
  options?: ProductOption[];
  description: { lead?: string; paragraphs?: string[]; bullets?: string[] };
  specs?: SpecRow[];
  /** YouTube/Vimeo embed URL, e.g. https://www.youtube-nocookie.com/embed/VIDEO_ID */
  videoUrl?: string;
  faqs?: Faq[];
};

/** Minimal shape for listing cards. */
export type ProductSummary = Pick<Product, "name" | "price"> & { href: string; image: string };
