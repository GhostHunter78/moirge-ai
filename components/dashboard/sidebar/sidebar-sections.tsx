"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { DashboardPageMetadata, DashboardSection } from "@/types/dashboard";

export default function SidebarSections({
  sections,
  collapsed = false,
}: {
  sections: DashboardSection[];
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const tSections = useTranslations("dashboard.sidebar.sections");
  const tLabels = useTranslations("dashboard.sidebar.labels");

  const getSectionTranslation = (section: string): string => {
    const sectionMap: Record<string, string> = {
      General: "general",
      Shopping: "shopping",
      Communication: "communication",
      Commerce: "commerce",
      Insights: "insights",
      Settings: "settings",
    };
    const key = sectionMap[section] || section.toLowerCase();
    return tSections(key);
  };

  const getLabelTranslation = (label: string): string => {
    const labelMap: Record<string, string> = {
      Overview: "overview",
      "My Profile": "myProfile",
      Stores: "stores",
      Orders: "orders",
      Saved: "saved",
      Messages: "messages",
      Settings: "settings",
      "Store Profile": "storeProfile",
      "Public Store Page": "publicStorePage",
      Products: "products",
      Analytics: "analytics",
    };
    const key = labelMap[label] || label.toLowerCase();
    return tLabels(key);
  };

  return (
    <nav
      className={`w-full mt-6 flex flex-col items-start ${
        collapsed ? "gap-3" : "gap-6"
      }`}
    >
      {sections.map((group) => (
        <div key={group.section} className="w-full">
          <p
            className={`text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide ${
              collapsed ? "sr-only" : ""
            }`}
          >
            {getSectionTranslation(group.section)}
          </p>

          <div className="flex flex-col gap-1">
            {group.items.map((item: DashboardPageMetadata) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              const translatedLabel = getLabelTranslation(item.label);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                      w-full flex items-center rounded-md px-3 py-2 text-sm transition
                      ${collapsed ? "justify-center" : "gap-3"}
                      ${
                        active
                          ? "bg-teal-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-100 "
                      }
                    `}
                  title={translatedLabel}
                >
                  <Icon className="w-4 h-4" />
                  {!collapsed && <span>{translatedLabel}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
