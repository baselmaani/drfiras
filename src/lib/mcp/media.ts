import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { del, put } from "@vercel/blob";
import { db } from "@/lib/db";
import type { Row } from "./entities";
import { ToolError } from "./errors";
import { auditMediaChange, type Actor } from "./write";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_REDIRECTS = 3;

/** True for loopback, private, link-local, CGNAT, multicast and other non-public addresses. */
export function isPrivateAddress(address: string): boolean {
  const v4 = address.startsWith("::ffff:") ? address.slice(7) : address;
  if (isIP(v4) === 4) {
    const [a, b] = v4.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  const v6 = address.toLowerCase();
  return (
    v6 === "::" ||
    v6 === "::1" ||
    v6.startsWith("fc") ||
    v6.startsWith("fd") ||
    v6.startsWith("fe8") ||
    v6.startsWith("fe9") ||
    v6.startsWith("fea") ||
    v6.startsWith("feb") ||
    v6.startsWith("ff")
  );
}

/** Blocks requests into the server's own network (SSRF): https only, every resolved address public. */
async function assertPublicHttps(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ToolError("That is not a valid URL.");
  }
  if (url.protocol !== "https:") throw new ToolError("Only https:// image URLs can be added.");
  if (url.username || url.password) throw new ToolError("URLs with credentials are not allowed.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true }).catch(() => []);
  if (!addresses.length) throw new ToolError("Couldn't resolve that host.");
  if (addresses.some(({ address }) => isPrivateAddress(address))) throw new ToolError("That address is not allowed.");
  return url;
}

/** Fetches with redirects followed by hand, so every hop passes the SSRF check. */
async function fetchPublic(raw: string): Promise<Response> {
  let url = await assertPublicHttps(raw);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15_000) }).catch(() => null);
    if (!res) throw new ToolError("Couldn't download that image.");
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      url = await assertPublicHttps(new URL(location, url).toString());
      continue;
    }
    if (!res.ok) throw new ToolError(`Couldn't download that image (HTTP ${res.status}).`);
    return res;
  }
  throw new ToolError("Too many redirects.");
}

async function readCapped(res: Response): Promise<Buffer> {
  const declared = Number(res.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) throw new ToolError("The image is larger than 10 MB.");
  const reader = res.body?.getReader();
  if (!reader) throw new ToolError("Empty response.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      throw new ToolError("The image is larger than 10 MB.");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

const slugName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "image";

async function assertFolder(folderId: number | null | undefined) {
  if (folderId == null) return null;
  const folder = await db.mediaFolder.findUnique({ where: { id: folderId }, select: { id: true } });
  if (!folder) throw new ToolError(`No media folder with id ${folderId}.`);
  return folderId;
}

/**
 * Copies an image from a public URL into the site's storage (Vercel Blob) and adds it to the
 * media library. Hot-linked images break when the source changes, so they are always copied.
 */
export async function uploadFromUrl(actor: Actor, input: { url: string; name?: string; folderId?: number | null }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new ToolError("Image storage (Vercel Blob) is not configured on this deployment.");
  const folderId = await assertFolder(input.folderId);
  const res = await fetchPublic(input.url);
  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const ext = TYPES[type];
  if (!ext) throw new ToolError("Only JPEG, PNG, WebP, AVIF or GIF images can be added.");
  const bytes = await readCapped(res);
  const base = slugName(input.name || new URL(input.url).pathname.split("/").pop() || "image");
  const blob = await put(`${base}.${ext}`, bytes, { access: "public", contentType: type, addRandomSuffix: true });
  const file = await db.mediaFile.create({
    data: { url: blob.url, name: `${base}.${ext}`, size: bytes.length, mimeType: type, folderId },
  });
  await auditMediaChange(actor, null, file as unknown as Row);
  return file;
}

export async function listMedia(opts: { folderId?: number | null; query?: string; limit: number; offset: number }) {
  const where = {
    ...(opts.folderId !== undefined ? { folderId: opts.folderId } : {}),
    ...(opts.query ? { name: { contains: opts.query, mode: "insensitive" as const } } : {}),
  };
  const [total, files] = await Promise.all([
    db.mediaFile.count({ where }),
    db.mediaFile.findMany({ where, orderBy: { createdAt: "desc" }, skip: opts.offset, take: opts.limit }),
  ]);
  return { total, files };
}

export async function listFolders() {
  const folders = await db.mediaFolder.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { files: true } } },
  });
  return folders.map((f) => ({ id: f.id, name: f.name, parentId: f.parentId, files: f._count.files }));
}

/** Where a media URL is still used on the site. */
export async function mediaUsage(url: string) {
  const has = { contains: url };
  const [posts, services, cases, gallery, settings] = await Promise.all([
    db.post.findMany({
      where: { OR: [{ content: has }, { coverImage: has }, { ogImage: has }] },
      select: { id: true, title: true },
    }),
    db.service.findMany({
      where: {
        OR: [{ content: has }, { heroImage: has }, { caseImages: has }, { ogImage: has }, { icon: has }],
      },
      select: { id: true, title: true },
    }),
    db.beforeAfter.findMany({
      where: { OR: [{ beforeImage: has }, { afterImage: has }] },
      select: { id: true, title: true },
    }),
    db.galleryImage.findMany({ where: { image: has }, select: { id: true, title: true } }),
    db.siteSetting.findMany({ where: { value: has }, select: { key: true } }),
  ]);
  return [
    ...posts.map((p) => `post #${p.id} "${p.title}"`),
    ...services.map((s) => `service #${s.id} "${s.title}"`),
    ...cases.map((c) => `before_after #${c.id} "${c.title}"`),
    ...gallery.map((g) => `gallery_image #${g.id} "${g.title}"`),
    ...settings.map((s) => `setting ${s.key}`),
  ];
}

export async function updateMediaFile(actor: Actor, id: number, data: { name?: string; folderId?: number | null }) {
  const before = await db.mediaFile.findUnique({ where: { id } });
  if (!before) throw new ToolError(`No media file with id ${id}.`);
  if (data.name === undefined && data.folderId === undefined) throw new ToolError("Nothing to change.");
  const folderId = data.folderId === undefined ? undefined : await assertFolder(data.folderId);
  const after = await db.mediaFile.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim().slice(0, 200) } : {}),
      ...(folderId !== undefined ? { folderId } : {}),
    },
  });
  await auditMediaChange(actor, before as unknown as Row, after as unknown as Row);
  return after;
}

export async function deleteMediaFile(actor: Actor, id: number, confirm: string) {
  const file = await db.mediaFile.findUnique({ where: { id } });
  if (!file) throw new ToolError(`No media file with id ${id}.`);
  if (confirm.trim() !== file.name) throw new ToolError(`Not deleted. To confirm, pass confirm exactly equal to the file name: "${file.name}".`);
  const usedBy = await mediaUsage(file.url);
  if (usedBy.length)
    throw new ToolError(`Not deleted: the image is still used by ${usedBy.slice(0, 10).join("; ")}. Replace it there first.`);
  try {
    await del(file.url);
  } catch {
    // Already gone from storage: still remove the library entry.
  }
  await db.mediaFile.delete({ where: { id } });
  await auditMediaChange(actor, file as unknown as Row, null);
  return { deleted: true, id, name: file.name, note: "The file is removed from storage permanently; this can't be undone." };
}
