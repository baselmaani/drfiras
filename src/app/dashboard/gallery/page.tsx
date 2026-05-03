import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { deleteGalleryImage } from "@/lib/actions/gallery";
import { DeleteButton } from "@/components/dashboard/DeleteButton";

export default async function GalleryPage() {
  const items = await db.galleryImage.findMany({
    orderBy: { order: "asc" },
    include: { service: { select: { title: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#1b4f72]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Gallery
          </h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} images</p>
        </div>
        <Link
          href="/dashboard/gallery/new"
          className="bg-[#1b4f72] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#154460] transition-colors"
        >
          + Add Image
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
          <p className="text-lg mb-2">No gallery images yet</p>
          <Link
            href="/dashboard/gallery/new"
            className="text-[#1b4f72] text-sm underline"
          >
            Add your first image
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#c9a84c]/40 overflow-hidden hover:border-[#c9a84c] transition-colors"
            >
              <div className="bg-gray-100 flex items-center justify-center">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={800}
                    className="w-full h-auto block"
                    unoptimized
                  />
                ) : (
                  <div className="h-48 w-full flex items-center justify-center text-gray-300 text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-800 text-xs">{item.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#1b4f72]/10 text-[#1b4f72] font-medium">
                    {item.service.title}
                  </span>
                  {item.subcategory && (
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#c9a84c]/15 text-[#8a6f2e] font-medium">
                      {item.subcategory}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/dashboard/gallery/${item.id}/edit`}
                    className="text-[#1b4f72] text-xs font-medium hover:underline"
                  >
                    Edit
                  </Link>
                  <span className="text-gray-200">|</span>
                  <DeleteButton
                    id={item.id}
                    action={deleteGalleryImage}
                    label="Delete"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
