import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const dbSettings = await getSettings();
  const settings = { ...DEFAULT_SETTINGS, ...dbSettings };

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400 text-sm">Dashboard / Settings</p>
        <h1
          className="text-2xl font-bold text-[#1b4f72]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Site Settings
        </h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
