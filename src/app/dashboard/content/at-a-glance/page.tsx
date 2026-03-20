import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { AtAGlanceManager, type GlanceItem } from "@/components/dashboard/AtAGlanceManager";

export default async function AtAGlancePage() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  let initial: GlanceItem[] = [
    { label: "GDC Number", value: "123456" },
    { label: "Qualifications", value: "BDS, MSc Cosmetic Dentistry" },
    { label: "Languages Spoken", value: "English, Arabic" },
    { label: "Clinic Location", value: "Dubai & Online" },
    { label: "Specialisation", value: "Composite Bonding, Invisalign, Veneers" },
    { label: "Experience", value: "10+ Years" },
  ];
  if (s.glanceItems) {
    try { initial = JSON.parse(s.glanceItems) as GlanceItem[]; } catch { /* keep defaults */ }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">At a Glance</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the credential/stat items shown in the At a Glance section.</p>
      </div>
      <AtAGlanceManager initial={initial} />
    </div>
  );
}