"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type MenuItemData = {
  id: number;
  label: string;
  href: string;
  position: string;
  order: number;
  parentId: number | null;
  enabled: boolean;
  children: MenuItemData[];
};

const STATIC_DEFAULTS: MenuItemData[] = [
  { id: -1, label: "Home", href: "/", position: "left", order: 0, parentId: null, enabled: true, children: [] },
  { id: -2, label: "Treatments", href: "#expertise", position: "left", order: 1, parentId: null, enabled: true, children: [] },
  { id: -3, label: "Smile Gallery", href: "#before-after", position: "left", order: 2, parentId: null, enabled: true, children: [] },
  { id: -4, label: "Blog", href: "/blog", position: "left", order: 3, parentId: null, enabled: true, children: [] },
  { id: -5, label: "About", href: "/about", position: "left", order: 4, parentId: null, enabled: true, children: [] },
  { id: -6, label: "FAQ", href: "#faq", position: "right", order: 0, parentId: null, enabled: true, children: [] },
  { id: -7, label: "Contact", href: "/contact", position: "right", order: 1, parentId: null, enabled: true, children: [] },
];

/** Fetch all menu items (top-level + children) ordered by position/order */
export async function getMenuItems(): Promise<MenuItemData[]> {
  try {
    const items = await db.menuItem.findMany({
      where: { parentId: null },
      orderBy: [{ position: "asc" }, { order: "asc" }],
      include: {
        children: {
          orderBy: { order: "asc" },
          where: { enabled: true },
        },
      },
    });
    if (items.length === 0) return STATIC_DEFAULTS;
    return items as unknown as MenuItemData[];
  } catch {
    return STATIC_DEFAULTS;
  }
}

/** Fetch all items flat (for dashboard management) */
export async function getAllMenuItems() {
  try {
    return db.menuItem.findMany({
      orderBy: [{ position: "asc" }, { order: "asc" }],
      include: { children: { orderBy: { order: "asc" } } },
    });
  } catch {
    return [];
  }
}

export async function createMenuItem(data: {
  label: string;
  href: string;
  position: string;
  order: number;
  parentId?: number | null;
}) {
  await db.menuItem.create({ data });
  revalidatePath("/");
  revalidatePath("/dashboard/content/menu");
}

export async function updateMenuItem(
  id: number,
  data: { label?: string; href?: string; position?: string; order?: number; parentId?: number | null; enabled?: boolean }
) {
  await db.menuItem.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/dashboard/content/menu");
}

export async function deleteMenuItem(id: number) {
  await db.menuItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/dashboard/content/menu");
}

/** Seed default menu items if none exist */
export async function seedDefaultMenuItems() {
  const defaults = [
    { label: "Home", href: "/", position: "left", order: 0 },
    { label: "Treatments", href: "#expertise", position: "left", order: 1 },
    { label: "Smile Gallery", href: "#before-after", position: "left", order: 2 },
    { label: "Blog", href: "/blog", position: "left", order: 3 },
    { label: "About", href: "/about", position: "left", order: 4 },
    { label: "FAQ", href: "#faq", position: "right", order: 0 },
    { label: "Contact", href: "/contact", position: "right", order: 1 },
  ];

  try {
    const count = await db.menuItem.count();
    if (count > 0) return;
    await db.menuItem.createMany({ data: defaults });
    revalidatePath("/dashboard/content/menu");
  } catch (err) {
    console.error("[seedDefaultMenuItems] failed:", err);
  }
}
