"use client";
import { useTransition } from "react";

export function DeleteButton({
  id,
  action,
  label = "Delete",
}: {
  id: number;
  action: (id: number, _fd: FormData) => Promise<void>;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Are you sure you want to delete this item?")) return;
    startTransition(() => {
      const fd = new FormData();
      action(id, fd);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50 transition-colors"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
