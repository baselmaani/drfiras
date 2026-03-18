import { BeforeAfterForm } from "@/components/dashboard/BeforeAfterForm";
import { createBeforeAfter } from "@/lib/actions/before-after";
import Link from "next/link";

export default function NewBeforeAfterPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/before-after"
          className="text-gray-400 hover:text-gray-600 text-sm mb-2 inline-flex items-center gap-1"
        >
          ← Back to Before &amp; After
        </Link>
        <h1
          className="text-2xl font-bold text-[#1b4f72] mt-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          New Before &amp; After
        </h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <BeforeAfterForm action={createBeforeAfter} />
      </div>
    </div>
  );
}
