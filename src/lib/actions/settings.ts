"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSettings(
  _prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const entries = Array.from(formData.entries()) as [string, string][];

  try {
    for (const [key, value] of entries) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      });
    }
  } catch {
    return { success: false, error: "Failed to save settings. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/content/hero");
  revalidatePath("/dashboard/content/about");
  revalidatePath("/dashboard/content/faq");
  revalidatePath("/dashboard/content/at-a-glance");
  revalidatePath("/dashboard/content/pages-seo");
  return { success: true };
}
