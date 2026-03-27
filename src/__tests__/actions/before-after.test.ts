import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/db", () => ({
  db: {
    beforeAfter: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { createBeforeAfter, updateBeforeAfter, deleteBeforeAfter } from "@/lib/actions/before-after";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

const mockDb = db as unknown as {
  beforeAfter: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

const validFields = {
  title: "Smile Makeover",
  treatment: "Veneers",
  beforeImage: "https://example.com/before.jpg",
};

describe("before-after – createBeforeAfter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error when title is missing", async () => {
    const result = await createBeforeAfter(
      null,
      makeFormData({ ...validFields, title: "" })
    );
    expect(result).toEqual({ error: "Title, treatment, and image are required." });
    expect(mockDb.beforeAfter.create).not.toHaveBeenCalled();
  });

  it("returns error when treatment is missing", async () => {
    const result = await createBeforeAfter(
      null,
      makeFormData({ ...validFields, treatment: "" })
    );
    expect(result).toEqual({ error: "Title, treatment, and image are required." });
  });

  it("returns error when beforeImage is missing", async () => {
    const result = await createBeforeAfter(
      null,
      makeFormData({ ...validFields, beforeImage: "" })
    );
    expect(result).toEqual({ error: "Title, treatment, and image are required." });
  });

  it("creates record and redirects on success", async () => {
    mockDb.beforeAfter.create.mockResolvedValue({ id: 1 });
    const result = await createBeforeAfter(null, makeFormData(validFields));
    expect(result).toBeUndefined();
    expect(mockDb.beforeAfter.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "Smile Makeover",
          treatment: "Veneers",
          beforeImage: "https://example.com/before.jpg",
        }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/before-after");
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(redirect).toHaveBeenCalledWith("/dashboard/before-after");
  });

  it("sets published=true when flag is 'on'", async () => {
    mockDb.beforeAfter.create.mockResolvedValue({ id: 2 });
    await createBeforeAfter(null, makeFormData({ ...validFields, published: "on" }));
    const callData = mockDb.beforeAfter.create.mock.calls[0][0].data;
    expect(callData.published).toBe(true);
  });

  it("defaults published=false when flag is absent", async () => {
    mockDb.beforeAfter.create.mockResolvedValue({ id: 3 });
    await createBeforeAfter(null, makeFormData(validFields));
    const callData = mockDb.beforeAfter.create.mock.calls[0][0].data;
    expect(callData.published).toBe(false);
  });

  it("parses order as integer", async () => {
    mockDb.beforeAfter.create.mockResolvedValue({ id: 4 });
    await createBeforeAfter(null, makeFormData({ ...validFields, order: "3" }));
    const callData = mockDb.beforeAfter.create.mock.calls[0][0].data;
    expect(callData.order).toBe(3);
  });
});

describe("before-after – updateBeforeAfter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error when required fields are missing", async () => {
    const result = await updateBeforeAfter(
      1,
      null,
      makeFormData({ title: "", treatment: "", beforeImage: "" })
    );
    expect(result).toEqual({ error: "Title, treatment, and image are required." });
    expect(mockDb.beforeAfter.update).not.toHaveBeenCalled();
  });

  it("updates record and redirects on success", async () => {
    mockDb.beforeAfter.update.mockResolvedValue({ id: 1 });
    const result = await updateBeforeAfter(1, null, makeFormData(validFields));
    expect(result).toBeUndefined();
    expect(mockDb.beforeAfter.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({ title: "Smile Makeover" }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/before-after");
    expect(redirect).toHaveBeenCalledWith("/dashboard/before-after");
  });
});

describe("before-after – deleteBeforeAfter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes the record by id", async () => {
    mockDb.beforeAfter.delete.mockResolvedValue({ id: 7 });
    await deleteBeforeAfter(7, makeFormData({}));
    expect(mockDb.beforeAfter.delete).toHaveBeenCalledWith({ where: { id: 7 } });
  });

  it("revalidates /dashboard/before-after and / after delete", async () => {
    mockDb.beforeAfter.delete.mockResolvedValue({ id: 7 });
    await deleteBeforeAfter(7, makeFormData({}));
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/before-after");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });
});
