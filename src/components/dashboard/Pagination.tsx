import Link from "next/link";

function buildHref(
  basePath: string,
  page: number,
  extraParams?: Record<string, string | undefined>
) {
  const params = new URLSearchParams();
  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      if (value !== undefined) params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pageWindow(page: number, totalPages: number) {
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, Math.max(page + 2, 5));
  const pages: number[] = [];
  for (let p = Math.max(1, start); p <= end; p++) pages.push(p);
  return pages;
}

export default function Pagination({
  page,
  totalPages,
  basePath,
  extraParams,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8">
      <Link
        href={buildHref(basePath, page - 1, extraParams)}
        aria-disabled={page <= 1}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          page <= 1
            ? "pointer-events-none text-gray-300"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        Prev
      </Link>

      {pages[0] > 1 && (
        <>
          <Link
            href={buildHref(basePath, 1, extraParams)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            1
          </Link>
          {pages[0] > 2 && <span className="px-1 text-gray-300">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, p, extraParams)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            p === page
              ? "bg-[#1b4f72] text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {p}
        </Link>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-gray-300">…</span>
          )}
          <Link
            href={buildHref(basePath, totalPages, extraParams)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={buildHref(basePath, page + 1, extraParams)}
        aria-disabled={page >= totalPages}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          page >= totalPages
            ? "pointer-events-none text-gray-300"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
