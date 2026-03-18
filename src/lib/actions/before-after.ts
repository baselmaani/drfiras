"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = { error: string } | null;

export async function createBeforeAfter(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const treatment = (formData.get("treatment") as string)?.trim();
  const beforeImage = (formData.get("beforeImage") as string)?.trim();
  const afterImage = (formData.get("afterImage") as string)?.trim();

  if (!title || !treatment || !beforeImage || !afterImage) {
    return { error: "Title, treatment, and both image URLs are required." };
  }

  await db.beforeAfter.create({
    data: {
      title,
      treatment,
      beforeImage,
      afterImage,
      description: (formData.get("description") as string) || null,
      order: parseInt((formData.get("order") as string) || "0"),
      published: formData.get("published") === "on",
    },
  });

  revalidatePath("/dashboard/before-after");
  revalidatePath("/");
  redirect("/dashboard/before-after");
}

export async function updateBeforeAfter(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const treatment = (formData.get("treatment") as string)?.trim();
  const beforeImage = (formData.get("beforeImage") as string)?.trim();
  const afterImage = (formData.get("afterImage") as string)?.trim();

  if (!title || !treatment || !beforeImage || !afterImage) {
    return { error: "Title, treatment, and both image URLs are required." };
  }

  await db.beforeAfter.update({
    where: { id },
    data: {
      title,
      treatment,
      beforeImage,
      afterImage,
      description: (formData.get("description") as string) || null,
      order: parseInt((formData.get("order") as string) || "0"),
      published: formData.get("published") === "on",
    },
  });

  revalidatePath("/dashboard/before-after");
  revalidatePath("/");
  redirect("/dashboard/before-after");
}

export async function deleteBeforeAfter(id: number, _formData: FormData) {
  await db.beforeAfter.delete({ where: { id } });
  revalidatePath("/dashboard/before-after");
  revalidatePath("/");
}
