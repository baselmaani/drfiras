import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <>
      {children}
      <Footer />
      <WhatsAppButton
        whatsappUrl={s.whatsapp}
        doctorName={s.doctorName}
        heroImageUrl={s.heroImageUrl || undefined}
      />
    </>
  );
}
