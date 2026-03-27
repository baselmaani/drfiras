import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { FooterForm } from "@/components/dashboard/FooterForm";

export const metadata = { title: "Footer | Dashboard" };

export default async function FooterPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1b4f72]" style={{ fontFamily: "var(--font-playfair)" }}>
          Footer
        </h1>
        <p className="text-gray-500 text-sm mt-1">Edit the footer CTA banner, tagline, working hours, and button labels.</p>
      </div>
      <FooterForm values={values} />
    </div>
  );
}
