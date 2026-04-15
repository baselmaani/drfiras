import { db } from "@/lib/db";
import { GalleryForm } from "@/components/dashboard/GalleryForm";
import { updateGalleryImage } from "@/lib/actions/gallery";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, services] = await Promise.all([
    db.galleryImage.findUnique({ where: { id: Number(id) } }),
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!item) notFound();

  const action = updateGalleryImage.bind(null, item.id);

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
          Edit: {item.title}
        </h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <GalleryForm action={action} item={item} services={services} />
      </div>
    </div>
  );
}
