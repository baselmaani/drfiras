import { db } from "@/lib/db";

export type ServicePriceInfo = {
  label: string; // e.g. "From AED 400 per tooth"
  amount: number | null; // e.g. 400 — for schema.org Offer.price
  unit: string | null; // e.g. "per tooth"
};

// Price-list entries are free text ("From 400"); add the currency when it's missing.
export function formatPrice(price: string, note?: string | null): ServicePriceInfo {
  const p = price.trim();
  const withCurrency = /aed|dhs?|dirham|د\.إ/i.test(p) ? p : p.replace(/(\d[\d,.]*)/, "AED $1");
  const unit = note?.trim() || null;
  const num = p.match(/\d[\d,]*(\.\d+)?/);
  return {
    label: unit ? `${withCurrency} ${unit}` : withCurrency,
    amount: num ? Number(num[0].replace(/,/g, "")) : null,
    unit,
  };
}

// Published price-list entries keyed by lower-cased title, so a service can
// find its price by matching its own title.
export async function getServicePrices(): Promise<Map<string, ServicePriceInfo>> {
  const rows = await db.servicePrice.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: { title: true, price: true, priceNote: true },
  });
  const map = new Map<string, ServicePriceInfo>();
  for (const r of rows) {
    const key = r.title.trim().toLowerCase();
    if (!map.has(key)) map.set(key, formatPrice(r.price, r.priceNote));
  }
  return map;
}
