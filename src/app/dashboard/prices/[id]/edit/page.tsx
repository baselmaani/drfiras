import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PriceForm } from "@/components/dashboard/PriceForm";
import { updatePrice } from "@/lib/actions/prices";
import Link from "next/link";

export default async function EditPricePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const price = await db.servicePrice.findUnique({ where: { id: parseInt(id) } });
  if (!price) notFound();

  const action = updatePrice.bind(null, price.id);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/prices"
          className="text-gray-400 hover:text-gray-600 text-sm mb-2 inline-flex items-center gap-1"
        >
          ← Back to Prices
        </Link>
        <h1
          className="text-2xl font-bold text-[#1b4f72] mt-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Edit: {price.title}
        </h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <PriceForm action={action} price={price} />
      </div>
    </div>
  );
}
