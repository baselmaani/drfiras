import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { ServicesSectionForm } from "@/components/dashboard/ServicesSectionForm";

export const metadata = { title: "Services Section | Dashboard" };

export default async function ServicesSectionPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1b4f72]" style={{ fontFamily: "var(--font-playfair)" }}>
          Services Section
        </h1>
        <p className="text-gray-500 text-sm mt-1">Edit the heading and description shown above the services grid on the homepage.</p>
      </div>
      <ServicesSectionForm values={values} />
    </div>
  );
}
