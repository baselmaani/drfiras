import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { getMenuItems } from "@/lib/actions/menu";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const [raw, menuItems] = await Promise.all([getSettings(), getMenuItems()]);
  const s = { ...DEFAULT_SETTINGS, ...raw };
  return <NavbarClient phone={s.phone} whatsapp={s.whatsapp} instagram={s.instagram} tiktok={s.tiktok} logoUrl={s.logoUrl} doctorName={s.doctorName} specialty={s.specialty} menuItems={menuItems} />;
}

