import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  // Protect the upload endpoint — only authenticated admins
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");
  if (!session || session.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo", "video/x-matroska"];
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Only images (JPEG, PNG, WebP, GIF) and videos (MP4, MOV, WebM, AVI, MKV) are allowed" }, { status: 400 });
  }

  // Images: 10 MB limit. Videos: 200 MB limit
  const isVideo = allowedVideoTypes.includes(file.type);
  const sizeLimit = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > sizeLimit) {
    return NextResponse.json({ error: isVideo ? "Video must be under 200 MB" : "Image must be under 10 MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(safeName, file, { access: "public" });

  // Optional folder assignment
  const folderIdRaw = formData.get("folderId");
  const folderId = folderIdRaw ? parseInt(folderIdRaw as string) : null;

  // Save to media library (upsert in case of duplicates)
  const record = await db.mediaFile.upsert({
    where: { url: blob.url },
    update: { folderId },
    create: {
      url: blob.url,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      folderId,
    },
  });

  return NextResponse.json({ url: blob.url, file: record });
}
