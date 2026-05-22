import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { FAQManager, type FAQItem } from "@/components/dashboard/FAQManager";

export default async function FAQAboutPage() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  let initial: FAQItem[] = [];
  if (s.aboutFaqItems) {
    try { initial = JSON.parse(s.aboutFaqItems) as FAQItem[]; } catch { /* keep empty */ }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400 text-sm">Dashboard / Content / FAQ</p>
        <h1 className="text-2xl font-bold text-gray-900">About Page — FAQ</h1>
        <p className="text-gray-500 text-sm mt-1">FAQ items shown at the bottom of the About page.</p>
      </div>
      <FAQManager initial={initial} settingKey="aboutFaqItems" />
    </div>
  );
}
