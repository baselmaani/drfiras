import { MenuManager } from "@/components/dashboard/MenuManager";
import { getAllMenuItems, seedDefaultMenuItems } from "@/lib/actions/menu";

export const metadata = { title: "Menu Manager | Dashboard" };

export default async function MenuPage() {
  await seedDefaultMenuItems();
  const items = await getAllMenuItems();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Navigation Menu</h1>
        <p className="text-gray-500 text-sm mt-1">
          Add, edit, reorder and show/hide menu items. Sub-menu items appear under their parent as a dropdown.
        </p>
      </div>
      <MenuManager initialItems={items as any} />
    </div>
  );
}
