import Image from "next/image";
import Link from "next/link";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { usableImage } from "@/lib/html";

// Author / reviewer card at the end of each blog post (E-E-A-T). Credentials
// come from Dashboard → Settings and are hidden until filled in.
export default async function AuthorBox({ reviewedAt }: { reviewedAt?: Date | null }) {
  const s = { ...DEFAULT_SETTINGS, ...(await getSettings()) };
  const photo = usableImage(s.doctorPhotoUrl) ?? usableImage(s.heroImageUrl);
  const bio = s.doctorBio || s.heroBody;
  const credentials = [s.doctorQualifications, s.doctorLicense && `DHA licence ${s.doctorLicense}`]
    .filter(Boolean)
    .join(" · ");
  const socials = [
    { label: "Instagram", url: s.instagram },
    { label: "TikTok", url: s.tiktok },
  ].filter((l) => l.url);

  return (
    <aside className="mt-12 rounded-2xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.05] p-6 sm:p-7">
      <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-4">
        {reviewedAt ? "Written & medically reviewed by" : "Written by"}
      </p>
      <div className="flex flex-col sm:flex-row gap-5">
        {photo && (
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-full border border-[#c9a84c]/40">
            <Image src={photo} alt={s.doctorName} fill className="object-cover object-top" sizes="80px" />
          </div>
        )}
        <div>
          <Link
            href="/about"
            className="text-lg font-semibold text-white hover:text-[#c9a84c] transition-colors"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {s.doctorName}
          </Link>
          <p className="text-sm text-white/60">{s.specialty} in Dubai</p>
          {credentials && <p className="text-sm text-white/45 mt-0.5">{credentials}</p>}
          {bio && <p className="text-[15px] text-white/55 leading-relaxed mt-3">{bio}</p>}
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-sm">
            <Link href="/about" className="text-[#c9a84c] hover:text-[#e2c264] font-medium transition-colors">
              More about {s.doctorName} →
            </Link>
            {socials.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer me"
                className="text-white/50 hover:text-[#c9a84c] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
