import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP and GIF images are allowed" }, { status: 400 });
  }

  // Limit to 10 MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File size must be under 10 MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(safeName, file, { access: "public" });

  return NextResponse.json({ url: blob.url });
}
