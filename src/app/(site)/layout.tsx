import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ContactSection />
      <Footer />
    </>
  );
}
