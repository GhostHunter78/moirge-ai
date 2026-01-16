"use client";

import OverviewSellerMain from "@/components/dashboard/overview/overview-seller-main";
import OverviewBuyerMain from "@/components/dashboard/overview/overview-buyer-main";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { userInfo, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="px-4">
      {userInfo.role === "seller" ? (
        <OverviewSellerMain />
      ) : (
        <OverviewBuyerMain />
      )}
    </div>
  );
}
