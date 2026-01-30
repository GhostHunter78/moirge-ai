"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";

export function SellerProductsHero({
  onNewProduct,
}: {
  onNewProduct: () => void;
}) {
  const t = useTranslations("dashboard.sellerProducts.hero");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 px-4 py-5 sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-40 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(248,250,252,0.16)_0,transparent_60%)] blur-xl" />
        <div className="absolute right-[-4rem] top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.35)_0,transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0,rgba(15,23,42,0.15)_40%,transparent_80%)]" />
      </div>

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 ring-1 ring-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("badge")}
          </p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-300">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <Button
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs sm:text-sm font-medium text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
            onClick={onNewProduct}
          >
            <Plus className="h-4 w-4" />
            {t("newProduct")}
          </Button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[11px] text-slate-300/80 hover:text-slate-100 transition-colors"
          >
            {t("importCatalog")}
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
