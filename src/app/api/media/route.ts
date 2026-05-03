import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");
  if (!session || session.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const folderParam = searchParams.get("folder");
  const all = searchParams.get("all") === "1";

  // folderId: null = root, number = specific folder, "all" = no filter
  const folderId = folderParam ? parseInt(folderParam) : null;

  const [files, folders] = await Promise.all([
    db.mediaFile.findMany({
      where: all ? undefined : { folderId },
      orderBy: { createdAt: "desc" },
    }),
    all
      ? Promise.resolve([])
      : db.mediaFolder.findMany({
          where: { parentId: folderId },
          orderBy: { name: "asc" },
        }),
  ]);

  return NextResponse.json({ files, folders });
}

// Called by the client after a successful client-side upload to register the
// file in the database. Works in both local dev and production.
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");
  if (!session || session.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, name, size, mimeType, folderId } = await request.json();
  if (!url || !name || !mimeType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const validFolderId =
    folderId != null ? parseInt(String(folderId)) : null;

  const record = await db.mediaFile.upsert({
    where: { url },
    update: { folderId: validFolderId },
    create: {
      url,
      name,
      size: size ?? 0,
      mimeType,
      folderId: validFolderId,
    },
  });

  return NextResponse.json({ file: record });
}
