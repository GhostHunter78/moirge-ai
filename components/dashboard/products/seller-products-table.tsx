"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Eye, MoreHorizontal, Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductStatusPill } from "./product-status-pill";

export function SellerProductsTable({
  products,
  isLoading,
}: {
  products: Product[];
  isLoading: boolean;
}) {
  const t = useTranslations("dashboard.sellerProducts.table");

  return (
    <Card className="border-slate-200/80 bg-slate-50/80">
      <ScrollArea className="h-[320px]">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-100/80 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <th className="px-3 py-2.5 text-left font-medium">
                {t("product")}
              </th>
              <th className="hidden px-3 py-2.5 text-left font-medium sm:table-cell">
                {t("inventory")}
              </th>
              <th className="hidden px-3 py-2.5 text-left font-medium md:table-cell">
                {t("performance")}
              </th>
              <th className="px-3 py-2.5 text-right font-medium">
                {t("price")}
              </th>
              <th className="w-8 px-2 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-10 text-center text-xs text-slate-400"
                >
                  {t("loading")}
                </td>
              </tr>
            )}

            {!isLoading &&
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-100/80 bg-white/80 last:border-0 hover:bg-slate-50/80"
                >
                  <td className="max-w-[220px] px-3 py-2.5 align-top">
                    <Link
                      href={`/dashboard/seller/products/${product.id}`}
                      className="flex gap-2"
                    >
                      <div className="relative mt-0.5 h-9 w-9 overflow-hidden rounded-md border border-slate-100 bg-slate-50">
                        <Image
                          src={
                            product.thumbnail_url ??
                            "/images/hero-section-girl-asset.png"
                          }
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <p className="line-clamp-1 text-[11px] font-medium text-slate-900">
                            {product.title}
                          </p>
                          {product.featured && (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 ring-1 ring-amber-100">
                              {t("heroBadge")}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {product.category && (
                            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                              {product.category}
                            </span>
                          )}
                          {product.sku && (
                            <span className="text-[9px] text-slate-400">
                              SKU {product.sku}
                            </span>
                          )}
                        </div>
                        <ProductStatusPill status={product.status} />
                      </div>
                    </Link>
                  </td>

                  <td className="hidden px-3 py-2.5 align-middle text-[11px] text-slate-600 sm:table-cell">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {product.stock} {t("inStock")}
                      </p>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={cn(
                            "h-full rounded-full bg-emerald-500",
                            product.stock === 0 && "bg-rose-500",
                            product.stock > 0 &&
                              product.stock < 15 &&
                              "bg-amber-500",
                          )}
                          style={{
                            width: `${
                              product.stock === 0
                                ? 4
                                : Math.min(100, (product.stock / 80) * 100)
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {product.stock === 0
                          ? t("restockRecommended")
                          : product.stock < 15
                            ? t("runningLow")
                            : t("healthyInventory")}
                      </p>
                    </div>
                  </td>

                  <td className="hidden px-3 py-2.5 align-middle text-[11px] text-slate-600 md:table-cell">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {product.sold_count} {t("sold")}
                      </p>
                      {product.rating > 0 ? (
                        <p className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                          <Star className="h-3 w-3 text-amber-400" />
                          {product.rating.toFixed(1)} {t("averageRating")}
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400">
                          {t("notRatedYet")}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-2.5 align-middle text-right text-[11px] font-medium text-slate-900">
                    {product.sale_price != null ? (
                      <span className="text-slate-500 line-through">
                        {product.currency} {Number(product.price)}
                      </span>
                    ) : null}
                    {product.sale_price != null ? (
                      <span className="ml-1 text-emerald-700">
                        {product.currency} {Number(product.sale_price)}
                      </span>
                    ) : (
                      <span>
                        {product.currency} {Number(product.price)}
                      </span>
                    )}
                  </td>

                  <td className="px-2 py-2.5 align-middle">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        asChild
                      >
                        <Link href={`/dashboard/seller/products/${product.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

            {!isLoading && products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-10 text-center text-xs text-slate-400"
                >
                  {t("empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollArea>
    </Card>
  );
}
