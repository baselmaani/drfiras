"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = { error: string } | null;

export async function createPrice(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const price = (formData.get("price") as string)?.trim();

  if (!title || !price) {
    return { error: "Title and price are required." };
  }

  await db.servicePrice.create({
    data: {
      title,
      price,
      description: (formData.get("description") as string) || null,
      priceNote: (formData.get("priceNote") as string) || null,
      category: (formData.get("category") as string) || null,
      order: parseInt((formData.get("order") as string) || "0"),
      published: formData.get("published") === "on",
    },
  });

  revalidatePath("/dashboard/prices");
  revalidatePath("/prices");
  redirect("/dashboard/prices");
}

export async function updatePrice(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const price = (formData.get("price") as string)?.trim();

  if (!title || !price) {
    return { error: "Title and price are required." };
  }

  await db.servicePrice.update({
    where: { id },
    data: {
      title,
      price,
      description: (formData.get("description") as string) || null,
      priceNote: (formData.get("priceNote") as string) || null,
      category: (formData.get("category") as string) || null,
      order: parseInt((formData.get("order") as string) || "0"),
      published: formData.get("published") === "on",
    },
  });

  revalidatePath("/dashboard/prices");
  revalidatePath("/prices");
  redirect("/dashboard/prices");
}

export async function deletePrice(id: number, _formData: FormData) {
  await db.servicePrice.delete({ where: { id } });
  revalidatePath("/dashboard/prices");
  revalidatePath("/prices");
}
