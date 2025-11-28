"use server";

import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/auth/signin");
};
