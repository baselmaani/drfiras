import Link from "next/link";
import type { RelatedLink } from "@/lib/internalLinks";

export default function RelatedLinks({
  links,
  heading = "Related Services & Articles",
}: {
  links: RelatedLink[];
  heading?: string;
}) {
  if (!links || links.length === 0) return null;

  return (
    <section className="pb-20 bg-[#0d0d0d]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-[#141414] rounded-2xl border border-[#1e1e1e] p-6 sm:p-8">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-4">
            Continue Reading
          </p>
          <h2
            className="text-xl sm:text-2xl font-bold text-white mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {heading}
          </h2>

          <ul className="grid sm:grid-cols-2 gap-3">
            {links.map((link, index) => (
              <li key={`${link.url}-${index}`}>
                <Link
                  href={link.url}
                  className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#c9a84c]/30 transition-colors"
                >
                  <span className="text-white/75 group-hover:text-white text-[14px] font-medium leading-snug transition-colors">
                    {link.anchor}
                  </span>
                  <svg
                    className="w-4 h-4 flex-shrink-0 text-[#c9a84c]/70 group-hover:text-[#c9a84c] group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
