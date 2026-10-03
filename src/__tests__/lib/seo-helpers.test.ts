import { describe, it, expect } from "vitest";
import { withBrand } from "@/lib/constants";
import { serviceForPost, postMatchesService } from "@/lib/serviceTopics";

describe("withBrand", () => {
  it("appends the brand to short titles", () => {
    expect(withBrand("Teeth Whitening in Dubai")).toBe("Teeth Whitening in Dubai | Dr. Firas Zoghieb");
  });

  it("never doubles a full or partial trailing brand", () => {
    expect(withBrand("Porcelain Veneers in Dubai | Dr. Firas Zoghieb")).toBe(
      "Porcelain Veneers in Dubai | Dr. Firas Zoghieb",
    );
    expect(withBrand("How Long Does Composite Bonding Last in Dubai? | Dr. Firas")).toBe(
      "How Long Does Composite Bonding Last in Dubai?",
    );
  });

  it("keeps titles that mention the brand mid-title", () => {
    const t = "Book a Consultation with Dr. Firas Zoghieb | Cosmetic Dentist Dubai";
    expect(withBrand(t)).toBe(t);
  });

  it("skips the brand when it would push the title past 65 characters", () => {
    const t = "What Is Composite Bonding in Dubai? Benefits, Process, and Who It Is For";
    expect(withBrand(`${t} | Dr. Firas`)).toBe(t);
  });
});

describe("serviceTopics", () => {
  it("maps a post to the treatment it mentions first", () => {
    expect(serviceForPost({ slug: "composite-bonding-vs-veneers-which-is-better", title: "" })?.url).toBe(
      "/services/composite-bonding-dubai",
    );
    expect(serviceForPost({ slug: "do-veneers-look-natural", title: "Do Veneers Look Natural?" })?.url).toBe(
      "/services/porcelain-veneers-dubai",
    );
    expect(serviceForPost({ slug: "best-dentist-in-dubai", title: "Best Dentist in Dubai" })).toBeNull();
  });

  it("excludes redirected posts from a service's guides", () => {
    expect(postMatchesService("composite-bonding-dubai", { slug: "composite-bonding-price-in-dubai", title: "" })).toBe(true);
    expect(
      postMatchesService("composite-bonding-dubai", { slug: "best-composite-bonding-dentist-in-dubai-near-me", title: "" }),
    ).toBe(false);
  });
});

describe("formatPrice", () => {
  it("adds AED and the unit to bare prices", async () => {
    const { formatPrice } = await import("@/lib/prices");
    expect(formatPrice("From 400", "per Tooth")).toEqual({ label: "From AED 400 per Tooth", amount: 400, unit: "per Tooth" });
    expect(formatPrice("AED 1,200").label).toBe("AED 1,200");
    expect(formatPrice("AED 1,200").amount).toBe(1200);
  });
});

describe("stripEmptyHeadings", () => {
  it("removes headings with only whitespace, &nbsp; or <br>", async () => {
    const { stripEmptyHeadings } = await import("@/lib/html");
    expect(stripEmptyHeadings("<h2></h2><p>a</p><h2> &nbsp;<br></h2><h3 class='x'><br/></h3>")).toBe("<p>a</p>");
  });

  it("keeps headings with text", async () => {
    const { stripEmptyHeadings } = await import("@/lib/html");
    expect(stripEmptyHeadings("<h2>Cost</h2><h2><strong>Steps</strong></h2>")).toBe("<h2>Cost</h2><h2><strong>Steps</strong></h2>");
  });
});

describe("usableImage", () => {
  it("accepts blob uploads and own-domain images, rejects placeholders", async () => {
    const { usableImage } = await import("@/lib/html");
    expect(usableImage("https://abc.public.blob.vercel-storage.com/uploads/a.jpg")).toBe(
      "https://abc.public.blob.vercel-storage.com/uploads/a.jpg",
    );
    expect(usableImage("/logo.png")).toBe("/logo.png");
    expect(usableImage("https://example.com/cover.jpg")).toBeNull();
    expect(usableImage(null)).toBeNull();
    expect(usableImage("not a url")).toBeNull();
  });
});
