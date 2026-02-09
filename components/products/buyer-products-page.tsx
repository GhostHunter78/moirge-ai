 "use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { Product } from "@/lib/products";
import Navbar from "@/components/home-page/navbar";
import Footer from "@/components/home-page/footer";
import { Profile } from "@/types/user-profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/lib/routing";
import {
  Filter,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Star,
} from "lucide-react";

type ProductWithStore = Product & {
  store_name?: string | null;
};

type SortOption =
  | "featured"
  | "newest"
  | "price_low_high"
  | "price_high_low"
  | "rating";

export default function BuyerProductsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<Profile | null>(null);

  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setUserInfo(null);
        return;
      }

      const { data: profile, error: userInfoError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (userInfoError || !profile) {
        setUserInfo(null);
        return;
      }

      setUserInfo(profile as Profile);
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setIsSignedIn(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setIsSignedIn(Boolean(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to load products. Please try again later.");
        setLoading(false);
        return;
      }

      const productsData = (data as Product[]) ?? [];

      if (productsData.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const sellerIds = Array.from(
        new Set(productsData.map((p) => p.seller_id).filter(Boolean)),
      );

      let storesBySellerId: Record<string, { store_name: string | null }> = {};

      if (sellerIds.length > 0) {
        const { data: stores } = await supabase
          .from("store_profiles")
          .select("user_id, store_name")
          .in("user_id", sellerIds);

        if (stores && stores.length > 0) {
          storesBySellerId = stores.reduce(
            (acc, store) => {
              acc[store.user_id as string] = {
                store_name: (store as { store_name: string | null }).store_name,
              };
              return acc;
            },
            {} as Record<string, { store_name: string | null }>,
          );
        }
      }

      const enriched = productsData.map((product) => ({
        ...product,
        store_name: storesBySellerId[product.seller_id]?.store_name ?? null,
      }));

      setProducts(enriched);
      setLoading(false);
    };

    fetchProducts();
  }, [supabase]);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(
        products
          .map((p) => p.category)
          .filter((c): c is string => Boolean(c && c.trim().length > 0)),
      ),
    );
    return cats.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDescription =
          p.description?.toLowerCase().includes(query) ?? false;
        const matchesStore =
          p.store_name?.toLowerCase().includes(query) ?? false;
        return matchesTitle || matchesDescription || matchesStore;
      });
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "price_low_high":
          return a.price - b.price;
        case "price_high_low":
          return b.price - a.price;
        case "newest":
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        case "rating": {
          if (a.rating === b.rating) {
            return b.rating_count - a.rating_count;
          }
          return b.rating - a.rating;
        }
        case "featured":
        default: {
          if (a.featured === b.featured) {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          }
          return a.featured ? -1 : 1;
        }
      }
    });

    return result;
  }, [products, searchQuery, selectedCategory, sortBy, onlyInStock]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "all" ||
    !onlyInStock;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isSignedIn={isSignedIn} userInfo={userInfo} />

      <main className="pt-[80px] pb-16">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700/80">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <ShoppingBag className="h-3 w-3" />
                </span>
                Curated Clothing Marketplace
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                Discover clothes from{" "}
                <span className="bg-linear-to-r from-teal-500 via-emerald-400 to-sky-500 bg-clip-text text-transparent">
                  different sellers
                </span>
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-slate-600">
                Explore unique pieces from independent brands and creators. Use
                filters, sorting and search to find the perfect fit for your
                style.
              </p>
            </div>
          </header>

          <Card className="border-slate-200/80 bg-white/80 backdrop-blur">
            <CardHeader className="gap-4 border-b border-slate-100/80">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search for clothes, sellers or styles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 pl-9 bg-slate-50/60 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Filter className="h-3.5 w-3.5" />
                  {hasActiveFilters ? (
                    <span>Filters applied — refine your results</span>
                  ) : (
                    <span>Use filters to narrow down outfits</span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    Category
                  </span>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="min-w-[140px]">
                      <SelectValue placeholder="All clothing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All clothing</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    Sort by
                  </span>
                  <Select
                    value={sortBy}
                    onValueChange={(value: SortOption) => setSortBy(value)}
                  >
                    <SelectTrigger className="min-w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">
                        Featured & newest first
                      </SelectItem>
                      <SelectItem value="newest">Newest arrivals</SelectItem>
                      <SelectItem value="price_low_high">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price_high_low">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Top rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button
                  type="button"
                  onClick={() => setOnlyInStock((prev) => !prev)}
                  className={
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                    (onlyInStock
                      ? "border-emerald-500/70 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-400/70 hover:text-emerald-700")
                  }
                >
                  <span
                    className={
                      "h-4 w-4 rounded-full border border-current transition " +
                      (onlyInStock ? "bg-emerald-500/90" : "bg-transparent")
                    }
                  />
                  In stock only
                </button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-xs text-slate-500 hover:text-slate-700"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSortBy("featured");
                      setOnlyInStock(true);
                    }}
                  >
                    <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                    Reset filters
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {loading
                    ? "Loading clothes from different sellers…"
                    : filteredProducts.length > 0
                      ? `Showing ${filteredProducts.length} item${
                          filteredProducts.length > 1 ? "s" : ""
                        }`
                      : "No products match your filters yet."}
                </span>
                {products.length > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400" />
                    <span>
                      Ratings shown are based on each seller&apos;s sales
                      history.
                    </span>
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Card
                  key={idx}
                  className="border-slate-200/80 bg-white/80 shadow-sm"
                >
                  <CardContent className="pt-3 pb-4 space-y-3">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="border-dashed border-slate-200/80 bg-white/80 text-center py-10">
              <CardHeader className="items-center gap-3 border-0">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Filter className="h-5 w-5" />
                </div>
                <CardTitle className="text-base sm:text-lg">
                  No clothes found for your selection
                </CardTitle>
                <CardDescription className="max-w-md">
                  Try clearing some filters or searching with a different word
                  to discover more outfits from our sellers.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSortBy("featured");
                    setOnlyInStock(true);
                  }}
                >
                  Reset filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <section
              aria-label="Clothing products grid"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:border-teal-400/70 hover:shadow-md"
                >
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-100">
                    {product.thumbnail_url ? (
                      // Using standard img here to avoid domain configuration issues
                      <img
                        src={product.thumbnail_url}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                        Clothing from our sellers
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute left-2 top-2 rounded-full bg-amber-400/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900 shadow-sm">
                        Featured
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute right-2 top-2 rounded-full bg-slate-900/85 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-50">
                        Sold out
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 px-3.5 pb-3.5 pt-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        {product.category && (
                          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                            {product.category}
                          </p>
                        )}
                        <h2 className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {product.title}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          {product.price.toLocaleString(undefined, {
                            style: "currency",
                            currency: product.currency || "USD",
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        {product.stock > 0 && (
                          <p className="text-[11px] text-emerald-600">
                            In stock · {product.stock} left
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
                          <Star className="h-3 w-3 text-amber-400" />
                          <span className="font-medium">
                            {product.rating?.toFixed(1) ?? "4.5"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({product.rating_count ?? 0})
                          </span>
                        </div>
                        {product.store_name && (
                          <span className="truncate text-xs text-slate-500">
                            by{" "}
                            <span className="font-medium text-slate-700">
                              {product.store_name}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {product.sold_count > 0 && (
                          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700">
                            {product.sold_count}+ sold
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <Link
                        href={`/store/${product.seller_id}`}
                        className="text-xs font-medium text-teal-700 hover:text-teal-800 underline-offset-2 hover:underline"
                      >
                        View seller&apos;s store
                      </Link>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-xs transition hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </section>
      </main>

      <Footer userInfo={userInfo} />
    </div>
  );
}