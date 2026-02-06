"use client";
import { HandIcon, LogOut, User, Bug } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/lib/routing";
import { signOut } from "@/actions/sign-out";
import { Profile } from "@/types/user-profile";
import { useTranslations } from "next-intl";

export function ProfileDropDown({ user }: { user: Profile }) {
  const t = useTranslations("profileDropdown");

  const initials =
    user?.username?.trim()?.slice(0, 2)?.toUpperCase() ||
    user?.email?.trim()?.slice(0, 2)?.toUpperCase() ||
    "U";

  const renderRoleScopedItems = () => {
    switch (user.role) {
      case "seller":
      case "buyer":
        return commonItems();
      case "seller":
        return commonItems();
      default:
        return commonItems();
    }
  };

  const commonItems = () => (
    <>
      <Link
        href={
          user.role === "seller"
            ? `/dashboard/seller/store-profile`
            : user.role === "buyer"
              ? `/dashboard/buyer/profile`
              : "#"
        }
      >
        <DropdownMenuItem className="mx-1 px-3 py-3 cursor-pointer rounded-xl hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
          <div className="flex items-center w-full">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-medium text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
              {t("myProfile")}
            </span>
          </div>
        </DropdownMenuItem>
      </Link>
      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-3 mx-3" />
      <Link href="/help">
        <DropdownMenuItem className="mx-1 px-3 py-3 cursor-pointer rounded-xl hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group">
          <div className="flex items-center w-full">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
              <HandIcon className="h-4 w-4 text-purple-600" />
            </div>
            <span className="font-medium text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
              {t("helpSupport")}
            </span>
          </div>
        </DropdownMenuItem>
      </Link>
      <Link href="/report-bug">
        <DropdownMenuItem className="mx-1 px-3 py-3 cursor-pointer rounded-xl hover:bg-linear-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-300 group">
          <div className="flex items-center w-full">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors">
              <Bug className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="font-medium text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
              {t("reportBug")}
            </span>
          </div>
        </DropdownMenuItem>
      </Link>
      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-3 mx-3" />
      <DropdownMenuItem
        onClick={async () => await signOut()}
        className="mx-1 px-3 py-3 cursor-pointer rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group"
      >
        <div className="flex items-center w-full">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
          <span className="font-medium text-sm text-gray-700 group-hover:text-red-600 transition-colors">
            {t("logout")}
          </span>
        </div>
      </DropdownMenuItem>
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 transition cursor-pointer hover:bg-blue-200">
          <User width={18} height={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 shadow-2xl rounded-2xl border border-gray-200/60 backdrop-blur-xl bg-white/95 py-3 mt-2">
        <div className="flex items-center gap-4 px-5 py-4 bg-linear-to-r from-blue-50/80 to-purple-50/80 rounded-xl mx-3 mb-3">
          <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 ring-3 ring-white shadow-lg flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden min-w-0 flex-1">
            <DropdownMenuLabel className="p-0 text-lg font-bold text-gray-800 truncate">
              {user.username}
            </DropdownMenuLabel>
            {user.email ? (
              <p className="text-sm text-gray-600 truncate font-medium">
                {user.email}
              </p>
            ) : null}
            <p className="text-xs text-gray-500 capitalize font-semibold mt-1 px-2 py-1 bg-white/60 rounded-full w-fit">
              {user.role}
            </p>
          </div>
        </div>
        <div className="px-2">
          <DropdownMenuGroup className="space-y-1">
            {renderRoleScopedItems()}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
