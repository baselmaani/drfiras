import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/db", () => ({
  db: {
    post: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { createPost, updatePost, deletePost } from "@/lib/actions/posts";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

const mockPost = db as unknown as {
  post: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
};

describe("posts – createPost", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error when required fields are missing", async () => {
    const result = await createPost(null, makeFormData({ title: "", slug: "", content: "" }));
    expect(result).toEqual({ error: "Title, slug and content are required." });
    expect(mockPost.post.create).not.toHaveBeenCalled();
  });

  it("returns error when content is missing", async () => {
    const result = await createPost(null, makeFormData({ title: "My Post", slug: "my-post", content: "" }));
    expect(result).toEqual({ error: "Title, slug and content are required." });
  });

  it("creates post and redirects on success", async () => {
    mockPost.post.create.mockResolvedValue({ id: 1 });
    const result = await createPost(
      null,
      makeFormData({ title: "New Post", slug: "new-post", content: "Body text here." })
    );
    expect(result).toBeUndefined();
    expect(mockPost.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ title: "New Post", slug: "new-post" }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/posts");
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
    expect(redirect).toHaveBeenCalledWith("/dashboard/posts");
  });

  it("auto-generates slug from title when slug is empty", async () => {
    mockPost.post.create.mockResolvedValue({ id: 2 });
    await createPost(null, makeFormData({ title: "Hello World", slug: "", content: "Content." }));
    expect(mockPost.post.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ slug: "hello-world" }) })
    );
  });

  it("sets publishedAt when published flag is 'on'", async () => {
    mockPost.post.create.mockResolvedValue({ id: 3 });
    await createPost(
      null,
      makeFormData({ title: "Live Post", slug: "live-post", content: "Published.", published: "on" })
    );
    const callData = mockPost.post.create.mock.calls[0][0].data;
    expect(callData.published).toBe(true);
    expect(callData.publishedAt).toBeInstanceOf(Date);
  });

  it("returns error when db throws (duplicate slug)", async () => {
    mockPost.post.create.mockRejectedValue(new Error("Unique"));
    const result = await createPost(null, makeFormData({ title: "X", slug: "x", content: "Y" }));
    expect(result).toEqual({ error: "Failed to create. Slug may already be taken." });
  });
});

describe("posts – updatePost", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error when required fields are missing", async () => {
    mockPost.post.findUnique.mockResolvedValue(null);
    const result = await updatePost(1, null, makeFormData({ title: "", slug: "", content: "" }));
    expect(result).toEqual({ error: "Title, slug and content are required." });
    expect(mockPost.post.update).not.toHaveBeenCalled();
  });

  it("updates post and redirects on success", async () => {
    mockPost.post.findUnique.mockResolvedValue({ id: 1, publishedAt: null });
    mockPost.post.update.mockResolvedValue({ id: 1 });
    const result = await updatePost(
      1,
      null,
      makeFormData({ title: "Updated Post", slug: "updated-post", content: "New content." })
    );
    expect(result).toBeUndefined();
    expect(mockPost.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({ title: "Updated Post" }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/posts");
    expect(redirect).toHaveBeenCalledWith("/dashboard/posts");
  });

  it("preserves existing publishedAt when already set", async () => {
    const existingDate = new Date("2024-01-15");
    mockPost.post.findUnique.mockResolvedValue({ id: 1, publishedAt: existingDate });
    mockPost.post.update.mockResolvedValue({ id: 1 });
    await updatePost(
      1,
      null,
      makeFormData({ title: "T", slug: "t", content: "C", published: "on" })
    );
    const callData = mockPost.post.update.mock.calls[0][0].data;
    expect(callData.publishedAt).toBe(existingDate);
  });

  it("returns error on db failure", async () => {
    mockPost.post.findUnique.mockResolvedValue({ id: 1, publishedAt: null });
    mockPost.post.update.mockRejectedValue(new Error("Slug conflict"));
    const result = await updatePost(1, null, makeFormData({ title: "T", slug: "t", content: "C" }));
    expect(result).toEqual({ error: "Failed to update. Slug may already be taken." });
  });
});

describe("posts – deletePost", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes the post by id", async () => {
    mockPost.post.delete.mockResolvedValue({ id: 5 });
    await deletePost(5, makeFormData({}));
    expect(mockPost.post.delete).toHaveBeenCalledWith({ where: { id: 5 } });
  });

  it("revalidates /dashboard/posts and /blog after delete", async () => {
    mockPost.post.delete.mockResolvedValue({ id: 5 });
    await deletePost(5, makeFormData({}));
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/posts");
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
  });
});
