"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(
  prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get("password") as string;

  if (!password || password !== process.env.ADMIN_SECRET) {
    return { error: "Invalid password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin-session", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-session");
  redirect("/dashboard/login");
}
