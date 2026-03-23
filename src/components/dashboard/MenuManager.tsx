"use client";
import { useState, useTransition } from "react";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  seedDefaultMenuItems,
} from "@/lib/actions/menu";

type Item = {
  id: number;
  label: string;
  href: string;
  position: string;
  order: number;
  parentId: number | null;
  enabled: boolean;
  children: Item[];
};

const POSITIONS = [
  { value: "left", label: "Left side" },
  { value: "right", label: "Right side" },
];

function ItemRow({
  item,
  allTopLevel,
  onEdit,
  indented = false,
}: {
  item: Item;
  allTopLevel: Item[];
  onEdit: (item: Item) => void;
  indented?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <>
      <tr className={`border-b border-gray-100 ${indented ? "bg-gray-50/50" : ""}`}>
        <td className="px-4 py-3 text-sm font-medium text-gray-800">
          {indented && <span className="mr-2 text-gray-300">↳</span>}
          {item.label}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500 font-mono">{item.href}</td>
        <td className="px-4 py-3 text-sm text-gray-500 capitalize">
          {item.parentId ? "sub-menu" : item.position}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">{item.order}</td>
        <td className="px-4 py-3">
          <button
            onClick={() =>
              startTransition(() =>
                updateMenuItem(item.id, { enabled: !item.enabled })
              )
            }
            disabled={pending}
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              item.enabled
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {item.enabled ? "Visible" : "Hidden"}
          </button>
        </td>
        <td className="px-4 py-3 flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-[#1b4f72] text-xs underline hover:no-underline"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${item.label}"?`))
                startTransition(() => deleteMenuItem(item.id));
            }}
            disabled={pending}
            className="text-red-500 text-xs underline hover:no-underline"
          >
            Delete
          </button>
        </td>
      </tr>
      {item.children?.map((child) => (
        <ItemRow
          key={child.id}
          item={child}
          allTopLevel={allTopLevel}
          onEdit={onEdit}
          indented
        />
      ))}
    </>
  );
}

function ItemForm({
  initial,
  topLevel,
  onDone,
}: {
  initial?: Item | null;
  topLevel: Item[];
  onDone: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [href, setHref] = useState(initial?.href ?? "");
  const [position, setPosition] = useState(initial?.position ?? "left");
  const [order, setOrder] = useState(String(initial?.order ?? 0));
  const [parentId, setParentId] = useState<string>(
    initial?.parentId != null ? String(initial.parentId) : ""
  );
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      label,
      href,
      position,
      order: Number(order),
      parentId: parentId ? Number(parentId) : null,
    };
    startTransition(async () => {
      if (initial) {
        await updateMenuItem(initial.id, data);
      } else {
        await createMenuItem(data);
      }
      onDone();
    });
  }

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/20 focus:border-[#1b4f72]";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4 mb-6"
    >
      <h3 className="text-base font-semibold text-gray-800">
        {initial ? "Edit Item" : "Add New Item"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            placeholder="e.g. Treatments"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link (href)</label>
          <input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            required
            placeholder="e.g. /about or #section"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className={inputCls}
          >
            {POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order / Priority</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            min={0}
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Item <span className="text-gray-400 font-normal">(leave empty for top-level)</span>
          </label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className={inputCls}
          >
            <option value="">— Top-level item —</option>
            {topLevel
              .filter((t) => t.id !== initial?.id)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#1b4f72] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-[#163f5a] transition-colors disabled:opacity-50"
        >
          {pending ? "Saving…" : initial ? "Save Changes" : "Add Item"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border border-gray-200 text-gray-600 px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function MenuManager({ initialItems }: { initialItems: Item[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [seeding, startSeedTransition] = useTransition();

  const topLevel = initialItems.filter((i) => !i.parentId);

  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }
  function openEdit(item: Item) {
    setEditing(item);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div>
      {showForm && (
        <ItemForm initial={editing} topLevel={topLevel} onDone={closeForm} />
      )}

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          {initialItems.length} item{initialItems.length !== 1 ? "s" : ""} total
        </p>
        {!showForm && (
          <button
            onClick={openAdd}
            className="bg-[#1b4f72] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#163f5a] transition-colors"
          >
            + Add Item
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Label</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Link</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Position</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  <p className="text-sm text-gray-400 mb-3">
                    No menu items found. Click below to seed the default menu.
                  </p>
                  <button
                    onClick={() => startSeedTransition(() => seedDefaultMenuItems())}
                    disabled={seeding}
                    className="bg-[#1b4f72] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#163f5a] disabled:opacity-50 transition-colors"
                  >
                    {seeding ? "Seeding…" : "Initialize Default Menu"}
                  </button>
                </td>
              </tr>
            ) : (
              topLevel.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  allTopLevel={topLevel}
                  onEdit={openEdit}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
