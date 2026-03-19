"use client";
import { useState, useTransition } from "react";
import { updateSettings } from "@/lib/actions/settings";

export type GlanceItem = { label: string; value: string };

const EMPTY: GlanceItem = { label: "", value: "" };

export function AtAGlanceManager({ initial }: { initial: GlanceItem[] }) {
  const [items, setItems] = useState<GlanceItem[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<GlanceItem>(EMPTY);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save() {
    const fd = new FormData();
    fd.append("glanceItems", JSON.stringify(items));
    startTransition(async () => {
      const result = await updateSettings(null, fd);
      setMessage(result.success ? "Saved!" : (result.error ?? "Error"));
      setTimeout(() => setMessage(null), 3000);
    });
  }

  function addItem() {
    if (!draft.label.trim()) return;
    setItems((prev) => [...prev, { ...draft }]);
    setDraft(EMPTY);
    setAdding(false);
  }

  function updateItem() {
    if (editing === null || !draft.label.trim()) return;
    setItems((prev) => prev.map((item, i) => (i === editing ? { ...draft } : item)));
    setEditing(null);
    setDraft(EMPTY);
  }

  function deleteItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function startEdit(index: number) {
    setEditing(index);
    setDraft({ ...items[index] });
    setAdding(false);
  }

  const ItemForm = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
          <input
            value={draft.label}
            onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="e.g. GDC Number"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
          <input
            value={draft.value}
            onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="e.g. 123456"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="text-sm px-4 py-2 bg-[#1b4f72] text-white rounded-lg hover:bg-[#154460]">Save</button>
        <button onClick={onCancel} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-4">
      {message && (
        <div className={`text-sm px-4 py-3 rounded-xl ${message === "Saved!" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
            {editing === index ? (
              <div className="p-4">
                <ItemForm onSave={updateItem} onCancel={() => { setEditing(null); setDraft(EMPTY); }} />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</span>
                  <p className="font-medium text-gray-800 text-sm">{item.value}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(index)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Edit</button>
                  <button onClick={() => deleteItem(index)} className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <ItemForm onSave={addItem} onCancel={() => { setAdding(false); setDraft(EMPTY); }} />
        </div>
      ) : (
        <button
          onClick={() => { setAdding(true); setEditing(null); setDraft(EMPTY); }}
          className="w-full text-sm py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#1b4f72] hover:text-[#1b4f72] transition-colors"
        >
          + Add item
        </button>
      )}

      <button onClick={save} disabled={isPending} className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60">
        {isPending ? "Saving…" : "Save All Items"}
      </button>
    </div>
  );
}
