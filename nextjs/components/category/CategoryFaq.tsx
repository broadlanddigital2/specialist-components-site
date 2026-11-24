import type { Faq } from "./types";

type Props = {
  faqs: Faq[];
  /** Shown as the eyebrow, e.g. the category name. */
  eyebrow?: string;
  title?: string;
  phone?: { label: string; href: string };
};

/**
 * FAQ section for category pages: light grey panel, accordion and a call button.
 * Also outputs FAQPage structured data for search engines.
 * Build the questions with buildCategoryFaqs() from lib/faq.ts, or pass your own.
 */
export function CategoryFaq({
  faqs,
  eyebrow,
  title = "Frequently asked questions",
  phone = { label: "+44 (0)1953 789311", href: "tel:+441953789311" },
}: Props) {
  if (!faqs.length) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <section aria-labelledby="cfaq-heading" className="mx-auto my-12 max-w-350 px-4 md:my-18 md:px-6">
      <div className="grid gap-6 rounded-3xl bg-[#f4f4f4] px-4 py-6 md:p-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12 lg:p-12">
        <div className="lg:sticky lg:top-30 lg:self-start">
          {eyebrow && <p className="text-xs font-black tracking-widest text-brand-orange uppercase">{eyebrow}</p>}
          <h2 id="cfaq-heading" className="mt-1.5 text-[26px] leading-tight font-black md:text-[34px]">{title}</h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-[#555]">Can&apos;t find what you&apos;re looking for? Our team is happy to help.</p>
          <a
            href={phone.href}
            className="mt-4.5 inline-flex h-11.5 items-center rounded-xl bg-secondary px-5 text-[13px] font-black tracking-wide text-white uppercase transition hover:bg-brand-orange"
          >
            Call {phone.label}
          </a>
        </div>
        <div className="grid gap-2.5">
          {faqs.map((f, i) => (
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
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  );
}
