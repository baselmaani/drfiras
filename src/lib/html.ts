// Removes headings that render as nothing (whitespace, &nbsp; or <br> only).
// The rich-text editor leaves these behind, and an empty <h2> is a broken
// signal in the page outline that crawlers and AI parsers read.
const EMPTY_HEADING = /<h([1-6])\b[^>]*>(?:\s|&nbsp;|&#160;|<br\s*\/?>)*<\/h\1>/gi;

export function stripEmptyHeadings(html: string): string {
  return html.replace(EMPTY_HEADING, "");
}

// Image URLs we can actually serve: Vercel Blob uploads or our own domain —
// the same hosts next/image is configured for. Imported placeholder URLs
// (e.g. https://example.com/cover.jpg) are treated as "no image".
export function usableImage(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("/")) return url;
  try {
    const { hostname } = new URL(url);
    return hostname.endsWith(".public.blob.vercel-storage.com") || hostname === "drfiraszoghieb.com" ? url : null;
  } catch {
    return null;
  }
}
