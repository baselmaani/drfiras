import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import FAQ, { type FAQItem } from "@/components/FAQ";

export default async function FAQSection() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  let items: FAQItem[] | undefined;
  if (s.faqItems) {
    try {
      items = JSON.parse(s.faqItems) as FAQItem[];
    } catch {
      // fall back to defaults inside FAQ component
    }
  }

  return <FAQ items={items} />;
}
