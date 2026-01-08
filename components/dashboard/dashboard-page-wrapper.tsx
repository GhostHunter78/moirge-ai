"use client";

import { usePathname } from "next/navigation";
import { getPageMetadata } from "@/lib/dashboard-utils";
import DashboardPageHeader from "./dashboard-page-header";
import { LucideIcon } from "lucide-react";
import { DashboardPageWrapperProps } from "@/types/dashboard";

export default function DashboardPageWrapper({
  children,
  userInfo,
}: DashboardPageWrapperProps) {
  const pathname = usePathname();
  const role = userInfo?.role === "seller" ? "seller" : "buyer";
  const pageMetadata = getPageMetadata(pathname, role);

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div>
        {pageMetadata && (
          <DashboardPageHeader
            icon={pageMetadata.icon as LucideIcon}
            title={pageMetadata.title}
            description={pageMetadata.description}
          />
        )}
        <div className={pageMetadata ? "mt-8" : ""}>{children}</div>
      </div>
    </div>
  );
}
