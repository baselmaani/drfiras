import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/dashboard/ServiceForm";
import { updateService } from "@/lib/actions/services";
import Link from "next/link";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await db.service.findUnique({ where: { id: parseInt(id) } });
  if (!service) notFound();

  const action = updateService.bind(null, service.id);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/services"
          className="text-gray-400 hover:text-gray-600 text-sm mb-2 inline-flex items-center gap-1"
        >
          ← Back to Services
        </Link>
        <h1
          className="text-2xl font-bold text-[#1b4f72] mt-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Edit: {service.title}
        </h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <ServiceForm action={action} service={service} />
      </div>
    </div>
  );
}
