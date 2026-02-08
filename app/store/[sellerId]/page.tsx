import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import type { StoreProfile } from "@/types/dashboard";
import type { Profile } from "@/types/user-profile";
import StorePublicProfileView from "@/components/dashboard/store-profile/store-public-profile-view";

interface StorePublicPageProps {
  params: Promise<{ sellerId: string }>;
}

export default async function StorePublicPage({
  params,
}: StorePublicPageProps) {
  const { sellerId } = await params;
  const supabase = await createClient();

  // Load store profile for this seller
  const { data: store, error: storeError } = await supabase
    .from("store_profiles")
    .select("*")
    .eq("user_id", sellerId)
    .single();

  if (storeError || !store) {
    return notFound();
  }

  // Load basic seller profile (for username, etc.)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", sellerId)
    .single();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        <StorePublicProfileView
          store={store as StoreProfile}
          owner={(profile as Profile | null) ?? null}
          mode="public"
        />
      </main>
    </div>
  );
}
