"use server";

import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  return redirect(`/${locale}/auth/signin`);
};
