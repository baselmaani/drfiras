"use client";
import { useActionState } from "react";
import type { BeforeAfter } from "@/generated/prisma/client";

type ActionState = { error: string } | null;
type BAAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

export function BeforeAfterForm({
  action,
  item,
}: {
  action: BAAction;
  item?: BeforeAfter;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {state.error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            defaultValue={item?.title}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
            placeholder="e.g. Smile Transformation"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Treatment <span className="text-red-500">*</span>
          </label>
          <input
            name="treatment"
            required
            defaultValue={item?.treatment}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
            placeholder="e.g. Composite Bonding"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Before Image URL <span className="text-red-500">*</span>
        </label>
        <input
          name="beforeImage"
          required
          type="url"
          defaultValue={item?.beforeImage}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          After Image URL <span className="text-red-500">*</span>
        </label>
        <input
          name="afterImage"
          required
          type="url"
          defaultValue={item?.afterImage}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={item?.description ?? ""}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Sort Order
        </label>
        <input
          name="order"
          type="number"
          defaultValue={item?.order ?? 0}
          className="w-40 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="published"
          defaultChecked={item?.published ?? true}
          className="w-4 h-4 accent-[#1b4f72]"
        />
        <span className="text-sm font-medium text-gray-700">Published</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60"
      >
        {pending ? "Saving…" : item ? "Update" : "Create"}
      </button>
    </form>
  );
}
