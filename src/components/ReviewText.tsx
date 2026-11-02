"use client";
import { useEffect, useRef, useState } from "react";

export function ReviewText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  // Only show the toggle when the clamped text is actually cut off
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (!expanded) setOverflowing(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [expanded]);

  return (
    <div className="relative flex-1">
      <p
        ref={ref}
        className={`text-white/45 text-sm leading-relaxed ${expanded ? "" : "line-clamp-5"}`}
      >
        &ldquo;{text}&rdquo;
      </p>
      {(overflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 text-xs font-semibold text-[#c9a84c] hover:text-[#f3e3bb] transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
