import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { NavbarForm } from "@/components/dashboard/NavbarForm";

export default async function NavbarPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Navbar & Links</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the navigation bar phone, WhatsApp, Instagram buttons, booking link, and social links.</p>
      </div>
      <NavbarForm values={values} />
    </div>
  );
}
