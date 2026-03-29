import { db } from "@/lib/db";

export async function getSettings(): Promise<Record<string, string>> {
  const settings = await db.siteSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export const DEFAULT_SETTINGS: Record<string, string> = {
  logoUrl: "",
  doctorName: "Dr. Firas Zoghieb",
  specialty: "Cosmetic Dentist",
  phone: "+971 50 869 6919",
  email: "info@drfiraszoghieb.com",
  address: "Happiness St, Al Wasl, Dubai",
  instagram: "https://www.instagram.com/dr.firaszoghieb",
  tiktok: "",
  facebook: "",
  whatsapp: "https://wa.me/971508696919",
  bookingUrl: "#book",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.0318346663325!2d55.2604608!3d25.202148899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43fbe12b69c9%3A0xc08db524c295ac73!2sDr.%20Firas%20%7C%20Composite%20Bonding%20-%20Dubai!5e0!3m2!1ssv!2sae!4v1774281488941!5m2!1ssv!2sae",
  formEmail: "",
  // SMTP
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  smtpFrom: "",
  // Google Reviews
  googleReviewsEnabled: "true",
  googleRating: "5.0",
  googleReviewCount: "1",
  googleReviewsUrl: "",
  googleReviews: "",
  // Instagram
  instagramEnabled: "true",
  instagramHandle: "dr.firaszoghieb",
  instagramFollowers: "",
  instagramBio: "Cosmetic Dentist · Composite Bonding · Invisalign · Veneers ✨",
  instagramPosts: "",
  // Hero section
  heroEyebrow: "Cosmetic Dentist Dubai",
  heroHeading: "Dr. Firas Zoghieb",
  heroBody:
    "Dr. Firas Zoghieb is an experienced cosmetic dentist specialising in composite bonding, Invisalign, and minimal-prep veneers. With a gentle, minimally invasive approach, he helps patients achieve beautiful, natural-looking smiles they can be proud of.",
  heroCta1Text: "Book Now",
  heroCta1Link: "/contact",
  heroCta2Text: "Learn More",
  heroCta2Link: "#about",
  heroImageUrl: "",
  heroStatNumber: "500+",
  heroStatLabel: "Smile Transformations",
  // About section
  aboutPara1:
    "Dr. Firas Zoghieb graduated with Honours in Dentistry (BDS) and subsequently completed a Master of Science in Cosmetic Dentistry, giving him an exceptional foundation in both the art and science of creating beautiful smiles.",
  aboutPara2:
    "With a special interest in restorative and cosmetic dentistry, Dr. Firas Zoghieb has completed extensive postgraduate training including certifications in Composite Bonding, Aesthetic Restorative Dentistry, and Invisalign. He focuses on minimally invasive treatments that preserve natural tooth structure while delivering outstanding aesthetic results.",
  aboutPara3:
    "Dr. Firas Zoghieb is dedicated to providing gentle, high-quality care. His greatest satisfaction comes from transforming patients' confidence in their smiles. He takes the time to listen to each patient's concerns and works collaboratively to create a treatment plan aligned with their desires and budget.",
  aboutPara4: "Outside of dentistry, Dr. Firas Zoghieb enjoys travelling, fitness, and spending time with family.",
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
  seoBlogTitle: "Dental Tips & Advice | Dr. Firas Zoghieb",
  seoBlogDesc: "Read expert dental tips and cosmetic dentistry advice from Dr. Firas Zoghieb, Dubai cosmetic dentist.",
  seoBlogKeywords: "",
  seoServicesTitle: "Our Services | Dr. Firas Zoghieb",
  seoServicesDesc: "Explore the full range of cosmetic dental treatments offered by Dr. Firas Zoghieb.",
  seoServicesKeywords: "",
  // Services section heading
  servicesEyebrow: "What We Offer",
  servicesHeading: "Our Services",
  servicesDesc: "Dr. Firas Zoghieb offers a full range of cosmetic and restorative dental treatments tailored to help you achieve the smile you deserve.",
  // Contact section heading
  contactEyebrow: "Get in Touch",
  contactHeading: "Book a Consultation",
  contactDesc: "Fill in the form and Dr. Firas Zoghieb's team will get back to you within 24 hours.",
  // Before & After section heading
  beforeAfterEyebrow: "Real Results",
  beforeAfterHeading: "Before & After",
  beforeAfterDesc: "See the life-changing smile transformations Dr. Firas Zoghieb has achieved for his patients.",
  seoAboutTitle: "",
  seoAboutDesc: "",
  seoAboutKeywords: "",
  seoContactTitle: "Contact Us | Dr. Firas Zoghieb",
  seoContactDesc: "Get in touch with Dr. Firas' clinic in Dubai. Book a consultation or send us a message.",
  seoContactKeywords: "",
  // Footer section
  footerCtaEyebrow: "Take the first step",
  footerCtaTitle: "Start Your Smile Journey Today",
  footerCtaDesc: "Book a free, no-obligation consultation with Dr. Firas and discover what a confident, beautiful smile can do for you.",
  footerCtaBtn1Text: "Book Free Consultation",
  footerCtaBtn2Text: "WhatsApp Us",
  footerHours: "Tue – Sun: 11:00 am – 8:00 pm",
  footerTagline: "Helping patients achieve beautiful, natural-looking smiles through gentle, minimally invasive cosmetic dentistry.",
};
