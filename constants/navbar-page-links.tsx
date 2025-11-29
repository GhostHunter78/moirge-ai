import { useTranslations } from "next-intl";

export const SELLER_NAVBAR_PAGE_LINKS = () => {
  const t = useTranslations("navbar");
  return [
    {
      label: t("dashboard"),
      href: "/dashboard",
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
