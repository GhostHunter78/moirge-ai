"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarSections({
  sections,
  collapsed = false,
}: {
  sections: {
    section: string;
    items: { label: string; href: string; icon: React.ElementType }[];
  }[];
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={`w-full mt-6 flex flex-col items-start ${
        collapsed ? "gap-3" : "gap-6"
      }`}
    >
      {sections.map((group) => (
        <div key={group.section}>
          <p
            className={`text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide ${
              collapsed ? "sr-only" : ""
            }`}
          >
            {group.section}
          </p>

          <div className="flex flex-col gap-1">
            {group.items.map(
              (item: {
                label: string;
                href: string;
                icon: React.ElementType;
              }) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center rounded-md px-3 py-2 text-sm transition
                      ${collapsed ? "justify-center" : "gap-3"}
                      ${
                        active
                          ? "bg-teal-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-100 "
                      }
                    `}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              }
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}
