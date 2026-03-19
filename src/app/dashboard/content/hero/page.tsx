import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { HeroForm } from "@/components/dashboard/HeroForm";

export default async function HeroPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the main hero banner content shown at the top of the homepage.</p>
      </div>
      <HeroForm values={values} />
    </div>
  );
}