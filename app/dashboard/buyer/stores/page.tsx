import { createClient } from "@/lib/supabaseServer";
import type { StoreProfile } from "@/types/dashboard";
import type { Profile } from "@/types/user-profile";
import StoreCard from "@/components/dashboard/stores/store-card";
import { Store } from "lucide-react";

export const metadata = {
  title: "Stores",
  description: "Browse all stores and discover sellers on the marketplace",
};

export default async function BuyerStoresPage() {
  const supabase = await createClient();

  const { data: stores, error: storesError } = await supabase
    .from("store_profiles")
    .select("*")
    .order("store_name", { ascending: true });

  if (storesError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Failed to load stores. Please try again.</p>
      </div>
    );
  }

  const storeList = (stores ?? []) as StoreProfile[];
  const userIds = storeList.map((s) => s.user_id);

  let profilesMap: Record<string, Profile> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, email, phone, role")
      .in("id", userIds);
    if (profiles) {
      profilesMap = (profiles as Profile[]).reduce(
        (acc, p) => {
          acc[p.id] = p;
          return acc;
        },
        {} as Record<string, Profile>
      );
    }
  }

  const storesWithOwners = storeList.map((store) => ({
    store,
    owner: profilesMap[store.user_id] ?? null,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {storesWithOwners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Store className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No stores yet
            </h2>
            <p className="text-gray-600 text-center max-w-sm">
              When sellers open their stores, they will appear here. Check back
              later to discover new shops.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-sm mb-6">
              {storesWithOwners.length} store
              {storesWithOwners.length !== 1 ? "s" : ""} on the marketplace
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {storesWithOwners.map(({ store, owner }) => (
                <StoreCard key={store.user_id} store={store} owner={owner} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
