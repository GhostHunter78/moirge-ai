"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import DashboardSidebar from "@/components/dashboard/sidebar/dashboard-sidebar";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import DashboardPageWrapper from "@/components/dashboard/dashboard-page-wrapper";
import { Profile } from "@/types/user-profile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo, loading } = useUserProfile();
  const t = useTranslations("dashboard.layout");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#f8fafc] to-[#e0e7ff]">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#f8fafc] to-[#e0e7ff]">
        <div className="bg-white px-8 py-10 rounded-2xl shadow-lg flex flex-col items-center">
          <div className="mb-4">
            <LogIn className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">
            {t("signInRequired")}
          </h2>
          <p className="text-muted-foreground text-center mb-6 max-w-sm">
            {t("signInRequiredDescription")}
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <LogIn className="w-5 h-5" />
            {t("signIn")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <DashboardSidebar userInfo={userInfo as Profile} />
      <main className="flex-1">
        <DashboardPageWrapper userInfo={userInfo as Profile}>
          {children}
        </DashboardPageWrapper>
      </main>
    </div>
  );
}
