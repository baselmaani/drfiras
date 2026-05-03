"use client";

import { useState, useTransition } from "react";
import { createFolder } from "@/lib/actions/media";
import { useRouter } from "next/navigation";

export default function NewFolderButton({ parentId }: { parentId: number | null }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      await createFolder(name.trim(), parentId);
      setName("");
      setOpen(false);
      router.refresh();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1b4f72] transition-colors w-full py-1.5 px-1 rounded-lg hover:bg-gray-50"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Folder
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        placeholder="Folder name"
        className="flex-1 min-w-0 text-xs border border-[#1b4f72]/30 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1b4f72]/40"
      />
      <button
        type="submit"
        disabled={isPending || !name.trim()}
        className="text-xs bg-[#1b4f72] text-white px-2 py-1.5 rounded-lg disabled:opacity-40 hover:bg-[#154460]"
      >
        {isPending ? "…" : "✓"}
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setName(""); }}
        className="text-xs text-gray-400 hover:text-gray-600 px-1 py-1.5"
      >
        ✕
      </button>
    </form>
  );
}
