"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { ProductStatus } from "@/lib/products";

export function SellerProductsFilters({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  statusFilter: ProductStatus | "all";
  onStatusFilterChange: (v: ProductStatus | "all") => void;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  categories: string[];
}) {
  const t = useTranslations("dashboard.sellerProducts.filters");
  const tStatus = useTranslations("dashboard.sellerProducts.status");

  return (
    <div className="flex flex-col gap-3 px-4 pb-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="h-9 rounded-full border-slate-200 bg-slate-50/80 pl-9 text-xs focus-visible:ring-slate-200"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="hidden h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:bg-slate-50 sm:inline-flex"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={statusFilter}
          onValueChange={(v) =>
            onStatusFilterChange(v as ProductStatus | "all")
          }
        >
          <SelectTrigger className="h-9 min-w-[130px] rounded-full border-slate-200 bg-slate-50/80 text-xs">
            <SelectValue placeholder={t("statusPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatuses")}</SelectItem>
            <SelectItem value="active">{tStatus("active")}</SelectItem>
            <SelectItem value="draft">{tStatus("draft")}</SelectItem>
            <SelectItem value="out_of_stock">
              {tStatus("outOfStock")}
            </SelectItem>
            <SelectItem value="archived">{tStatus("archived")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="h-9 min-w-[130px] rounded-full border-slate-200 bg-slate-50/80 text-xs">
            <SelectValue placeholder={t("categoryPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === "all" ? t("allCategories") : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
