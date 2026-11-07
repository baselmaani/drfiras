import { describe, it, expect, vi } from "vitest";
import { readdirSync, readFileSync } from "fs";
import path from "path";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: "1" }) }),
}));
vi.mock("@/lib/db", () => ({
  db: { siteSetting: { upsert: vi.fn() }, post: { delete: vi.fn() } },
}));

import { updateSettings } from "@/lib/actions/settings";
import { deletePost } from "@/lib/actions/posts";
import { db } from "@/lib/db";

// Read-only actions the public site calls for logged-out visitors.
const PUBLIC_ACTIONS = new Set(["getMenuItems"]);

describe("dashboard action guard", () => {
  it("blocks a forged admin-session=1 cookie before touching the database", async () => {
    process.env.ADMIN_SECRET = "test-secret";
    await expect(updateSettings(null, new FormData())).rejects.toThrow("Unauthorized");
    await expect(deletePost(1, new FormData())).rejects.toThrow("Unauthorized");
    expect(db.siteSetting.upsert).not.toHaveBeenCalled();
    expect(db.post.delete).not.toHaveBeenCalled();
  });

  it("guards every exported action, including ones added later", () => {
    const dir = path.resolve(__dirname, "../../lib/actions");
    const unguarded: string[] = [];
    for (const file of readdirSync(dir)) {
      const source = readFileSync(path.join(dir, file), "utf8");
      const parts = source.split(/^export async function /m).slice(1);
      for (const part of parts) {
        const name = part.slice(0, part.indexOf("("));
        const guarded = /^\s*await requireAdmin\(\);/m.test(part.split(/^}$/m)[0]);
        if (!guarded && !PUBLIC_ACTIONS.has(name)) unguarded.push(`${file}:${name}`);
      }
    }
    expect(unguarded).toEqual([]);
  });
});
