import type { Faq } from "@/components/category/types";
import { formatPrice } from "./format";

const PHONE = "+44 (0)1953 789311";
const EMAIL = "info@specialist-components.co.uk";
const HOURS = "Mon–Thurs 9am–5pm, Fri 9am–3.30pm";

const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/**
 * Category FAQs built only from facts the site already states (as on the demo):
 * what's in the range, the price range (inc VAT), where stock is shown,
 * technical help, worldwide delivery and contact details.
 * Add the business's own answers (returns, warranty, lead times, fitment)
 * via `extra` once they're confirmed. See docs/FAQ-QUESTIONS-FOR-CLIENT.md.
 */
export function buildCategoryFaqs(args: {
  name: string;
  subcategories?: string[];
  /** All products in the category, including those in its sub categories. */
  products?: { name: string; price?: number | null }[];
  extra?: Faq[];
}): Faq[] {
  const { name, subcategories = [], products = [], extra = [] } = args;
  const faqs: Faq[] = [];

  if (subcategories.length) {
    faqs.push({
      question: `What's in the ${name} range?`,
      answer: `It's split into ${subcategories.length} sub categories: ${list(subcategories)}. Choose one above to see the products in it.`,
    });
  } else if (products.length) {
    const examples = [...products].sort((a, b) => (b.price ?? 0) - (a.price ?? 0)).slice(0, 3).map((p) => p.name);
    faqs.push({
      question: `What's in the ${name} range?`,
      answer: `There ${products.length === 1 ? "is currently 1 product" : `are currently ${products.length} products`} in this range, including ${list(examples)}.`,
    });
  } else {
    faqs.push({
      question: `What's in the ${name} range?`,
      answer: `We're adding products to this range. Call us on ${PHONE} or email ${EMAIL} to ask about what's available.`,
    });
  }

  const prices = products.map((p) => p.price).filter((p): p is number => typeof p === "number");
  if (prices.length >= 2 && Math.min(...prices) !== Math.max(...prices)) {
    faqs.push({
      question: "How much do products in this range cost?",
      answer: `Prices across this range currently run from ${formatPrice(Math.min(...prices))} to ${formatPrice(Math.max(...prices))}. All prices shown include VAT.`,
    });
  } else if (prices.length === 1) {
    faqs.push({ question: "How much does it cost?", answer: `It's currently listed at ${formatPrice(prices[0])}, including VAT.` });
  }

  if (products.length) {
    faqs.push({
      question: "Are these parts in stock?",
      answer: `Stock is shown on each product page. If something you need is marked out of stock, call us on ${PHONE} or email ${EMAIL} and we'll give you a lead time.`,
    });
  }

  faqs.push(
    {
      question: "Can you help me choose the right part?",
      answer: `Yes. Technical help and assistance is part of what we offer, so give the team a call on ${PHONE} (${HOURS}) or email ${EMAIL} with details of your car or project.`,
    },
    {
      question: "Do you deliver outside the UK?",
      answer: `Yes, we offer worldwide express delivery. Contact us on ${PHONE} or ${EMAIL} for a delivery quote to your country.`,
    },
  );

  return [...faqs, ...extra];
}
