import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { InstagramForm } from "@/components/dashboard/InstagramForm";

export default async function InstagramPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Instagram Feed</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the Instagram section — profile info, follower count, and post images shown on the site.</p>
      </div>
      <InstagramForm values={values} />
    </div>
  );
}
