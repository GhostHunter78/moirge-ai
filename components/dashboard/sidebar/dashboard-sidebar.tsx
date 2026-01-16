"use client";

import { Profile } from "@/types/user-profile";
import SidebarContent from "./sidebar-content";
import { useState } from "react";

export default function Sidebar({ userInfo }: { userInfo: Profile }) {
  const role = userInfo?.role === "seller" ? "seller" : "buyer";
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex h-screen border-r bg-white transition-all duration-200 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <SidebarContent
        role={role}
        userInfo={userInfo}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
    </aside>
  );
}
