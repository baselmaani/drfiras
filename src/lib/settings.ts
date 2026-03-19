import { db } from "@/lib/db";

export async function getSettings(): Promise<Record<string, string>> {
  const settings = await db.siteSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export const DEFAULT_SETTINGS: Record<string, string> = {
  doctorName: "Dr. Firas",
  specialty: "Cosmetic Dentist",
  phone: "020 1234 5678",
  email: "info@drfiras.com",
  address: "123 Smile Street, London, EC1A 1BB",
  instagram: "",
  facebook: "",
  whatsapp: "",
  bookingUrl: "#book",
  // Google Reviews
  googleReviewsEnabled: "true",
  googleRating: "5.0",
  googleReviewCount: "100+",
  googleReviewsUrl: "",
  googleReviews: "",
  // Instagram
  instagramEnabled: "true",
  instagramHandle: "dr.firaszoghieb",
  instagramFollowers: "",
  instagramBio: "Cosmetic Dentist · Composite Bonding · Invisalign · Veneers ✨",
  instagramPosts: "",
  // Hero section
  heroEyebrow: "Cosmetic Dentist London",
  heroHeading: "Dr. Firas",
  heroBody:
    "Dr. Firas is an experienced cosmetic dentist specialising in composite bonding, Invisalign, and minimal-prep veneers. With a gentle, minimally invasive approach, he helps patients achieve beautiful, natural-looking smiles they can be proud of.",
  heroCta1Text: "Book Free Consultation",
  heroCta1Link: "#book",
  heroCta2Text: "Learn More",
  heroCta2Link: "#about",
  heroImageUrl: "",
  heroStatNumber: "500+",
  heroStatLabel: "Smile Transformations",
  // About section
  aboutPara1:
    "Dr. Firas graduated with Honours in Dentistry (BDS) and subsequently completed a Master of Science in Cosmetic Dentistry, giving him an exceptional foundation in both the art and science of creating beautiful smiles.",
  aboutPara2:
    "With a special interest in restorative and cosmetic dentistry, Dr. Firas has completed extensive postgraduate training including certifications in Composite Bonding, Aesthetic Restorative Dentistry, and Invisalign. He focuses on minimally invasive treatments that preserve natural tooth structure while delivering outstanding aesthetic results.",
  aboutPara3:
    "Dr. Firas is dedicated to providing gentle, high-quality care. His greatest satisfaction comes from transforming patients' confidence in their smiles. He takes the time to listen to each patient's concerns and works collaboratively to create a treatment plan aligned with their desires and budget.",
  aboutPara4: "Outside of dentistry, Dr. Firas enjoys travelling, fitness, and spending time with family.",
  aboutCtaText: "Book Free Consultation",
  aboutCtaLink: "#book",
  aboutStat1Number: "500+",
  aboutStat1Label: "Smiles Transformed",
  aboutStat2Number: "10+",
  aboutStat2Label: "Years Experience",
  aboutStat3Number: "99%",
  aboutStat3Label: "Patient Satisfaction",
  // FAQ items (JSON array of {question, answer})
  faqItems: "",
  // At a Glance items (JSON array of {label, value})
  glanceItems: "",
  // Page-level SEO
  seoHomeTitle: "",
  seoHomeDesc: "",
  seoHomeKeywords: "",
  seoBlogTitle: "Dental Tips & Advice | Dr. Firas",
  seoBlogDesc: "Read expert dental tips and cosmetic dentistry advice from Dr. Firas Zoghieb, London cosmetic dentist.",
  seoBlogKeywords: "",
  seoServicesTitle: "Our Services | Dr. Firas",
  seoServicesDesc: "Explore the full range of cosmetic dental treatments offered by Dr. Firas Zoghieb.",
  seoServicesKeywords: "",
};
