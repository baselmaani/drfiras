"use client";
import { useActionState } from "react";
import type { Service } from "@/generated/prisma/client";

type ActionState = { error: string } | null;
type ServiceAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

function generateSlug(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ServiceForm({
  action,
  service,
}: {
  action: ServiceAction;
  service?: Service;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {state.error}
        </div>
      )}

      {/* Title + Slug */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            defaultValue={service?.title}
            onChange={(e) => {
              if (!service) {
                const slugInput = e.currentTarget.form?.elements.namedItem(
                  "slug"
                ) as HTMLInputElement | null;
                if (slugInput && !slugInput.dataset.modified) {
                  slugInput.value = generateSlug(e.target.value);
                }
              }
            }}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            name="slug"
            required
            defaultValue={service?.slug}
            onInput={(e) => {
              (e.currentTarget as HTMLInputElement).dataset.modified = "1";
            }}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72] font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={service?.description}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Content (HTML or plain text)
        </label>
        <textarea
          name="content"
          rows={8}
          defaultValue={service?.content ?? ""}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72] resize-y font-mono"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Icon (emoji or text)
          </label>
          <input
            name="icon"
            defaultValue={service?.icon ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
            placeholder="e.g. ✦"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Sort Order
          </label>
          <input
            name="order"
            type="number"
            defaultValue={service?.order ?? 0}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          SEO Settings
        </h3>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Meta Title
          </label>
          <input
            name="metaTitle"
            defaultValue={service?.metaTitle ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="Leave blank to use service title"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Meta Description
          </label>
          <textarea
            name="metaDesc"
            rows={2}
            defaultValue={service?.metaDesc ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white resize-none"
            placeholder="Recommended: 120–160 characters"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            OG Image URL
          </label>
          <input
            name="ogImage"
            defaultValue={service?.ogImage ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
          />
        </div>
      </div>

      {/* Published */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="published"
          defaultChecked={service?.published ?? true}
          className="w-4 h-4 accent-[#1b4f72]"
        />
        <span className="text-sm font-medium text-gray-700">Published</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60"
      >
        {pending ? "Saving…" : service ? "Update Service" : "Create Service"}
      </button>
    </form>
  );
}
