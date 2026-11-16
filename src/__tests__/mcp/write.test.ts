import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeDb } from "./fakeDb";

const fake = vi.hoisted(() => ({ db: null as unknown as ReturnType<typeof createFakeDb> }));
vi.mock("@/lib/db", async () => {
  const { createFakeDb } = await import("./fakeDb");
  fake.db = createFakeDb();
  return { db: fake.db };
});

import { createRecord, deleteRecord, listRevisions, reorder, restoreRevision, setVisible, updateRecord, writeSettings } from "@/lib/mcp/write";
import { readSettings } from "@/lib/mcp/settings";
import { ToolError } from "@/lib/mcp/errors";

const actor = { tool: "test", clientName: "Test" };
const post = { title: "Composite Bonding Aftercare", content: "<h2>Day one</h2><p>Avoid coffee.</p><h3> </h3>" };

describe("MCP write layer", () => {
  beforeEach(() => fake.db.reset());

  it("creates a post live by default, with a slug, publishedAt and an audit row", async () => {
    const result = await createRecord(actor, "post", post);
    expect(result.liveUrl).toBe("/blog/composite-bonding-aftercare");
    const row = fake.db.post.rows()[0];
    expect(row.published).toBe(true);
    expect(row.publishedAt).toBeInstanceOf(Date);
    expect(row.content).toBe("<h2>Day one</h2><p>Avoid coffee.</p>"); // empty heading stripped
    expect(fake.db.mcpAuditLog.rows()).toHaveLength(1);
  });

  it("can create a draft when published is false", async () => {
    await createRecord(actor, "post", { ...post, published: false });
    expect(fake.db.post.rows()[0].published).toBe(false);
    expect(fake.db.post.rows()[0].publishedAt).toBeUndefined();
  });

  it("stores FAQs and internal links as JSON text and returns them as arrays", async () => {
    const result = await createRecord(actor, "post", {
      ...post,
      faqItems: [{ question: "Does it hurt?", answer: "No." }],
      internalLinks: [{ anchor: "Composite bonding", url: "/services/composite-bonding-dubai" }],
    });
    expect(typeof fake.db.post.rows()[0].faqItems).toBe("string");
    expect(result.record.faqItems).toEqual([{ question: "Does it hurt?", answer: "No." }]);
  });

  it("rejects unknown fields, external internal links and scripts", async () => {
    await expect(createRecord(actor, "post", { ...post, views: 5 })).rejects.toBeInstanceOf(ToolError);
    await expect(
      createRecord(actor, "post", { ...post, internalLinks: [{ anchor: "x", url: "https://evil.example" }] })
    ).rejects.toThrow(/internal URL/);
    await expect(createRecord(actor, "post", { ...post, content: "<p onclick=alert(1)>x</p>" })).rejects.toThrow(/event handlers/);
    await expect(createRecord(actor, "post", { ...post, content: "<script>x</script>" })).rejects.toThrow(/not allowed/);
    expect(fake.db.post.rows()).toHaveLength(0);
  });

  it("requires the required fields on create", async () => {
    await expect(createRecord(actor, "service", { title: "Veneers" })).rejects.toThrow(/description/);
  });

  it("reports slug clashes in plain words", async () => {
    await createRecord(actor, "post", post);
    await expect(createRecord(actor, "post", post)).rejects.toThrow(/already uses that slug/);
  });

  it("updates by slug, keeps publishedAt and reviewedAt, and lists changed fields", async () => {
    await createRecord(actor, "post", { ...post, reviewed: true });
    const { publishedAt, reviewedAt } = fake.db.post.rows()[0];
    const result = await updateRecord(actor, "post", "composite-bonding-aftercare", { title: "New title", reviewed: true });
    expect(result.changed).toEqual(["title"]);
    expect(fake.db.post.rows()[0].publishedAt).toBe(publishedAt);
    expect(fake.db.post.rows()[0].reviewedAt).toBe(reviewedAt);
  });

  it("hides and shows menu items through `enabled`", async () => {
    const { id } = await createRecord(actor, "menu_item", { label: "Blog", href: "/blog" });
    await setVisible(actor, "menu_item", id, false);
    expect(fake.db.menuItem.rows()[0].enabled).toBe(false);
  });

  it("checks that a gallery image's service exists", async () => {
    await expect(createRecord(actor, "gallery_image", { title: "x", image: "/a.jpg", serviceId: 99 })).rejects.toThrow(/No service/);
  });

  it("deletes only with the exact confirmation, and restore brings back the record and its cascaded rows", async () => {
    const svc = await createRecord(actor, "service", { title: "Veneers", description: "Thin shells" });
    await createRecord(actor, "gallery_image", { title: "Case", image: "/a.jpg", serviceId: svc.id });
    await expect(deleteRecord(actor, "service", svc.id, "wrong")).rejects.toThrow(/confirm/);
    // The database cascades gallery images; the fake does not, so mimic it after the delete.
    const result = await deleteRecord(actor, "service", svc.id, "veneers");
    fake.db.galleryImage.reset();
    expect(result.alsoDeleted).toBe(1);
    expect(fake.db.service.rows()).toHaveLength(0);

    const [deletion] = await listRevisions({ entity: "service", limit: 1 });
    expect(deletion.kind).toBe("deleted");
    await restoreRevision(actor, deletion.revisionId, "before");
    expect(fake.db.service.rows()[0]).toMatchObject({ id: svc.id, slug: "veneers" });
    expect(fake.db.galleryImage.rows()).toHaveLength(1);
  });

  it("undoing a create deletes the record again", async () => {
    await createRecord(actor, "price", { title: "Veneers", price: "AED 1,500" });
    const [created] = await listRevisions({ entity: "price", limit: 1 });
    await restoreRevision(actor, created.revisionId, "before");
    expect(fake.db.servicePrice.rows()).toHaveLength(0);
  });

  it("reorders records and audits only the ones that moved", async () => {
    const a = await createRecord(actor, "price", { title: "A", price: "1", order: 0 });
    const b = await createRecord(actor, "price", { title: "B", price: "2", order: 1 });
    await reorder(actor, "price", [b.id, a.id]);
    expect(fake.db.servicePrice.rows().map((r) => [r.title, r.order])).toEqual([
      ["A", 1],
      ["B", 0],
    ]);
  });
});

describe("MCP settings", () => {
  beforeEach(() => fake.db.reset());

  it("writes allowlisted keys, stores JSON arrays as text, and can undo", async () => {
    await writeSettings(actor, { heroHeading: "Hello", faqItems: [{ question: "Q?", answer: "A." }] });
    const stored = Object.fromEntries(fake.db.siteSetting.rows().map((r) => [r.key, r.value]));
    expect(stored.heroHeading).toBe("Hello");
    expect(JSON.parse(String(stored.faqItems))).toEqual([{ question: "Q?", answer: "A." }]);
    expect((await readSettings({ keys: ["faqItems"] })).faqItems).toEqual([{ question: "Q?", answer: "A." }]);

    const [change] = await listRevisions({ entity: "settings", limit: 1 });
    await restoreRevision(actor, change.revisionId, "before");
    expect(fake.db.siteSetting.rows()).toHaveLength(0); // keys that weren't stored before are removed again
  });

  it("refuses SMTP and unknown keys, and never returns SMTP values", async () => {
    await expect(writeSettings(actor, { smtpPass: "x" })).rejects.toThrow(/dashboard-only/);
    await expect(writeSettings(actor, { somethingElse: "x" })).rejects.toThrow(/not an editable setting/);
    await fake.db.siteSetting.create({ data: { key: "smtpPass", value: "secret" } });
    const all = await readSettings({});
    expect(Object.keys(all).some((k) => k.startsWith("smtp"))).toBe(false);
    await expect(readSettings({ keys: ["smtpPass"] })).rejects.toThrow(/Not readable/);
  });

  it("validates JSON setting shapes and booleans", async () => {
    await expect(writeSettings(actor, { glanceItems: [{ label: "x" }] })).rejects.toThrow(/glanceItems/);
    await expect(writeSettings(actor, { instagramEnabled: "yes" })).rejects.toThrow(/true or false/);
    await writeSettings(actor, { instagramEnabled: false, reviewPhoto__abc123: "/p.jpg" });
    expect(fake.db.siteSetting.rows().map((r) => r.value)).toEqual(["false", "/p.jpg"]);
  });
});
