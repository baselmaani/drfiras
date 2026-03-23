import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { ContactSectionForm } from "@/components/dashboard/ContactSectionForm";

export default async function ContactContentPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contact Section</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the clinic contact details, address, map, and form email shown in the Contact/Book section.</p>
      </div>
      <ContactSectionForm values={values} />
    </div>
  );
}
