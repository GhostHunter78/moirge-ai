"use client";

import { useEffect, useState } from "react";
import { Loader2, Link2, Copy, Check } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getStoreProfile } from "@/lib/store-profile";
import type { StoreProfile } from "@/types/dashboard";
import StorePublicProfileView from "@/components/dashboard/store-profile/store-public-profile-view";

export default function PublicStorePreviewPage() {
  const { userInfo, loading } = useUserProfile();
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [storeLoading, setStoreLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const publicStoreUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/store/${userInfo.id}`
      : "";

  const copyPublicLink = () => {
    if (!publicStoreUrl) return;
    void navigator.clipboard.writeText(publicStoreUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-teal-800 font-medium">
          <Link2 className="w-4 h-4 shrink-0" />
          <span>Public store link (share with buyers)</span>
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <code className="text-sm text-teal-900 bg-white/80 px-2 py-1.5 rounded border border-teal-100 truncate flex-1 min-w-0">
            {publicStoreUrl || `/store/${userInfo.id}`}
          </code>
          <button
            type="button"
            onClick={copyPublicLink}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      <StorePublicProfileView store={store} owner={userInfo} mode="preview" />
    </div>
  );
}
