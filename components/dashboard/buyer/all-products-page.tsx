"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/products";
import { getPublicProducts } from "@/lib/products";

type SortOption = "relevance" | "price_low_high" | "price_high_low" | "rating_high_low";

export default function AllProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await getPublicProducts();

      if (isCancelled) return;

      if (error) {
        console.error("Error loading public products", error);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } else {
        setProducts(data ?? []);
      }

      setIsLoading(false);
    };

    void load();

    return () => {
      isCancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.category)
        .filter((c): c is string => !!c && c.trim().length > 0)
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const categoryMatch = (p.category ?? "").toLowerCase().includes(q);
        const sellerMatch = (p.seller_id ?? "").toLowerCase().includes(q);
        return titleMatch || categoryMatch || sellerMatch;
      });
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    switch (sortBy) {
      case "price_low_high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high_low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating_high_low":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }

    return result;
  }, [search, category, sortBy, products]);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Discover products
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Browse products from every registered seller on the marketplace. Use the filters to
          quickly find exactly what you are looking for.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Filters */}
        <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Search & filters</h2>
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Search products</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category or seller"
                className="h-9 rounded-full border-slate-200 bg-slate-50/80 pl-9 text-xs focus-visible:ring-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 rounded-full border-slate-200 bg-slate-50/80 text-xs">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Sort by</label>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger className="h-9 rounded-full border-slate-200 bg-slate-50/80 text-xs">
                <SelectValue placeholder="Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_low_high">Price: Low to High</SelectItem>
                <SelectItem value="price_high_low">Price: High to Low</SelectItem>
                <SelectItem value="rating_high_low">Rating: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-1 h-8 w-full rounded-full border-slate-200 text-xs text-slate-600"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setSortBy("relevance");
            }}
          >
            Clear filters
          </Button>
        </aside>

        {/* Products grid */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing <span className="font-medium text-slate-900">{filteredProducts.length}</span>{" "}
              products from{" "}
              <span className="font-medium text-slate-900">
                {new Set(products.map((p) => p.seller_id)).size}
              </span>{" "}
              sellers
            </span>
          </div>

          {isLoading && (
            <Card className="flex items-center justify-center border-slate-200 bg-slate-50/80 py-10 text-sm text-slate-500">
              Loading products from all sellers...
            </Card>
          )}

          {!isLoading && error && (
            <Card className="flex flex-col items-center justify-center gap-2 border-amber-200 bg-amber-50/80 py-8 text-center">
              <p className="text-sm font-medium text-amber-900">{error}</p>
              <p className="text-xs text-amber-800/80">
                Please refresh the page or try again in a moment.
              </p>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group relative flex flex-col overflow-hidden border-slate-200 bg-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={
                      product.thumbnail_url ??
                      "/images/hero-section-girl-asset.png"
                    }
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute left-2 top-2 flex flex-col gap-1">
                    {product.featured && (
                      <Badge className="h-6 rounded-full bg-amber-400/90 px-2 text-[10px] font-semibold text-amber-950">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Add to wishlist</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-emerald-950 shadow-sm hover:bg-emerald-400"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only">Add to cart</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                        {product.category ?? "Uncategorized"}
                      </p>
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {product.title}
                      </h3>
                      <p className="truncate text-xs text-slate-500">
                        Seller{" "}
                        <span className="font-medium text-slate-700">
                          {product.seller_id.slice(0, 8)}...
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-900">
                        {product.currency} {product.price.toFixed(2)}
                      </p>
                      {product.rating_count > 0 && (
                        <p className="text-[11px] text-slate-500">
                          {product.rating.toFixed(1)} ·{" "}
                          {product.rating_count} reviews
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="hidden h-8 rounded-full bg-emerald-500 px-3 text-[11px] font-medium text-emerald-950 hover:bg-emerald-400 sm:inline-flex"
                    >
                      Add to cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="flex flex-col items-center justify-center gap-2 border-dashed border-slate-200 bg-slate-50/80 py-10 text-center">
              <p className="text-sm font-medium text-slate-900">
                No products match your filters
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Try adjusting your search or clearing some filters to see more products from
                all sellers.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 h-8 rounded-full border-slate-200 text-xs"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setSortBy("relevance");
                }}
              >
                Reset filters
              </Button>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

