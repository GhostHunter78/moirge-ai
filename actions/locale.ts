"use server";

import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

export async function setLocaleCookie(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 31536000,
  });
}
