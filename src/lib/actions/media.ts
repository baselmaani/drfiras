"use server";
import { db } from "@/lib/db";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function deleteMediaFile(id: number, _formData: FormData) {
  const file = await db.mediaFile.findUnique({ where: { id } });
  if (!file) return;

  // Delete from Vercel Blob storage
  try {
    await del(file.url);
  } catch {
    // If blob is already gone, continue to delete the DB record
  }

  await db.mediaFile.delete({ where: { id } });
  revalidatePath("/dashboard/media");
}

export async function createFolder(name: string, parentId: number | null) {
  await db.mediaFolder.create({ data: { name: name.trim(), parentId } });
  revalidatePath("/dashboard/media");
}

export async function deleteFolder(id: number, _formData: FormData) {
  // Move all files in this folder to root before deleting
  await db.mediaFile.updateMany({ where: { folderId: id }, data: { folderId: null } });
  await db.mediaFolder.delete({ where: { id } });
  revalidatePath("/dashboard/media");
}

export async function moveFile(fileId: number, folderId: number | null) {
  await db.mediaFile.update({ where: { id: fileId }, data: { folderId } });
  revalidatePath("/dashboard/media");
}

