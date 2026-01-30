"use client";

import { useTranslations } from "next-intl";
import { ProductMetricCard } from "./product-metric-card";

export function SellerProductsMetrics({
  totalActive,
  totalOutOfStock,
  totalDrafts,
}: {
  totalActive: number;
  totalOutOfStock: number;
  totalDrafts: number;
}) {
  const t = useTranslations("dashboard.sellerProducts.metrics");

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <ProductMetricCard
        label={t("liveProducts")}
        value={String(totalActive)}
        hint={t("liveProductsHint")}
        accent="emerald"
      />
      <ProductMetricCard
        label={t("lowStock")}
        value={String(totalOutOfStock)}
        hint={t("lowStockHint")}
        accent="amber"
      />
      <ProductMetricCard
        label={t("drafts")}
        value={String(totalDrafts)}
        hint={t("draftsHint")}
        accent="indigo"
      />
    </div>
  );
}
