"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";

const MediaPicker = dynamic(() => import("./MediaPicker"), { ssr: false });

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  label?: string;
  required?: boolean;
  onUpload?: (url: string) => void;
}

export function ImageUpload({ name, defaultValue = "", label, required, onUpload }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url);
      onUpload?.(data.url);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handlePickerSelect(pickedUrls: string[]) {
    if (pickedUrls.length > 0) {
      setUrl(pickedUrls[0]);
      onUpload?.(pickedUrls[0]);
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden input carries the URL into the form submission */}
      <input type="hidden" name={name} value={url} />

      <div className="flex gap-2 flex-wrap">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://... or upload below"
          className="flex-1 min-w-0 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
        />
        {/* Upload from device */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-[#1b4f72] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Upload
            </>
          )}
        </button>
        {/* Pick from library */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#c9a84c]/50 text-sm font-medium text-[#8a6f2e] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Library
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />

      {error && <p className="text-red-600 text-xs">{error}</p>}

      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Preview"
          className="mt-2 h-32 w-auto rounded-xl object-cover border border-gray-100 max-w-full"
        />
      )}

      {pickerOpen && (
        <MediaPicker
          onSelect={handlePickerSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
