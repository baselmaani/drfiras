"use client";
import { useState } from "react";

export type FAQItem = { question: string; answer: string };

const EMPTY: FAQItem = { question: "", answer: "" };

export function InlineFAQManager({
  initial,
  name,
}: {
  initial: FAQItem[];
  name: string;
}) {
  const [items, setItems] = useState<FAQItem[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<FAQItem>(EMPTY);
  const [adding, setAdding] = useState(false);

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
    <div className="space-y-4">
      {/* Hidden input carries the JSON value with the form */}
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl bg-white overflow-hidden"
          >
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
                  <button
                    type="button"
                    onClick={updateItem}
                    className="text-sm px-4 py-2 bg-[#1b4f72] text-white rounded-lg hover:bg-[#154460]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null);
                      setDraft(EMPTY);
                    }}
                    className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{item.question}</p>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{item.answer}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(index)}
                    className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    Delete
                  </button>
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
            <button
              type="button"
              onClick={addItem}
              className="text-sm px-4 py-2 bg-[#1b4f72] text-white rounded-lg hover:bg-[#154460]"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setDraft(EMPTY);
              }}
              className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setAdding(true);
            setEditing(null);
            setDraft(EMPTY);
          }}
          className="text-sm px-4 py-2 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#1b4f72] hover:text-[#1b4f72] w-full transition-colors"
        >
          + Add FAQ item
        </button>
      )}
    </div>
  );
}
