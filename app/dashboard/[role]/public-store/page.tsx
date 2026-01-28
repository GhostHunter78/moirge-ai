"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getStoreProfile } from "@/lib/store-profile";
import type { StoreProfile } from "@/types/dashboard";
import StorePublicProfileView from "@/components/dashboard/store-profile/store-public-profile-view";

export default function PublicStorePreviewPage() {
  const { userInfo, loading } = useUserProfile();
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userInfo?.id) {
        setStore(null);
        setStoreLoading(false);
        return;
      }

      setStoreLoading(true);
      const { data } = await getStoreProfile(userInfo.id);
      setStore(data as StoreProfile | null);
      setStoreLoading(false);
    };

    void load();
  }, [userInfo]);

  if (loading || storeLoading) {
    return (
      <div className="flex items-center justify-center h-full py-16">
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!userInfo || userInfo.role !== "seller") {
    return null;
  }

  return (
    <div className="p-4 sm:p-6">
      <StorePublicProfileView store={store} owner={userInfo} mode="preview" />
    </div>
  );
}
