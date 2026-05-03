import { db } from "@/lib/db";
import Link from "next/link";
import { deletePrice } from "@/lib/actions/prices";
import { DeleteButton } from "@/components/dashboard/DeleteButton";

export default async function PricesPage() {
  const prices = await db.servicePrice.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { title: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#1b4f72]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Prices
          </h1>
          <p className="text-gray-500 text-sm mt-1">{prices.length} items</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/prices"
            target="_blank"
            className="border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            View Page
          </Link>
          <Link
            href="/dashboard/prices/new"
            className="bg-[#1b4f72] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#154460] transition-colors"
          >
            + New Price
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {prices.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg mb-2">No prices yet</p>
            <Link
              href="/dashboard/prices/new"
              className="text-[#1b4f72] text-sm underline"
            >
              Add your first price
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Treatment
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Price
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {prices.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{item.title}</p>
                    {item.description && (
                      <p className="text-gray-400 text-xs mt-0.5">{item.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                    {item.category || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1b4f72]">{item.price}</p>
                    {item.priceNote && (
                      <p className="text-gray-400 text-xs mt-0.5">{item.priceNote}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.published
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/dashboard/prices/${item.id}/edit`}
                        className="text-[#1b4f72] hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={item.id} action={deletePrice} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
