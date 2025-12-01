import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "@/lib/i18n";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "never",
  localeDetection: false, 
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
