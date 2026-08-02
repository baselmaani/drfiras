"use client";
import { useState } from "react";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ReviewAvatar({
  name,
  photoUrl,
  colorIndex,
}: {
  name: string;
  photoUrl?: string;
  colorIndex: number;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a84c] via-[#c9a84c]/40 to-transparent p-[2px] flex-shrink-0">
      <div className="w-full h-full rounded-full bg-[#141414] p-[2px]">
        {photoUrl && !failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className={`w-full h-full rounded-full flex items-center justify-center text-white text-sm font-semibold ${AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]}`}
          >
            {getInitials(name)}
          </div>
        )}
      </div>
    </div>
  );
}
