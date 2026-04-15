import { db } from "@/lib/db";
import { GalleryForm } from "@/components/dashboard/GalleryForm";
import { createGalleryImage } from "@/lib/actions/gallery";
import Link from "next/link";

export default async function NewGalleryPage() {
  const services = await db.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/gallery"
          className="text-gray-400 hover:text-gray-600 text-sm mb-2 inline-flex items-center gap-1"
        >
          ← Back to Gallery
        </Link>
        <h1
          className="text-2xl font-bold text-[#1b4f72] mt-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Add Gallery Image
        </h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <GalleryForm action={createGalleryImage} services={services} />
      </div>
    </div>
  );
}
