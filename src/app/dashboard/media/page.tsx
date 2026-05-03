import { db } from "@/lib/db";
import { deleteMediaFile, deleteFolder } from "@/lib/actions/media";
import { DeleteButton } from "@/components/dashboard/DeleteButton";
import CopyButton from "@/components/dashboard/CopyButton";
import MediaUploader from "@/components/dashboard/MediaUploader";
import NewFolderButton from "@/components/dashboard/NewFolderButton";
import MoveFileMenu from "@/components/dashboard/MoveFileMenu";
import Image from "next/image";
import Link from "next/link";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isVideo(mimeType: string) {
  return mimeType.startsWith("video/");
}

const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string; all?: string }>;
}) {
  const params = await searchParams;
  const folderId = params.folder ? parseInt(params.folder) : null;
  const showAll = params.all === "1";

  const [allFolders, currentFolder, subfolders, files] = await Promise.all([
    db.mediaFolder.findMany({ orderBy: { name: "asc" } }),
    folderId ? db.mediaFolder.findUnique({ where: { id: folderId } }) : null,
    db.mediaFolder.findMany({
      where: { parentId: folderId ?? null },
      orderBy: { name: "asc" },
    }),
    showAll
      ? db.mediaFile.findMany({ orderBy: { createdAt: "desc" } })
      : db.mediaFile.findMany({
          where: { folderId: folderId ?? null },
          orderBy: { createdAt: "desc" },
        }),
  ]);

  const rootFolders = allFolders.filter((f) => f.parentId === null);
  const imageCount = files.filter((f) => !isVideo(f.mimeType)).length;
  const videoCount = files.filter((f) => isVideo(f.mimeType)).length;
  const totalCount = files.length + (showAll ? 0 : subfolders.length);

  return (
    <div className="flex gap-6 min-h-screen">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-52 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-3 sticky top-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Library
          </p>

          {/* All files */}
          <Link
            href="/dashboard/media?all=1"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors mb-0.5 ${
              showAll ? "bg-[#1b4f72] text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            All Files
          </Link>

          {/* Root */}
          <Link
            href="/dashboard/media"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
              !folderId && !showAll ? "bg-[#1b4f72] text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Root
          </Link>

          {/* Root-level folder list */}
          {rootFolders.length > 0 && (
            <>
              <div className="h-px bg-gray-100 my-2" />
              <div className="space-y-0.5">
                {rootFolders.map((folder) => (
                  <Link
                    key={folder.id}
                    href={`/dashboard/media?folder=${folder.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                      folderId === folder.id
                        ? "bg-[#1b4f72]/10 text-[#1b4f72] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FolderIcon className="w-4 h-4 text-[#c9a84c] flex-shrink-0" />
                    <span className="truncate">{folder.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* New folder */}
          <div className="mt-3 border-t border-gray-100 pt-3 px-1">
            <NewFolderButton parentId={folderId} />
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-1">
              <Link href="/dashboard/media" className="hover:text-[#1b4f72] transition-colors">
                Media
              </Link>
              {showAll && (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-gray-700">All Files</span>
                </>
              )}
              {currentFolder && (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-gray-700">{currentFolder.name}</span>
                </>
              )}
            </div>

            <h1
              className="text-2xl font-bold text-[#1b4f72]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {currentFolder?.name ?? (showAll ? "All Files" : "Media Library")}
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              {totalCount === 0
                ? "Empty"
                : [
                    imageCount > 0 && `${imageCount} image${imageCount !== 1 ? "s" : ""}`,
                    videoCount > 0 && `${videoCount} video${videoCount !== 1 ? "s" : ""}`,
                    !showAll && subfolders.length > 0 &&
                      `${subfolders.length} folder${subfolders.length !== 1 ? "s" : ""}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
            </p>
          </div>

          <MediaUploader folderId={folderId} />
        </div>

        {/* ── Subfolders grid ── */}
        {!showAll && subfolders.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Folders
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {subfolders.map((folder) => (
                <div
                  key={folder.id}
                  className="group relative bg-white border border-gray-100 rounded-2xl hover:border-[#c9a84c]/50 transition-colors overflow-hidden"
                >
                  <Link
                    href={`/dashboard/media?folder=${folder.id}`}
                    className="flex flex-col items-center justify-center py-7 px-3"
                  >
                    <FolderIcon className="w-12 h-12 text-[#c9a84c]" />
                    <p className="text-xs font-medium text-gray-700 mt-2 text-center line-clamp-2">
                      {folder.name}
                    </p>
                  </Link>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteButton id={folder.id} action={deleteFolder} label="✕" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Files grid ── */}
        {files.length === 0 && subfolders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">
            <FolderIcon className="w-14 h-14 mx-auto mb-3 text-gray-200" />
            <p className="text-lg mb-1">
              {showAll ? "No files uploaded yet" : "This folder is empty"}
            </p>
            <p className="text-sm">
              {showAll
                ? "Upload files to get started"
                : "Upload files here or create a sub-folder"}
            </p>
          </div>
        ) : files.length > 0 ? (
          <>
            {!showAll && subfolders.length > 0 && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Files
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#c9a84c]/60 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {isVideo(file.mimeType) ? (
                      <>
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                        <video
                          src={file.url}
                          className="absolute inset-0 w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                            <svg className="w-4 h-4 text-[#1b4f72] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Info + actions */}
                  <div className="p-2.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {isVideo(file.mimeType) && (
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-[#1b4f72] bg-[#1b4f72]/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
                          VIDEO
                        </span>
                      )}
                      <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>
                        {file.name}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-2">{formatBytes(file.size)}</p>

                    {/* Move to folder */}
                    {allFolders.length > 0 && (
                      <div className="mb-2">
                        <MoveFileMenu
                          fileId={file.id}
                          currentFolderId={file.folderId}
                          folders={allFolders}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <CopyButton url={file.url} />
                      <span className="text-gray-200">|</span>
                      <DeleteButton id={file.id} action={deleteMediaFile} label="Delete" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
