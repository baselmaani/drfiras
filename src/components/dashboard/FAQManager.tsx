"use client";
import { useState, useTransition } from "react";
import { updateSettings } from "@/lib/actions/settings";

export type FAQItem = { question: string; answer: string };

const EMPTY: FAQItem = { question: "", answer: "" };

export function FAQManager({ initial }: { initial: FAQItem[] }) {
  const [items, setItems] = useState<FAQItem[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<FAQItem>(EMPTY);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save() {
    const fd = new FormData();
    fd.append("faqItems", JSON.stringify(items));
    startTransition(async () => {
      const result = await updateSettings(null, fd);
      setMessage(result.success ? "Saved!" : (result.error ?? "Error"));
      setTimeout(() => setMessage(null), 3000);
    });
  }

  function addItem() {
    if (!draft.question.trim()) return;
    setItems((prev) => [...prev, { ...draft }]);
    setDraft(EMPTY);
    setAdding(false);
  }

  function updateItem() {
    if (editing === null || !draft.question.trim()) return;
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
              <div className="p-4 space-y-3">
                <input
                  value={draft.question}
                  onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
                  placeholder="Question"
                />
                <textarea
                  rows={3}
                  value={draft.answer}
                  onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 resize-none"
                  placeholder="Answer"
                />
                <div className="flex gap-2">
                  <button onClick={updateItem} className="text-sm px-4 py-2 bg-[#1b4f72] text-white rounded-lg hover:bg-[#154460]">Save</button>
                  <button onClick={() => { setEditing(null); setDraft(EMPTY); }} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{item.question}</p>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{item.answer}</p>
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
        <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <input
            value={draft.question}
            onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="Question"
          />
          <textarea
            rows={3}
            value={draft.answer}
            onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white resize-none"
            placeholder="Answer"
          />
          <div className="flex gap-2">
            <button onClick={addItem} className="text-sm px-4 py-2 bg-[#1b4f72] text-white rounded-lg hover:bg-[#154460]">Add</button>
            <button onClick={() => { setAdding(false); setDraft(EMPTY); }} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => { setAdding(true); setEditing(null); setDraft(EMPTY); }}
          className="w-full text-sm py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#1b4f72] hover:text-[#1b4f72] transition-colors"
        >
          + Add FAQ item
        </button>
      )}

      <button onClick={save} disabled={isPending} className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60">
        {isPending ? "Saving…" : "Save All FAQ Items"}
      </button>
    </div>
  );
}
