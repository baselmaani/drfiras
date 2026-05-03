"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska";

export default function MediaUploader({ folderId }: { folderId?: number | null }) {
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setErrors([]);
    setProgress({ done: 0, total: files.length });

    const errs: string[] = [];
    // Upload sequentially to avoid overwhelming the server with large videos
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        if (folderId) fd.append("folderId", String(folderId));
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) errs.push(`${file.name}: ${data.error || "Upload failed"}`);
      } catch {
        errs.push(`${file.name}: Upload failed`);
      }
      setProgress((p) => p ? { done: p.done + 1, total: p.total } : null);
    }

    setErrors(errs);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  const uploading = progress !== null;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 bg-[#1b4f72] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#154460] transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {progress!.done}/{progress!.total} uploading…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Files
          </>
        )}
      </button>
      {errors.map((e, i) => (
        <p key={i} className="text-red-600 text-xs">{e}</p>
      ))}
      <p className="text-gray-400 text-[10px]">Images &amp; videos · max 200 MB per file</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
}
