import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { PageSeoForm } from "@/components/dashboard/PageSeoForm";

export default async function PagesSeoPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Page SEO</h1>
        <p className="text-gray-500 text-sm mt-1">Set meta title, description, and keywords for the Homepage, Blog, and Services listing pages.</p>
      </div>
      <PageSeoForm values={values} />
    </div>
  );
}