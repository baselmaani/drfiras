import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { BeforeAfterSectionForm } from "@/components/dashboard/BeforeAfterSectionForm";

export const metadata = { title: "Before & After Section | Dashboard" };

export default async function BeforeAfterSectionPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1b4f72]" style={{ fontFamily: "var(--font-playfair)" }}>
          Before &amp; After Section
        </h1>
        <p className="text-gray-500 text-sm mt-1">Edit the eyebrow, heading and description shown above the before &amp; after gallery.</p>
      </div>
      <BeforeAfterSectionForm values={values} />
    </div>
  );
}
