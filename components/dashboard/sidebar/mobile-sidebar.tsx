"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Profile } from "@/types/user-profile";
import SidebarContent from "./sidebar-content";

interface MobileSidebarProps {
  userInfo: Profile;
}

export default function MobileSidebar({ userInfo }: MobileSidebarProps) {
  const role = userInfo?.role === "seller" ? "seller" : "buyer";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-md">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-72">
        <SidebarContent role={role} userInfo={userInfo} />
      </SheetContent>
    </Sheet>
  );
}
