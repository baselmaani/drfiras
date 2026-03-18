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
};
