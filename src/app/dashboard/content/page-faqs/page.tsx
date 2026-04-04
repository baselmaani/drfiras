import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { FAQManager, type FAQItem } from "@/components/dashboard/FAQManager";

function parseItems(raw: string | undefined): FAQItem[] {
  if (!raw) return [];
  try { return JSON.parse(raw) as FAQItem[]; } catch { return []; }
}

export default async function PageFAQsPage() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  const pages = [
    { key: "aboutFaqItems",    label: "About Page",    desc: "FAQ shown at the bottom of the /about page." },
    { key: "contactFaqItems",  label: "Contact Page",  desc: "FAQ shown at the bottom of the /contact page." },
    { key: "servicesFaqItems", label: "Services Page", desc: "FAQ shown at the bottom of the /services list page." },
    { key: "blogFaqItems",     label: "Blog Page",     desc: "FAQ shown at the bottom of the /blog list page." },
  ] as const;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Page FAQs</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage FAQ sections for each site page. Leave empty to hide the FAQ on that page.
        </p>
      </div>

      {pages.map(({ key, label, desc }) => (
        <section key={key} className="border border-gray-200 rounded-2xl p-6 bg-white">
          <h2 className="text-base font-semibold text-gray-800 mb-1">{label}</h2>
          <p className="text-xs text-gray-400 mb-5">{desc}</p>
          <FAQManager initial={parseItems(s[key])} settingKey={key} />
        </section>
      ))}
    </div>
  );
}
