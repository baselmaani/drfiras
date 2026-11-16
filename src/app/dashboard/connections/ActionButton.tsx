"use client";
import { useTransition } from "react";

/** A small confirm-then-run button for server actions that take one string argument. */
export function ActionButton({
  action,
  arg,
  label,
  confirmText,
}: {
  action: (arg: string) => Promise<void>;
  arg: string;
  label: string;
  confirmText: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmText)) return;
        startTransition(async () => {
          try {
            await action(arg);
          } catch {
            alert("That didn't work. Refresh the page and try again.");
          }
        });
      }}
      className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 transition-colors"
    >
      {pending ? "Working…" : label}
    </button>
  );
}
