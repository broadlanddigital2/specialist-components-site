"use client";

import { ArrowRight, ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import type { FormEvent, ReactNode } from "react";

type Props = {
  /** Wire this to your existing contact form handler / server action. */
  onSubmit?: (data: FormData) => void | Promise<void>;
};

const fieldCls =
  "w-full rounded-xl border border-[#d9d9d9] bg-[#fafafa] px-3.5 text-base text-secondary transition placeholder:text-[#9a9a9a] focus:border-brand-blue focus:bg-white focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand-blue)_18%,transparent)] focus:outline-none";

export function GetInTouch({ onSubmit }: Props) {
  const handle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit?.(new FormData(e.currentTarget));
  };

  return (
    <section aria-labelledby="gt-heading" className="bg-[#f4f4f4] px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto grid max-w-300 overflow-hidden rounded-3xl shadow-[0_20px_50px_-30px_rgb(0_0_0/0.27)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Info panel */}
        <div className="relative overflow-hidden bg-secondary px-6 py-8 text-white after:pointer-events-none after:absolute after:-right-20 after:-bottom-20 after:size-60 after:rounded-full after:border-40 after:border-brand-orange after:opacity-20 md:px-11 md:py-12">
          <p className="text-xs font-black tracking-widest text-brand-orange uppercase">Talk to the team</p>
          <h2 id="gt-heading" className="mt-1.5 text-3xl leading-tight font-black md:text-[40px]">Get in touch</h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#cfcfcf]">
            Questions about a part, an engine build or our engineering services? Send us a message or give us a call.
          </p>
          <ul className="relative z-1 mt-7 grid gap-5">
            <Item icon={<Phone />} label="Call us">
              <a href="tel:+441953789311" className="hover:text-brand-orange">+44 (0)1953 789311</a>
            </Item>
            <Item icon={<Mail />} label="Email us">
              <a href="mailto:info@specialist-components.co.uk" className="break-words hover:text-brand-orange">info@specialist-components.co.uk</a>
            </Item>
            <Item icon={<MapPin />} label="Find us">
              <address className="not-italic">Unit 6 Oaks Farm, Besthorpe Road,<br />Carlton Rode, Norfolk NR16 1NF</address>
            </Item>
            <Item icon={<Clock />} label="Opening hours">
              Mon–Thurs 9am–5pm<br />Fri 9am–3.30pm
            </Item>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handle} noValidate className="bg-white px-5 pt-7 pb-8 md:px-11 md:py-12">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><input name="name" autoComplete="name" placeholder="Your name" className={`${fieldCls} h-12.5`} /></Field>
            <Field label="Email"><input type="email" name="email" autoComplete="email" placeholder="you@example.com" className={`${fieldCls} h-12.5`} /></Field>
            <Field label="Mobile"><input type="tel" name="phone" autoComplete="tel" placeholder="07…" className={`${fieldCls} h-12.5`} /></Field>
            <Field label="Enquiry type">
              <span className="relative block">
                <select name="enquiry_type" required defaultValue="" className={`${fieldCls} h-12.5 cursor-pointer appearance-none pr-10 invalid:text-[#9a9a9a]`}>
                  <option value="" disabled>Choose one</option>
                  <option value="general">General enquiry</option>
                  <option value="parts">Parts &amp; products</option>
                  <option value="engineering">Engineering services</option>
                  <option value="order">Order support</option>
                </select>
                <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4.5 -translate-y-1/2" />
              </span>
            </Field>
            <Field label="Message" full>
              <textarea name="message" rows={5} placeholder="How can we help?" className={`${fieldCls} min-h-35 resize-y py-3`} />
            </Field>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-4.5 gap-y-3">
            <button
              type="submit"
              className="inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-brand-orange px-7 text-sm font-black tracking-wide text-white uppercase transition hover:bg-brand-blue sm:w-auto"
            >
              Send message <ArrowRight className="size-4.5" strokeWidth={2.5} />
            </button>
            <p className="text-[13px] text-grey">We usually reply within one working day.</p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Item({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3.5">
      <span aria-hidden className="grid size-10 flex-none place-items-center rounded-xl bg-white/8 text-brand-orange [&>svg]:size-5">
        {icon}
      </span>
      <div className="text-[15px] leading-normal font-bold">
        <span className="mb-0.5 block text-[11px] font-extrabold tracking-wider text-[#9a9a9a] uppercase">{label}</span>
        {children}
      </div>
    </li>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: ReactNode }) {
  return (
    <label className={`grid gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-extrabold tracking-wide uppercase">{label}</span>
      {children}
    </label>
  );
}
