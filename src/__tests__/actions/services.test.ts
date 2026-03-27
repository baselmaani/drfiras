import { describe, it, expect, vi, beforeEach } from "vitest";

// ── mock next/cache and next/navigation ────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

// ── mock db ────────────────────────────────────────────────────────────────
vi.mock("@/lib/db", () => ({
  db: {
    service: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { createService, updateService, deleteService } from "@/lib/actions/services";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

const mockDb = db as unknown as {
  service: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

describe("services – createService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error when required fields are missing", async () => {
    const result = await createService(null, makeFormData({ title: "", slug: "", description: "" }));
    expect(result).toEqual({ error: "Title, slug and description are required." });
    expect(mockDb.service.create).not.toHaveBeenCalled();
  });

  it("returns error when only title is provided (no description)", async () => {
    const result = await createService(null, makeFormData({ title: "Whitening", slug: "whitening", description: "" }));
    expect(result).toEqual({ error: "Title, slug and description are required." });
  });

  it("creates service and redirects on success", async () => {
    mockDb.service.create.mockResolvedValue({ id: 1 });
    const result = await createService(
      null,
      makeFormData({ title: "Teeth Whitening", slug: "teeth-whitening", description: "Bright smile." })
    );
    expect(result).toBeUndefined();
    expect(mockDb.service.create).toHaveBeenCalledOnce();
    expect(mockDb.service.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ title: "Teeth Whitening", slug: "teeth-whitening" }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/services");
    expect(redirect).toHaveBeenCalledWith("/dashboard/services");
  });

  it("auto-generates slug from title when slug is empty", async () => {
    mockDb.service.create.mockResolvedValue({ id: 2 });
    await createService(null, makeFormData({ title: "Dental Implants", slug: "", description: "Implants." }));
    expect(mockDb.service.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ slug: "dental-implants" }) })
    );
  });

  it("returns error when db.service.create throws", async () => {
    mockDb.service.create.mockRejectedValue(new Error("Unique constraint failed"));
    const result = await createService(
      null,
      makeFormData({ title: "X", slug: "x", description: "Y" })
    );
    expect(result).toEqual({ error: "Failed to create. Slug may already be taken." });
  });
});

describe("services – updateService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error when required fields are missing", async () => {
    const result = await updateService(1, null, makeFormData({ title: "", slug: "", description: "" }));
    expect(result).toEqual({ error: "Title, slug and description are required." });
    expect(mockDb.service.update).not.toHaveBeenCalled();
  });

  it("updates service and redirects on success", async () => {
    mockDb.service.update.mockResolvedValue({ id: 1 });
    const result = await updateService(
      1,
      null,
      makeFormData({ title: "Updated", slug: "updated", description: "Desc." })
    );
    expect(result).toBeUndefined();
    expect(mockDb.service.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({ title: "Updated", slug: "updated" }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/services");
    expect(redirect).toHaveBeenCalledWith("/dashboard/services");
  });

  it("returns unique-slug error message on Unique constraint violation", async () => {
    mockDb.service.update.mockRejectedValue(new Error("Unique constraint failed on slug"));
    const result = await updateService(
      1,
      null,
      makeFormData({ title: "X", slug: "x", description: "Y" })
    );
    expect(result).toEqual({ error: "That slug is already used by another service." });
  });
});

describe("services – deleteService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes the service by id", async () => {
    mockDb.service.delete.mockResolvedValue({ id: 3 });
    await deleteService(3, makeFormData({}));
    expect(mockDb.service.delete).toHaveBeenCalledWith({ where: { id: 3 } });
  });

  it("revalidates relevant paths after delete", async () => {
    mockDb.service.delete.mockResolvedValue({ id: 3 });
    await deleteService(3, makeFormData({}));
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/services");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });
});
