import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Handles Vercel Blob client-side upload events:
 *   1. blob.generate-client-token  – browser requests a short-lived upload token
 *   2. blob.upload-completed       – Vercel notifies us after the file lands in Blob
 *
 * Files are uploaded directly from the browser to Vercel Blob, so they never
 * pass through this serverless function body — no 4.5 MB size limit applies.
 */
export async function POST(request: Request): Promise<Response> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!session || session.value !== "1") {
          throw new Error("Unauthorized");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "video/quicktime",
            "video/webm",
            "video/x-msvideo",
            "video/x-matroska",
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
          tokenPayload: clientPayload ?? "",
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Called by Vercel servers after upload in production.
        // In local dev this won't fire; the client calls POST /api/media directly instead.
        try {
          const payload = tokenPayload ? JSON.parse(tokenPayload) : {};
          const folderId =
            payload.folderId != null ? parseInt(String(payload.folderId)) : null;
          const validFolderId = folderId && !isNaN(folderId) ? folderId : null;

          await db.mediaFile.upsert({
            where: { url: blob.url },
            update: { folderId: validFolderId },
            create: {
              url: blob.url,
              name: payload.name ?? blob.pathname.split("/").pop() ?? blob.pathname,
              size: payload.size ?? 0,
              mimeType: blob.contentType,
              folderId: validFolderId,
            },
          });
        } catch (err) {
          console.error("onUploadCompleted DB error:", err);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
