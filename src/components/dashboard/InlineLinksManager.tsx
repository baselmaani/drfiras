"use client";
import { useState } from "react";
import type { RelatedLink } from "@/lib/internalLinks";

const EMPTY: RelatedLink = { anchor: "", url: "" };

function isDuplicate(items: RelatedLink[], candidate: RelatedLink, skipIndex?: number) {
  return items.some(
    (item, i) =>
      i !== skipIndex &&
      item.anchor.trim().toLowerCase() === candidate.anchor.trim().toLowerCase() &&
      item.url.trim() === candidate.url.trim()
  );
}

export function InlineLinksManager({
  initial,
  name,
}: {
  initial: RelatedLink[];
  name: string;
}) {
  const [items, setItems] = useState<RelatedLink[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<RelatedLink>(EMPTY);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  function validateDraft(skipIndex?: number): string | null {
    const anchor = draft.anchor.trim();
    const url = draft.url.trim();
    if (!anchor) return "Anchor text is required.";
    if (!url) return "URL is required.";
    if (!url.startsWith("/")) return 'Internal URLs must start with "/".';
    if (isDuplicate(items, { anchor, url }, skipIndex)) return "This link already exists.";
    return null;
  }

  function addItem() {
    const err = validateDraft();
    if (err) { setError(err); return; }
    setItems((prev) => [...prev, { anchor: draft.anchor.trim(), url: draft.url.trim() }]);
    setDraft(EMPTY);
    setAdding(false);
    setError("");
  }

  function updateItem() {
    if (editing === null) return;
    const err = validateDraft(editing);
    if (err) { setError(err); return; }
    setItems((prev) =>
      prev.map((item, i) =>
        i === editing ? { anchor: draft.anchor.trim(), url: draft.url.trim() } : item
      )
    );
    setEditing(null);
    setDraft(EMPTY);
    setError("");
  }

  function deleteItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function startEdit(index: number) {
    setEditing(index);
    setDraft({ ...items[index] });
    setAdding(false);
    setError("");
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
                  value={draft.anchor}
                  onChange={(e) => setDraft((d) => ({ ...d, anchor: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
                  placeholder="Anchor text, e.g. composite bonding in Dubai"
                />
                <input
                  value={draft.url}
                  onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
                  placeholder="/services/composite-bonding-dubai"
                />
                {error && <p className="text-red-600 text-xs font-medium">{error}</p>}
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
                      setError("");
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
                  <p className="font-medium text-gray-800 text-sm truncate">{item.anchor}</p>
                  <p className="text-gray-500 text-xs mt-0.5 font-mono truncate">{item.url}</p>
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
            value={draft.anchor}
            onChange={(e) => setDraft((d) => ({ ...d, anchor: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="Anchor text, e.g. composite bonding in Dubai"
          />
          <input
            value={draft.url}
            onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="/services/composite-bonding-dubai"
          />
          {error && <p className="text-red-600 text-xs font-medium">{error}</p>}
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
                setError("");
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
            setError("");
          }}
          className="text-sm px-4 py-2 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#1b4f72] hover:text-[#1b4f72] w-full transition-colors"
        >
          + Add internal link
        </button>
      )}
    </div>
  );
}
