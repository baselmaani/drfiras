"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = { error: string } | null;

function toSlug(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function createService(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const rawSlug = (formData.get("slug") as string)?.trim();
  const slug = rawSlug || toSlug(title);
  const description = (formData.get("description") as string)?.trim();

  if (!title || !slug || !description) {
    return { error: "Title, slug and description are required." };
  }

  try {
    await db.service.create({
      data: {
        title,
        slug,
        description,
        content: (formData.get("content") as string) || null,
        icon: (formData.get("icon") as string) || null,
        order: parseInt((formData.get("order") as string) || "0"),
        published: formData.get("published") === "on",
        metaTitle: (formData.get("metaTitle") as string) || null,
        metaDesc: (formData.get("metaDesc") as string) || null,
        ogImage: (formData.get("ogImage") as string) || null,
      },
    });
  } catch {
    return { error: "Failed to create. Slug may already be taken." };
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/dashboard/services");
}

export async function updateService(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!title || !slug || !description) {
    return { error: "Title, slug and description are required." };
  }

  try {
    await db.service.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content: (formData.get("content") as string) || null,
        icon: (formData.get("icon") as string) || null,
        order: parseInt((formData.get("order") as string) || "0"),
        published: formData.get("published") === "on",
        metaTitle: (formData.get("metaTitle") as string) || null,
        metaDesc: (formData.get("metaDesc") as string) || null,
        ogImage: (formData.get("ogImage") as string) || null,
      },
    });
  } catch {
    return { error: "Failed to update. Slug may already be taken." };
  }

  revalidatePath("/dashboard/services");
  revalidatePath(`/services/${slug}`);
  revalidatePath("/");
  redirect("/dashboard/services");
}

export async function deleteService(id: number, _formData: FormData) {
  await db.service.delete({ where: { id } });
  revalidatePath("/dashboard/services");
  revalidatePath("/");
}
