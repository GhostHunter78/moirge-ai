"use client";

import Image from "next/image";
import { DASHBOARD_SIDEBAR_LINKS } from "@/constants/dashboard-sidebar-links";
import { Profile } from "@/types/user-profile";
import { signOut } from "@/actions/sign-out";
import SidebarSections from "./sidebar-sections";
import {
  Bell,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function SidebarContent({
  role,
  userInfo,
  collapsed = false,
  onToggleCollapse,
}: {
  role: string;
  userInfo: Profile;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  if (!userInfo?.role) return null;
  const sections = DASHBOARD_SIDEBAR_LINKS[userInfo.role];
  const isCollapsed = !!collapsed;

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div
      className={`flex w-full h-full flex-col justify-between ${
        isCollapsed ? "items-start" : ""
      }`}
    >
      {/* HEADER */}
      <div className={`w-full ${isCollapsed ? "p-4" : "p-6 "}`}>
        <Link href="/" className="block">
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-start" : ""
            }`}
          >
            <Image
              src="/logo.png"
              alt="Moirge"
              width={isCollapsed ? 40 : 50}
              height={isCollapsed ? 40 : 50}
              className="rounded-lg"
            />
            {!isCollapsed && (
              <div className="flex flex-col leading-tight">
                <h2 className="text-xl font-semibold">Moirge</h2>
                <p className="text-sm text-gray-500 capitalize">{role}</p>
              </div>
            )}
          </div>
        </Link>

        <div className="w-full flex items-center justify-start gap-x-5 mt-6">
          {!isCollapsed && (
            <div className="max-w-50 flex items-center justify-start gap-x-5">
              <button
                className="relative rounded-xl px-2 py-1 flex items-center transition cursor-pointer hover:bg-gray-100"
                aria-label="Notifications"
              >
                <span className="text-gray-700">
                  <Bell width={18} height={18} />
                </span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </button>
              <LanguageSwitcher />
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden relative rounded-xl px-2 py-1 md:flex items-center transition cursor-pointer hover:bg-gray-100"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!isCollapsed ? (
              <PanelLeftClose className="w-4 h-4 text-gray-700" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-gray-700" />
            )}
          </button>
        </div>

        <hr className="mt-4" />

        <SidebarSections sections={sections} collapsed={isCollapsed} />
      </div>

      {/* LOGOUT */}
      <div
        className={`p-6 border-t w-full ${
          isCollapsed ? "flex justify-center" : ""
        }`}
      >
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100 transition cursor-pointer ${
            isCollapsed ? "justify-center w-12 h-12 p-0" : "w-full"
          }`}
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
