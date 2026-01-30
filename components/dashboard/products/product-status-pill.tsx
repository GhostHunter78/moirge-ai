"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/lib/products";

const statusToKey: Record<ProductStatus, string> = {
  active: "active",
  draft: "draft",
  out_of_stock: "outOfStock",
  archived: "archived",
};

const statusStyles: Record<
  ProductStatus,
  { className: string; dotClass: string }
> = {
  active: {
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dotClass: "bg-emerald-500",
  },
  draft: {
    className: "bg-slate-50 text-slate-700 border-slate-100",
    dotClass: "bg-slate-400",
  },
  out_of_stock: {
    className: "bg-amber-50 text-amber-800 border-amber-100",
    dotClass: "bg-amber-500",
  },
  archived: {
    className: "bg-rose-50 text-rose-700 border-rose-100",
    dotClass: "bg-rose-500",
  },
};

export function ProductStatusPill({ status }: { status: ProductStatus }) {
  const t = useTranslations("dashboard.sellerProducts.status");
  const styles = statusStyles[status];
  const label = t(statusToKey[status]);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        styles.className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dotClass)} />
      {label}
    </span>
  );
}
