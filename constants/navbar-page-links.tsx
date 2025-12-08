import { useTranslations } from "next-intl";

export const SELLER_NAVBAR_PAGE_LINKS = (
  role: "seller" | "buyer" | undefined
) => {
  const t = useTranslations("navbar");
  return [
    {
      label: t("dashboard"),
      href: role === "seller" ? "/dashboard/seller" : "/dashboard/buyer",
    },
    {
      label: t("aboutUs"),
      href: "/about-us",
    },
    {
      label: t("contact"),
      href: "/contact",
    },
    {
      label: t("testimonials"),
      href: "#testimonials",
    },
  ];
};
