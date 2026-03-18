import { db } from "@/lib/db";
import Link from "next/link";
import { deleteService } from "@/lib/actions/services";
import { DeleteButton } from "@/components/dashboard/DeleteButton";

export default async function ServicesPage() {
  const services = await db.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#1b4f72]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Services
          </h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} services</p>
        </div>
        <Link
          href="/dashboard/services/new"
          className="bg-[#1b4f72] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#154460] transition-colors"
        >
          + New Service
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {services.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg mb-2">No services yet</p>
            <Link
              href="/dashboard/services/new"
              className="text-[#1b4f72] text-sm underline"
            >
              Create your first service
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                  Slug
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
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {service.title}
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono hidden sm:table-cell">
                    {service.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        service.published
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {service.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/dashboard/services/${service.id}/edit`}
                        className="text-[#1b4f72] hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/services/${service.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        View
                      </Link>
                      <DeleteButton id={service.id} action={deleteService} />
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
