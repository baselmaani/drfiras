export type RelatedLink = { anchor: string; url: string };

export function parseInternalLinks(raw: string | null | undefined): RelatedLink[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is RelatedLink =>
        item && typeof item.anchor === "string" && typeof item.url === "string"
    );
  } catch {
    return [];
  }
}

export function validateInternalLinks(links: RelatedLink[]): {
  valid: RelatedLink[];
  errors: string[];
} {
  const errors: string[] = [];
  const seen = new Set<string>();
  const valid: RelatedLink[] = [];

  for (const link of links) {
    const anchor = link.anchor?.trim() ?? "";
    const url = link.url?.trim() ?? "";

    if (!anchor) {
      errors.push("Link anchor text is required.");
      continue;
    }
    if (!url) {
      errors.push(`Link "${anchor}" is missing a URL.`);
      continue;
    }
    if (!url.startsWith("/")) {
      errors.push(`Link "${anchor}" must use an internal URL starting with "/".`);
      continue;
    }

    const key = `${anchor.toLowerCase()}|${url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    valid.push({ anchor, url });
  }

  return { valid, errors };
}
