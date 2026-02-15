"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Pencil, Star } from "lucide-react";
import type { Product } from "@/lib/products";

export function SellerProductsFeaturedCard({ product }: { product: Product }) {
  const t = useTranslations("dashboard.sellerProducts.featured");

  return (
    <Card className="relative overflow-hidden border-none bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50">
      <div className="absolute inset-0 opacity-[0.65] mix-blend-screen">
        <div className="absolute left-[-30%] top-[-10%] h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.35),transparent_60%)] blur-2xl" />
        <div className="absolute right-[-10%] bottom-[-20%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.4),transparent_60%)] blur-2xl" />
      </div>

      <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-stretch sm:p-5">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 sm:w-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0,rgba(248,250,252,0.14),transparent_55%)]" />
          <Image
            src={product.thumbnail_url ?? "/images/hero-section-girl-asset.png"}
            alt={product.title}
            fill
            className="object-contain object-center mix-blend-screen"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t("badge")}
            </div>
            <h2 className="mt-2 text-sm sm:text-base font-semibold tracking-tight">
              {product.title}
            </h2>
            <p className="mt-1 text-[11px] text-slate-300/90">{t("hint")}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-200/80">
            <div>
              <p className="text-slate-400">{t("price")}</p>
              {product.sale_price != null ? (
                <>
                  <p className="text-xs text-slate-500 line-through">
                    {product.currency} {Number(product.price)}
                  </p>
                  <p className="font-medium text-emerald-700">
                    {product.currency} {Number(product.sale_price)}
                  </p>
                </>
              ) : (
                <p className="font-medium">
                  {product.currency} {Number(product.price)}
                </p>
              )}
            </div>
            <div>
              <p className="text-slate-400">{t("sold")}</p>
              <p className="font-medium">{product.sold_count}</p>
            </div>
            <div>
              <p className="text-slate-400">{t("rating")}</p>
              <p className="inline-flex items-center gap-1 font-medium">
                <Star className="h-3 w-3 text-amber-300" />
                {product.rating.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="h-8 rounded-full bg-slate-50 px-3 text-xs font-medium text-slate-900 hover:bg-slate-100"
              asChild
            >
              <Link href={`/dashboard/seller/products/${product.id}`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                {t("editDetails")}
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-8 rounded-full border-slate-600 bg-transparent px-3 text-[11px] text-slate-200 hover:bg-slate-800 hover:text-slate-50"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              {t("viewStorefront")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
