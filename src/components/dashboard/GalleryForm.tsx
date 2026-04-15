"use client";
import { useActionState } from "react";
import { ImageUpload } from "./ImageUpload";

type ActionState = { error: string } | null;
type GalleryAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

type Service = { id: number; title: string };

type GalleryImageItem = {
  id: number;
  title: string;
  image: string;
  description: string | null;
  serviceId: number;
  order: number;
  published: boolean;
};

export function GalleryForm({
  action,
  item,
  services,
}: {
  action: GalleryAction;
  item?: GalleryImageItem;
  services: Service[];
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
            placeholder="e.g. Composite Bonding Result"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Service <span className="text-red-500">*</span>
          </label>
          <select
            name="serviceId"
            required
            defaultValue={item?.serviceId ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72] bg-white"
          >
            <option value="" disabled>Select a service…</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ImageUpload
        name="image"
        label="Gallery Image"
        defaultValue={item?.image ?? ""}
        required
      />

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

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={item?.published ?? true}
          className="w-4 h-4 rounded border-gray-300 text-[#1b4f72] focus:ring-[#1b4f72]/30"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Published
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-[#1b4f72] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#154460] transition-colors disabled:opacity-50"
      >
        {pending ? "Saving…" : item ? "Save Changes" : "Create Image"}
      </button>
    </form>
  );
}
