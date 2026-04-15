"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = { error: string } | null;

export async function createGalleryImage(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const serviceId = parseInt(formData.get("serviceId") as string);

  if (!title || !image || !serviceId) {
    return { error: "Title, image, and service are required." };
  }

  await db.galleryImage.create({
    data: {
      title,
      image,
      serviceId,
      description: (formData.get("description") as string) || null,
      order: parseInt((formData.get("order") as string) || "0"),
      published: formData.get("published") === "on",
    },
  });

  revalidatePath("/dashboard/gallery");
  revalidatePath("/gallery");
  redirect("/dashboard/gallery");
}

export async function updateGalleryImage(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const serviceId = parseInt(formData.get("serviceId") as string);

  if (!title || !image || !serviceId) {
    return { error: "Title, image, and service are required." };
  }

  await db.galleryImage.update({
    where: { id },
    data: {
      title,
      image,
      serviceId,
      description: (formData.get("description") as string) || null,
      order: parseInt((formData.get("order") as string) || "0"),
      published: formData.get("published") === "on",
    },
  });

  revalidatePath("/dashboard/gallery");
  revalidatePath("/gallery");
  redirect("/dashboard/gallery");
}

export async function deleteGalleryImage(id: number, _formData: FormData) {
  await db.galleryImage.delete({ where: { id } });
  revalidatePath("/dashboard/gallery");
  revalidatePath("/gallery");
}
