import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { deleteBeforeAfter } from "@/lib/actions/before-after";
import { DeleteButton } from "@/components/dashboard/DeleteButton";

export default async function BeforeAfterPage() {
  const items = await db.beforeAfter.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#1b4f72]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Before &amp; After
          </h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} items</p>
        </div>
        <Link
          href="/dashboard/before-after/new"
          className="bg-[#1b4f72] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#154460] transition-colors"
        >
          + New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
          <p className="text-lg mb-2">No before &amp; after items yet</p>
          <Link
            href="/dashboard/before-after/new"
            className="text-[#1b4f72] text-sm underline"
          >
            Add your first
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="grid grid-cols-2 h-40">
                <div className="relative bg-gray-100">
                  <Image
                    src={item.beforeImage}
                    alt={`Before - ${item.title}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    Before
                  </span>
                </div>
                <div className="relative bg-blue-50">
                  <Image
                    src={item.afterImage}
                    alt={`After - ${item.title}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute top-1.5 right-1.5 bg-[#1b4f72] text-white text-xs px-1.5 py-0.5 rounded">
                    After
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.treatment}</p>
                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.published
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                  <div className="flex gap-3 text-sm">
                    <Link
                      href={`/dashboard/before-after/${item.id}/edit`}
                      className="text-[#1b4f72] hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={item.id} action={deleteBeforeAfter} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
