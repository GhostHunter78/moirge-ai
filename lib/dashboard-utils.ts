import { DASHBOARD_SIDEBAR_LINKS } from "@/constants/dashboard-sidebar-links";
import { DashboardPageMetadata } from "@/types/dashboard";

export function getPageMetadata(
  pathname: string,
  role: "buyer" | "seller"
): DashboardPageMetadata | null {
  const sections = DASHBOARD_SIDEBAR_LINKS[role];

  for (const section of sections) {
    const page = section.items.find((item) => item.href === pathname);
    if (page) {
      return page;
    }
  }

  return null;
}
