"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateInternalLinks, type RelatedLink } from "@/lib/internalLinks";

type ActionState = { error: string } | null;

function toSlug(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readInternalLinks(formData: FormData): string | null {
  const raw = (formData.get("internalLinks") as string) || "[]";
  let parsed: RelatedLink[] = [];
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = [];
  }
  const { valid } = validateInternalLinks(Array.isArray(parsed) ? parsed : []);
  return valid.length ? JSON.stringify(valid) : null;
}

export async function createPost(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const rawSlug = (formData.get("slug") as string)?.trim();
  const slug = rawSlug || toSlug(title);
  const content = (formData.get("content") as string)?.trim();

  if (!title || !slug || !content) {
    return { error: "Title, slug and content are required." };
  }

  const published = formData.get("published") === "on";

  try {
    await db.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: (formData.get("excerpt") as string) || null,
        coverImage: (formData.get("coverImage") as string) || null,
        published,
        publishedAt: published ? new Date() : null,
        metaTitle: (formData.get("metaTitle") as string) || null,
        metaDesc: (formData.get("metaDesc") as string) || null,
        metaKeywords: (formData.get("metaKeywords") as string) || null,
        ogImage: (formData.get("ogImage") as string) || null,
        faqItems: (formData.get("faqItems") as string) || null,
        internalLinks: readInternalLinks(formData),
      },
    });
  } catch {
    return { error: "Failed to create. Slug may already be taken." };
  }

  revalidatePath("/dashboard/posts");
  revalidatePath("/blog");
  redirect("/dashboard/posts");
}

export async function updatePost(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  if (!title || !slug || !content) {
    return { error: "Title, slug and content are required." };
  }

  const published = formData.get("published") === "on";
  const existing = await db.post.findUnique({ where: { id } });

  try {
    await db.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt: (formData.get("excerpt") as string) || null,
        coverImage: (formData.get("coverImage") as string) || null,
        published,
        publishedAt:
          published && !existing?.publishedAt ? new Date() : existing?.publishedAt ?? null,
        metaTitle: (formData.get("metaTitle") as string) || null,
        metaDesc: (formData.get("metaDesc") as string) || null,
        metaKeywords: (formData.get("metaKeywords") as string) || null,
        ogImage: (formData.get("ogImage") as string) || null,
        faqItems: (formData.get("faqItems") as string) || null,
        internalLinks: readInternalLinks(formData),
      },
    });
  } catch {
    return { error: "Failed to update. Slug may already be taken." };
  }

  revalidatePath("/dashboard/posts");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog");
  redirect("/dashboard/posts");
}

export async function deletePost(id: number, _formData: FormData) {
  await db.post.delete({ where: { id } });
  revalidatePath("/dashboard/posts");
  revalidatePath("/blog");
}
