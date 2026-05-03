"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

type MediaFile = {
  id: number;
  url: string;
  name: string;
  size: number;
  mimeType: string;
  folderId: number | null;
  createdAt: string;
};

type Folder = {
  id: number;
  name: string;
  parentId: number | null;
};

interface MediaPickerProps {
  onSelect: (urls: string[]) => void;
  onClose: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

export default function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  // breadcrumb: [{id, name}], null id = root
  const [breadcrumb, setBreadcrumb] = useState<{ id: number | null; name: string }[]>([
    { id: null, name: "All Files" },
  ]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (folderId: number | null, isAll: boolean) => {
    setLoading(true);
    try {
      const url = isAll
        ? "/api/media?all=1"
        : folderId !== null
        ? `/api/media?folder=${folderId}`
        : "/api/media";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setFiles(Array.isArray(data.files) ? data.files : []);
      setFolders(Array.isArray(data.folders) ? data.folders : []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: show root
  useEffect(() => {
    load(null, false);
  }, [load]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function openFolder(folder: Folder) {
    setCurrentFolder(folder.id);
    setBreadcrumb((prev) => [...prev, { id: folder.id, name: folder.name }]);
    setSearch("");
    load(folder.id, false);
  }

  function navigateTo(index: number) {
    const crumb = breadcrumb[index];
    const newCrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newCrumb);
    setCurrentFolder(crumb.id);
    setSearch("");
    // index 0 with id=null is "All Files" which shows root
    if (crumb.id === null && index === 0) {
      load(null, false);
    } else {
      load(crumb.id, false);
    }
  }

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadFiles = Array.from(e.target.files ?? []);
    if (!uploadFiles.length) return;
    setUploadError("");
    setUploading(true);
    const errs: string[] = [];
    const added: MediaFile[] = [];
    for (const file of uploadFiles) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        if (currentFolder !== null) fd.append("folderId", String(currentFolder));
        const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
        const data = await res.json();
        if (!res.ok) {
          errs.push(`${file.name}: ${data.error || "Upload failed"}`);
        } else if (data.file) {
          added.push({ ...data.file, createdAt: data.file.createdAt ?? new Date().toISOString() });
        }
      } catch {
        errs.push(`${file.name}: Upload failed`);
      }
    }
    if (errs.length) setUploadError(errs.join(" · "));
    if (added.length) {
      setFiles((prev) => {
        const existingUrls = new Set(prev.map((f) => f.url));
        const fresh = added.filter((f) => !existingUrls.has(f.url));
        return [...fresh, ...prev];
      });
    }
    setUploading(false);
    if (uploadInputRef.current) uploadInputRef.current.value = "";
  }

  function handleConfirm() {
    if (selected.size > 0) {
      onSelect(Array.from(selected));
      onClose();
    }
  }

  function toggleSelect(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  const isSearching = search.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-4 sm:inset-8 lg:inset-12 xl:inset-16 bg-white rounded-2xl z-50 flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#1b4f72]" style={{ fontFamily: "var(--font-playfair)" }}>
              Media Library
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{files.length} file{files.length !== 1 ? "s" : ""} · {folders.length} folder{folders.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <label className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-gray-300 text-xs font-medium text-gray-600 cursor-pointer hover:border-[#1b4f72] hover:text-[#1b4f72] transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              {uploading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload Here
                </>
              )}
              <input ref={uploadInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska" multiple className="hidden" onChange={handleUpload} />
            </label>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Breadcrumb + Search */}
        <div className="px-5 py-3 border-b border-gray-50 flex-shrink-0 flex items-center gap-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <button
                  type="button"
                  onClick={() => navigateTo(i)}
                  className={`hover:text-[#1b4f72] transition-colors ${i === breadcrumb.length - 1 ? "text-gray-700 font-medium" : ""}`}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/20 focus:border-[#1b4f72]"
            />
          </div>
        </div>

        {uploadError && (
          <p className="text-red-600 text-xs px-5 pt-2 flex-shrink-0">{uploadError}</p>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading…
            </div>
          ) : (
            <>
              {/* Folders row (hidden when searching) */}
              {!isSearching && folders.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Folders</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => openFolder(folder)}
                        className="flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 border-transparent hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all group"
                      >
                        <FolderIcon className="w-10 h-10 text-[#c9a84c]" />
                        <p className="text-[10px] text-gray-600 mt-1.5 text-center line-clamp-2 leading-tight">{folder.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files label */}
              {!isSearching && folders.length > 0 && files.length > 0 && (
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Files</p>
              )}

              {/* Files grid */}
              {filtered.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-12">
                  {isSearching ? "No files match your search." : folders.length > 0 ? "No files in this folder." : "No files yet — upload some!"}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {filtered.map((file) => {
                    const isSelected = selected.has(file.url);
                    const video = file.mimeType.startsWith("video/");
                    return (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => toggleSelect(file.url)}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all focus:outline-none ${
                          isSelected ? "border-[#1b4f72] shadow-lg shadow-[#1b4f72]/20" : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <div className="relative aspect-square bg-gray-100">
                          {video ? (
                            <>
                              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                              <video src={file.url} className="absolute inset-0 w-full h-full object-cover" preload="metadata" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow">
                                  <svg className="w-3.5 h-3.5 text-[#1b4f72] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            </>
                          ) : (
                            <Image src={file.url} alt={file.name} fill className="object-cover" unoptimized />
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#1b4f72]/20 flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-[#1b4f72] flex items-center justify-center shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="px-1.5 py-1 bg-white">
                          <p className="text-[10px] text-gray-600 truncate">{file.name}</p>
                          <p className="text-[9px] text-gray-400">{formatBytes(file.size)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-400">
            {selected.size === 0
              ? "Click files to select — multiple allowed"
              : `${selected.size} file${selected.size !== 1 ? "s" : ""} selected`}
          </p>
          <div className="flex gap-2">
            {selected.size > 0 && (
              <button type="button" onClick={() => setSelected(new Set())} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-100 transition-colors">
                Clear
              </button>
            )}
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-5 py-2 rounded-xl bg-[#1b4f72] text-white text-sm font-medium hover:bg-[#154460] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {selected.size > 1 ? `Use ${selected.size} Files` : "Use Selected"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
