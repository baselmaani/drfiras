import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { AboutForm } from "@/components/dashboard/AboutForm";

export default async function AboutPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">About Section</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the bio paragraphs, stats, and CTA button in the About section.</p>
      </div>
      <AboutForm values={values} />
    </div>
  );
}