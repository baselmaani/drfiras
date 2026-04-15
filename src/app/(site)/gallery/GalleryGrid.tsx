"use client";
import Image from "next/image";
import { useState } from "react";

type Service = { id: number; title: string; slug: string };
type GalleryItem = {
  id: number;
  title: string;
  image: string;
  description: string | null;
  service: Service;
};

export default function GalleryGrid({
  items,
  services,
}: {
  items: GalleryItem[];
  services: Service[];
}) {
  const [activeId, setActiveId] = useState<number | "all">("all");

  const filtered =
    activeId === "all" ? items : items.filter((i) => i.service.id === activeId);

  return (
    <>
      {/* Filter bar — horizontally scrollable on mobile */}
      <div className="flex gap-2 mb-8 sm:mb-12 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveId("all")}
          className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-medium border transition-all ${
            activeId === "all"
              ? "bg-[#c9a84c] border-[#c9a84c] text-black"
              : "border-white/20 text-white/60 hover:border-[#c9a84c] hover:text-white"
          }`}
        >
          All
        </button>
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              activeId === s.id
                ? "bg-[#c9a84c] border-[#c9a84c] text-black"
                : "border-white/20 text-white/60 hover:border-[#c9a84c] hover:text-white"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-white/30 py-20">No images yet.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-x-3 sm:gap-x-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-3 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden border border-[#c9a84c]/30 group hover:border-[#c9a84c] transition-colors duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={800}
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                {/* Overlay: always visible on mobile, hover-only on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 sm:p-4 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-300">
                  <p className="text-white text-xs sm:text-sm font-semibold leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
                    {item.title}
                  </p>
                  <span className="text-[#c9a84c] text-[10px] sm:text-xs mt-0.5 sm:mt-1">{item.service.title}</span>
                  {item.description && (
                    <p className="hidden sm:block text-white/60 text-xs mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
