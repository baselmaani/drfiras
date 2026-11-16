import { db } from "@/lib/db";
import { ENTITIES, entityDef, findRecord, type EntityDef, type Row } from "./entities";
import { ToolError } from "./errors";
import { normaliseSettings } from "./settings";

/**
 * The only path by which the AI connector changes content: validate → snapshot before → write →
 * audit row (before/after). Every change can be listed with listRevisions and undone with
 * restoreRevision. The MCP route refreshes the public cache after any mutating tool.
 */

export type Actor = { tool: string; clientName: string };
type Json = Record<string, unknown>;

/** Dates become ISO strings, so a snapshot round-trips through the JSON column and back into Prisma. */
const snapshot = (value: unknown): Json | null => (value == null ? null : JSON.parse(JSON.stringify(value)));

async function audit(actor: Actor, entity: string, entityId: string | number, label: string, before: unknown, after: unknown) {
  await db.mcpAuditLog.create({
    data: {
      tool: actor.tool,
      entity,
      entityId: String(entityId),
      label: label.slice(0, 300),
      before: (snapshot(before) ?? undefined) as never,
      after: (snapshot(after) ?? undefined) as never,
      clientName: actor.clientName.slice(0, 100),
    },
  });
}

/** Turns database errors into messages the assistant can act on. */
function friendly(error: unknown, def: EntityDef): never {
  const code = (error as { code?: string })?.code;
  if (code === "P2002") throw new ToolError(`Another ${def.label.toLowerCase()} already uses that ${def.slugField ?? "value"}.`);
  if (code === "P2003") throw new ToolError("A referenced record (serviceId / parentId) doesn't exist.");
  if (code === "P2025") throw new ToolError(`${def.label} not found.`);
  throw error;
}

function parseFields(def: EntityDef, fields: Json, mode: "create" | "update") {
  const schema = mode === "create" ? def.schema : def.schema.partial();
  const result = schema.safeParse(fields);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".") || "(fields)"}: ${i.message}`);
    throw new ToolError(`Not saved:\n${issues.join("\n")}\nCall get_site_overview for the fields of each content type.`);
  }
  const data = result.data as Json;
  if (mode === "create") {
    const missing = def.required.filter((k) => data[k] === undefined || data[k] === null || data[k] === "");
    if (missing.length) throw new ToolError(`Missing required fields: ${missing.join(", ")}.`);
  } else if (!Object.keys(data).length) {
    throw new ToolError("No fields to change.");
  }
  return data;
}

export function describeRecord(def: EntityDef, row: Row) {
  const url = def.publicUrl(row);
  return { id: row.id, label: def.labelOf(row), liveUrl: url, adminUrl: def.adminUrl(row) };
}

export async function createRecord(actor: Actor, key: string, fields: Json) {
  const def = entityDef(key);
  const input = parseFields(def, fields, "create");
  // The owner chose "live immediately": new records are visible unless the caller says otherwise.
  if (def.visibleField && input[def.visibleField] === undefined) input[def.visibleField] = true;
  const data = await def.toData(input, null);
  let row: Row;
  try {
    row = await def.delegate().create({ data });
  } catch (e) {
    friendly(e, def);
  }
  await audit(actor, key, row.id, def.labelOf(row), null, row);
  return { created: true, ...describeRecord(def, row), record: def.present(row) };
}

export async function updateRecord(actor: Actor, key: string, idOrSlug: string | number, fields: Json) {
  const def = entityDef(key);
  const before = await findRecord(def, idOrSlug);
  const input = parseFields(def, fields, "update");
  const data = await def.toData(input, before);
  let after: Row;
  try {
    after = await def.delegate().update({ where: { id: before.id }, data });
  } catch (e) {
    friendly(e, def);
  }
  await audit(actor, key, after.id, def.labelOf(after), before, after);
  const changed = Object.keys(data).filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
  return { saved: true, changed, ...describeRecord(def, after) };
}

export async function setVisible(actor: Actor, key: string, idOrSlug: string | number, visible: boolean) {
  const def = entityDef(key);
  if (!def.visibleField) throw new ToolError(`${def.label} records can't be published or hidden.`);
  const field = def.visibleField === "enabled" ? "enabled" : "published";
  return updateRecord(actor, key, idOrSlug, { [field]: visible });
}

/** Rows deleted along with a record by ON DELETE CASCADE, kept in the snapshot so an undo brings them back. */
async function dependents(key: string, row: Row): Promise<Json> {
  if (key === "service") return { _galleryImages: await db.galleryImage.findMany({ where: { serviceId: row.id } }) };
  if (key === "menu_item") return { _children: await db.menuItem.findMany({ where: { parentId: row.id } }) };
  if (key === "media_folder") {
    const sub = await db.mediaFolder.count({ where: { parentId: row.id } });
    if (sub) throw new ToolError("This folder has sub-folders. Delete or move those first.");
    const files = await db.mediaFile.findMany({ where: { folderId: row.id }, select: { id: true } });
    return { _fileIds: files.map((f) => f.id) };
  }
  return {};
}

export async function deleteRecord(actor: Actor, key: string, idOrSlug: string | number, confirm: string) {
  const def = entityDef(key);
  const row = await findRecord(def, idOrSlug);
  const expected = String(row[def.confirmField] ?? "");
  if (confirm.trim() !== expected)
    throw new ToolError(`Not deleted. To confirm, pass confirm exactly equal to the ${def.confirmField}: "${expected}".`);
  const extra = await dependents(key, row);
  if (key === "media_folder") await db.mediaFile.updateMany({ where: { folderId: row.id }, data: { folderId: null } });
  try {
    await def.delegate().delete({ where: { id: row.id } });
  } catch (e) {
    friendly(e, def);
  }
  await audit(actor, key, row.id, def.labelOf(row), { ...row, ...extra }, null);
  const cascaded = Object.values(extra).reduce<number>((n, v) => n + (Array.isArray(v) ? v.length : 0), 0);
  return {
    deleted: true,
    id: row.id,
    label: def.labelOf(row),
    ...(cascaded && key !== "media_folder" ? { alsoDeleted: cascaded } : {}),
    undo: "restore_revision with this change's id (see list_revisions) puts it back.",
  };
}

export async function reorder(actor: Actor, key: string, ids: number[]) {
  const def = entityDef(key);
  if (!def.hasOrder) throw new ToolError(`${def.label} records have no order.`);
  if (new Set(ids).size !== ids.length) throw new ToolError("ids contains duplicates.");
  const rows = await def.delegate().findMany({ where: { id: { in: ids } } });
  if (rows.length !== ids.length) {
    const found = new Set(rows.map((r) => r.id));
    throw new ToolError(`Unknown ids: ${ids.filter((i) => !found.has(i)).join(", ")}.`);
  }
  for (const [index, id] of ids.entries()) {
    const before = rows.find((r) => r.id === id)!;
    if (before.order === index) continue;
    const after = await def.delegate().update({ where: { id }, data: { order: index } });
    await audit(actor, key, id, def.labelOf(after), before, after);
  }
  return { saved: true, order: ids };
}

export async function writeSettings(actor: Actor, values: Json) {
  const next = normaliseSettings(values);
  const keys = Object.keys(next);
  const rows = await db.siteSetting.findMany({ where: { key: { in: keys } } });
  const before = Object.fromEntries(keys.map((k) => [k, rows.find((r) => r.key === k)?.value ?? null]));
  const changed = keys.filter((k) => before[k] !== next[k]);
  if (!changed.length) return { saved: true, changed: [] };
  await db.$transaction(
    changed.map((key) =>
      db.siteSetting.upsert({ where: { key }, update: { value: next[key] }, create: { key, value: next[key] } })
    )
  );
  await audit(
    actor,
    "settings",
    "site",
    `Settings: ${changed.slice(0, 6).join(", ")}${changed.length > 6 ? "…" : ""}`,
    Object.fromEntries(changed.map((k) => [k, before[k]])),
    Object.fromEntries(changed.map((k) => [k, next[k]]))
  );
  return { saved: true, changed };
}

export async function auditMediaChange(actor: Actor, before: Row | null, after: Row | null) {
  const row = (after ?? before)!;
  await audit(actor, "media_file", row.id, String(row.name), before, after);
}

export async function listRevisions(opts: { entity?: string; entityId?: string; limit: number }) {
  const rows = await db.mcpAuditLog.findMany({
    where: {
      ...(opts.entity ? { entity: opts.entity } : {}),
      ...(opts.entityId ? { entityId: opts.entityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: opts.limit,
  });
  return rows.map((r) => ({
    revisionId: r.id,
    at: r.createdAt,
    tool: r.tool,
    entity: r.entity,
    entityId: r.entityId,
    label: r.label,
    client: r.clientName,
    kind: r.before == null ? "created" : r.after == null ? "deleted" : "changed",
    changedFields: changedFields(r.before as Json | null, r.after as Json | null),
  }));
}

export function changedFields(before: Json | null, after: Json | null) {
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
  return [...keys].filter(
    (k) => !k.startsWith("_") && k !== "updatedAt" && JSON.stringify(before?.[k]) !== JSON.stringify(after?.[k])
  );
}

const STRIP_ON_WRITE = new Set(["updatedAt"]);
const columns = (snap: Json, keepId: boolean) =>
  Object.fromEntries(
    Object.entries(snap).filter(([k]) => !k.startsWith("_") && !STRIP_ON_WRITE.has(k) && (keepId || k !== "id"))
  );

/**
 * Puts a record back to the version before (undo) or after (redo) a recorded change. A record
 * that was deleted is recreated with its original id; one that was created is deleted again.
 */
export async function restoreRevision(actor: Actor, revisionId: string, which: "before" | "after") {
  const rev = await db.mcpAuditLog.findUnique({ where: { id: revisionId } });
  if (!rev) throw new ToolError(`Revision ${revisionId} not found.`);
  const target = rev[which] as Json | null;

  if (rev.entity === "settings") {
    if (!target) throw new ToolError("Nothing to restore.");
    const current = await db.siteSetting.findMany({ where: { key: { in: Object.keys(target) } } });
    await db.$transaction(
      Object.entries(target).map(([key, value]) =>
        value === null
          ? db.siteSetting.deleteMany({ where: { key } })
          : db.siteSetting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } })
      )
    );
    await audit(
      actor,
      "settings",
      "site",
      `Restored: ${rev.label}`,
      Object.fromEntries(Object.keys(target).map((k) => [k, current.find((c) => c.key === k)?.value ?? null])),
      target
    );
    return { restored: true, settings: Object.keys(target) };
  }

  if (rev.entity === "media_file") {
    const file = await db.mediaFile.findUnique({ where: { id: Number(rev.entityId) } });
    if (!file) throw new ToolError("That media file was deleted from storage and can't be restored. Upload it again.");
    if (!target) throw new ToolError("Nothing to restore.");
    const after = await db.mediaFile.update({
      where: { id: file.id },
      data: { name: String(target.name), folderId: (target.folderId as number | null) ?? null },
    });
    await auditMediaChange(actor, file as unknown as Row, after as unknown as Row);
    return { restored: true, id: file.id, name: after.name };
  }

  const def = (ENTITIES as Record<string, EntityDef>)[rev.entity];
  if (!def) throw new ToolError(`Can't restore "${rev.entity}" records.`);
  const id = Number(rev.entityId);
  const current = await def.delegate().findUnique({ where: { id } });

  if (!target) {
    if (!current) return { restored: true, note: "Already gone." };
    await def.delegate().delete({ where: { id } });
    await audit(actor, rev.entity, id, def.labelOf(current), current, null);
    return { restored: true, deleted: id };
  }

  let row: Row;
  try {
    row = current
      ? await def.delegate().update({ where: { id }, data: columns(target, false) })
      : await def.delegate().create({ data: columns(target, true) });
  } catch (e) {
    friendly(e, def);
  }
  // Bring back rows the original delete removed by cascade.
  if (!current) {
    for (const img of (target._galleryImages as Json[] | undefined) ?? [])
      await db.galleryImage.create({ data: columns(img, true) as never }).catch(() => {});
    for (const child of (target._children as Json[] | undefined) ?? [])
      await db.menuItem.create({ data: columns(child, true) as never }).catch(() => {});
    const fileIds = (target._fileIds as number[] | undefined) ?? [];
    if (fileIds.length) await db.mediaFile.updateMany({ where: { id: { in: fileIds } }, data: { folderId: id } });
  }
  await audit(actor, rev.entity, id, def.labelOf(row), current, row);
  return { restored: true, ...describeRecord(def, row) };
}
