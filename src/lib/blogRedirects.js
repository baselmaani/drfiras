// Blog posts consolidated to fix keyword cannibalization (Oct 2026).
// Each retired slug permanently redirects to the page that now covers its topic.
// Used by next.config.ts (redirects) and scripts/consolidate-posts.js (unpublish + relink).
const BLOG_REDIRECTS = {
  // Commercial "best X dentist" posts → the matching service page
  "best-doctor-for-composite-bonding-in-dubai": "/services/composite-bonding-dubai",
  "best-composite-bonding-dentist-in-dubai-near-me": "/services/composite-bonding-dubai",
  "composite-bonding-in-dubai-cost-process-natural-results": "/services/composite-bonding-dubai",
  "porcelain-veneers-in-dubai": "/services/porcelain-veneers-dubai",
  "best-veneers-dentist-in-dubai-near-me": "/services/porcelain-veneers-dubai",
  "best-dentist-in-dubai-for-veneers-near-me": "/services/porcelain-veneers-dubai",
  "veneers-in-dubai-for-natural-looking-smile": "/services/porcelain-veneers-dubai",
  "best-teeth-whitening-in-dubai": "/services/teeth-whitening-dubai",
  "best-teeth-whitening-dentist-in-dubai-near-me": "/services/teeth-whitening-dubai",
  "professional-teeth-whitening-in-dubai-for-a-brighter-smile": "/services/teeth-whitening-dubai",
  "best-invisalign-dentist-in-dubai-near-me": "/services/invisalign-dubai",
  "invisalign-in-dubai-clear-aligners-for-a-straighter-smile": "/services/invisalign-dubai",

  // "Best dentist in Dubai" variants → one keeper post
  "best-dentist-in-dubai-near-me-what-to-look-for-before-booking": "/blog/best-dentist-in-dubai",
  "best-dentist-in-dubai-for-composite-bonding-veneers-and-invisalign": "/blog/best-dentist-in-dubai",
  "best-teeth-doctor-in-dubai-for-cosmetic-and-restorative-treatments": "/blog/best-dentist-in-dubai",
  "where-to-find-the-best-teeth-doctor-in-dubai-near-you": "/blog/best-dentist-in-dubai",

  // "Best cosmetic dentist / clinic" variants → one keeper post
  "best-cosmetic-dentist-in-dubai-for-natural-looking-smile-makeovers": "/blog/how-to-choose-a-cosmetic-dentist-in-dubai",
  "best-cosmetic-dentist-in-dubai-near-me-for-smile-makeovers": "/blog/how-to-choose-a-cosmetic-dentist-in-dubai",
  "best-cosmetic-dental-clinic-dubai-personalized-smile-design": "/blog/how-to-choose-a-cosmetic-dentist-in-dubai",
  "best-dental-clinic-in-dubai-for-cosmetic-dentistry-and-smile-enhancement": "/blog/how-to-choose-a-cosmetic-dentist-in-dubai",
  "best-cosmetic-dentistry-in-dubai": "/blog/how-to-choose-a-cosmetic-dentist-in-dubai",
  "how-to-choose-the-best-cosmetic-dentist-in-dubai-for-teeth-whitening": "/blog/how-to-choose-a-cosmetic-dentist-in-dubai",

  // Near-duplicates → the original post
  "best-cosmetic-dental-treatments-in-dubai-for-a-perfect-smile": "/blog/best-cosmetic-dental-treatments-in-dubai",
  "best-smile-makeover-dentist-in-dubai-near-me": "/blog/smile-makeover-treatments-in-dubai",
  "how-long-does-teeth-whitening-last-in-dubai": "/blog/how-long-does-teeth-whitening-last",
  "how-long-does-composite-bonding-last-in-dubai": "/blog/how-long-does-composite-bonding-last",
};

module.exports = { BLOG_REDIRECTS };
