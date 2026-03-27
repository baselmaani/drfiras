import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/db", () => ({
  db: {
    siteSetting: {
      upsert: vi.fn(),
    },
  },
}));

import { updateSettings } from "@/lib/actions/settings";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

const mockDb = db as unknown as {
  siteSetting: { upsert: ReturnType<typeof vi.fn> };
};

describe("settings – updateSettings", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns success when all upserts succeed", async () => {
    mockDb.siteSetting.upsert.mockResolvedValue({});
    const result = await updateSettings(
      null,
      makeFormData({ heroTitle: "Welcome", heroSubtitle: "Best clinic" })
    );
    expect(result).toEqual({ success: true });
  });

  it("calls upsert for each form field", async () => {
    mockDb.siteSetting.upsert.mockResolvedValue({});
    await updateSettings(
      null,
      makeFormData({ heroTitle: "Hello", heroSubtitle: "World", footerTagline: "Dr. Firas" })
    );
    expect(mockDb.siteSetting.upsert).toHaveBeenCalledTimes(3);
  });

  it("upserts with correct key/value structure", async () => {
    mockDb.siteSetting.upsert.mockResolvedValue({});
    await updateSettings(null, makeFormData({ heroTitle: "My Title" }));
    expect(mockDb.siteSetting.upsert).toHaveBeenCalledWith({
      where: { key: "heroTitle" },
      update: { value: "My Title" },
      create: { key: "heroTitle", value: "My Title" },
    });
  });

  it("revalidates all relevant paths after saving", async () => {
    mockDb.siteSetting.upsert.mockResolvedValue({});
    await updateSettings(null, makeFormData({ heroTitle: "X" }));
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/content/hero");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/content/footer");
  });

  it("returns error object when db throws", async () => {
    mockDb.siteSetting.upsert.mockRejectedValue(new Error("DB down"));
    const result = await updateSettings(null, makeFormData({ heroTitle: "X" }));
    expect(result).toEqual({
      success: false,
      error: "Failed to save settings. Please try again.",
    });
  });

  it("handles empty form data gracefully (no upserts)", async () => {
    const result = await updateSettings(null, makeFormData({}));
    expect(result).toEqual({ success: true });
    expect(mockDb.siteSetting.upsert).not.toHaveBeenCalled();
  });
});
