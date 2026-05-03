"use client";
import { useActionState } from "react";
import type { ServicePrice } from "@/generated/prisma/client";

type ActionState = { error: string } | null;
type PriceAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

export function PriceForm({
  action,
  price,
}: {
  action: PriceAction;
  price?: ServicePrice;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {state.error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Treatment / Service Name <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          required
          defaultValue={price?.title}
          placeholder="e.g. Composite Bonding"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Short Description
        </label>
        <input
          name="description"
          defaultValue={price?.description ?? ""}
          placeholder="e.g. Per tooth, natural-looking resin"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
        />
      </div>

      {/* Price + Note */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            name="price"
            required
            defaultValue={price?.price}
            placeholder="e.g. From AED 1,500"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Price Note
          </label>
          <input
            name="priceNote"
            defaultValue={price?.priceNote ?? ""}
            placeholder="e.g. per tooth, per session"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
          />
        </div>
      </div>

      {/* Category + Order */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <input
            name="category"
            defaultValue={price?.category ?? ""}
            placeholder="e.g. Cosmetic, Orthodontics"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
          />
          <p className="text-xs text-gray-400 mt-1">
            Used to group items on the prices page.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Sort Order
          </label>
          <input
            name="order"
            type="number"
            defaultValue={price?.order ?? 0}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
          />
        </div>
      </div>

      {/* Published */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="published"
          defaultChecked={price?.published ?? true}
          className="w-4 h-4 accent-[#1b4f72]"
        />
        <span className="text-sm font-medium text-gray-700">Published</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60"
      >
        {pending ? "Saving…" : price ? "Update Price" : "Create Price"}
      </button>
    </form>
  );
}
