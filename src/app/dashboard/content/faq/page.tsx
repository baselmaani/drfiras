import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { FAQManager, type FAQItem } from "@/components/dashboard/FAQManager";

export default async function FAQPage() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  let initial: FAQItem[] = [];
  if (s.faqItems) {
    try { initial = JSON.parse(s.faqItems) as FAQItem[]; } catch { /* keep empty */ }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">FAQ Items</h1>
        <p className="text-gray-500 text-sm mt-1">Add, edit, or remove FAQ questions. Leave empty to use the built-in defaults.</p>
      </div>
      <FAQManager initial={initial} />
    </div>
  );
}