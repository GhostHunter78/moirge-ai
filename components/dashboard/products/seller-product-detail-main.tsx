"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, Package, TrendingUp, DollarSign, Edit, Eye } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: Product["status"] }) {
  const config = {
    active: {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dot: "bg-emerald-500",
    },
    draft: {
      label: "Draft",
      className: "bg-slate-50 text-slate-700 border-slate-100",
      dot: "bg-slate-400",
    },
    out_of_stock: {
      label: "Out of stock",
      className: "bg-amber-50 text-amber-800 border-amber-100",
      dot: "bg-amber-500",
    },
    archived: {
      label: "Archived",
      className: "bg-rose-50 text-rose-700 border-rose-100",
      dot: "bg-rose-500",
    },
  };

  const cfg = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        cfg.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

export default function SellerProductDetailMain() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.productId ?? "") as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const supabase = createClient();

    const loadData = async () => {
      setLoading(true);
      
      // Load product
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error || !data) {
        setError("Product not found or you do not have permission to view it.");
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(data as Product);
      setError(null);

      // Load related products (same seller, exclude current)
      if (data.seller_id) {
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", data.seller_id)
          .neq("id", productId)
          .order("created_at", { ascending: false })
          .limit(4);

        setRelatedProducts((related as Product[]) ?? []);
      }

      setLoading(false);
    };

    void loadData();
  }, [productId]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Button>
      </div>

      {loading && (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Loading product details...</p>
        </Card>
      )}

      {!loading && error && (
        <Card className="p-8 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </Card>
      )}

      {!loading && !error && product && (
        <>
          {/* Main Product Card */}
          <Card className="overflow-hidden border-slate-200/80 bg-white/90 backdrop-blur-sm">
            <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] lg:p-8">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 shadow-sm">
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
              </div>

              {/* Details Section */}
              <div className="flex flex-col space-y-6">
                {/* Title & Meta */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        {product.title}
                      </h1>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {product.category && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {product.category}
                          </span>
                        )}
                        <StatusBadge status={product.status} />
                        {product.featured && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {product.sku && (
                    <p className="text-xs text-slate-400">
                      SKU: <span className="font-mono">{product.sku}</span>
                    </p>
                  )}
                </div>

                {/* Price & Stats */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-linear-to-br from-emerald-50 to-emerald-100/50 p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="h-4 w-4" />
                      <p className="text-xs font-medium uppercase tracking-[0.1em]">
                        Price
                      </p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {product.currency} {product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-linear-to-br from-indigo-50 to-indigo-100/50 p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Package className="h-4 w-4" />
                      <p className="text-xs font-medium uppercase tracking-[0.1em]">
                        Stock
                      </p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {product.stock}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {product.stock === 0
                        ? "Out of stock"
                        : product.stock < 15
                        ? "Running low"
                        : "In stock"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-linear-to-br from-amber-50 to-amber-100/50 p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <TrendingUp className="h-4 w-4" />
                      <p className="text-xs font-medium uppercase tracking-[0.1em]">
                        Sold
                      </p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {product.sold_count}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Total sales</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-linear-to-br from-purple-50 to-purple-100/50 p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <p className="text-xs font-medium uppercase tracking-[0.1em]">
                        Rating
                      </p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {product.rating > 0 ? product.rating.toFixed(1) : "—"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {product.rating_count > 0
                        ? `${product.rating_count} review${
                            product.rating_count === 1 ? "" : "s"
                          }`
                        : "No reviews yet"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <h2 className="text-sm font-semibold text-slate-900">
                      Description
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    className="rounded-full bg-emerald-500 px-4 text-xs font-medium text-emerald-950 hover:bg-emerald-400"
                    asChild
                  >
                    <Link href={`/dashboard/seller/products/${product.id}`}>
                      <Edit className="mr-2 h-3.5 w-3.5" />
                      Edit product
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-slate-200 text-xs"
                  >
                    <Eye className="mr-2 h-3.5 w-3.5" />
                    View in storefront
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Other products from your catalog
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => router.push("/dashboard/seller/products")}
                >
                  View all
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/dashboard/seller/products/${related.id}`}
                  >
                    <Card className="group overflow-hidden border-slate-200/80 bg-white/90 transition-all hover:border-slate-300 hover:shadow-md">
                      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                        <Image
                          src={
                            related.thumbnail_url ??
                            "/images/hero-section-girl-asset.png"
                          }
                          alt={related.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="line-clamp-1 text-xs font-semibold text-slate-900">
                          {related.title}
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900">
                            {related.currency} {related.price.toFixed(2)}
                          </p>
                          {related.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs text-slate-600">
                                {related.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <StatusBadge status={related.status} />
                          <span className="text-xs text-slate-400">
                            {related.stock} in stock
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

