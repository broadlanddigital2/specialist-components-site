/** Split a price into display parts: "£", "16,000", ".00". */
export function priceParts(value: number) {
  const [pounds, pence] = value.toFixed(2).split(".");
  return { currency: "£", pounds: Number(pounds).toLocaleString("en-GB"), pence: `.${pence}` };
}

/** "£16,000.00" */
export function formatPrice(value: number) {
  return value.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
}

/** UK VAT at 20%: price ex VAT from an inc-VAT price. */
export const exVat = (incVat: number) => incVat / 1.2;
