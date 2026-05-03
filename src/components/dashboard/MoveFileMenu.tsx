"use client";

import { useTransition } from "react";
import { moveFile } from "@/lib/actions/media";
import { useRouter } from "next/navigation";

type Folder = { id: number; name: string };

export default function MoveFileMenu({
  fileId,
  currentFolderId,
  folders,
}: {
  fileId: number;
  currentFolderId: number | null;
  folders: Folder[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const folderId = value === "" ? null : parseInt(value);
    if (folderId === currentFolderId) return;
    startTransition(async () => {
      await moveFile(fileId, folderId);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1">
      <svg className="w-3 h-3 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
      </svg>
      <select
        value={currentFolderId ?? ""}
        onChange={handleChange}
        disabled={isPending}
        title="Move to folder"
        className="flex-1 text-[10px] text-gray-500 border border-gray-200 rounded-md px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#1b4f72]/20 bg-white cursor-pointer disabled:opacity-50 truncate"
      >
        <option value="">Root</option>
        {folders.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
}
