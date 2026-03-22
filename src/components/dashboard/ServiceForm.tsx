"use client";
import { useActionState, useState } from "react";
import type { Service } from "@/generated/prisma/client";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";

type ActionState = { error: string } | null;
type ServiceAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

function generateSlug(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function CaseImagesManager({
  initial,
  name,
}: {
  initial: string[];
  name: string;
}) {
  const [images, setImages] = useState<string[]>(initial);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Case ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
        <p className="text-xs text-gray-500 mb-3">Upload a new case image</p>
        <ImageUpload
          name="_caseImageTemp"
          label=""
          onUpload={(url) => setImages((prev) => [...prev, url])}
        />
      </div>
    </div>
  );
}

export function ServiceForm({
  action,
  service,
}: {
  action: ServiceAction;
  service?: Service;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  let initialCaseImages: string[] = [];
  if (service?.caseImages) {
    try { initialCaseImages = JSON.parse(service.caseImages); } catch { /* keep empty */ }
  }

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
          Full Content
        </label>
        <RichTextEditor
          name="content"
          defaultValue={service?.content ?? ""}
          placeholder="Start writing about this service… Use H2 for main sections (Benefits, Procedure, FAQ) and H3 for sub-points."
        />
      </div>

      {/* Hero Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Image</label>
        <p className="text-xs text-gray-400 mb-2">Displayed prominently at the top of the service page.</p>
        <ImageUpload name="heroImage" defaultValue={service?.heroImage ?? ""} />
      </div>

      {/* Case Images Gallery */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Case Images Gallery</label>
        <p className="text-xs text-gray-400 mb-2">Upload before/after or result photos for this service.</p>
        <CaseImagesManager initial={initialCaseImages} name="caseImages" />
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
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">SEO Settings</h3>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
          <input
            name="metaTitle"
            defaultValue={service?.metaTitle ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="Leave blank to use service title"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
          <textarea
            name="metaDesc"
            rows={2}
            defaultValue={service?.metaDesc ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white resize-none"
            placeholder="Recommended: 120–160 characters"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Meta Keywords</label>
          <input
            name="metaKeywords"
            defaultValue={service?.metaKeywords ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="e.g. composite bonding, cosmetic dentist dubai"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OG Image</label>
          <p className="text-xs text-gray-400 mb-1">Used for social sharing previews. Leave blank to use hero image.</p>
          <ImageUpload name="ogImage" defaultValue={service?.ogImage ?? ""} />
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

