"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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
import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  X,
  Minus,
  Plus,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Product } from "@/lib/products";
import { getPublicProducts } from "@/lib/products";

type SortOption =
  | "relevance"
  | "price_low_high"
  | "price_high_low"
  | "rating_high_low";

type CartItem = {
  product: Product;
  quantity: number;
};

const displayPrice = (p: Product) =>
  p.sale_price != null ? Number(p.sale_price) : Number(p.price);

export default function AllProductsPage() {
  const t = useTranslations("dashboard.buyerProducts.allProducts");
  const tCart = useTranslations("dashboard.buyerProducts.cart");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await getPublicProducts();

        if (isCancelled) return;

        if (fetchError) {
          console.error("Error loading public products", fetchError);
          setError("Failed to load products. Please try again.");
          setProducts([]);
        } else {
          setProducts(data ?? []);
        }
      } catch (err) {
        if (isCancelled) return;
        console.error("Unexpected error loading products", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
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
        result = result.slice().sort((a, b) => displayPrice(a) - displayPrice(b));
        break;
      case "price_high_low":
        result = result.slice().sort((a, b) => displayPrice(b) - displayPrice(a));
        break;
      case "rating_high_low":
        result = result.slice().sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        // Do not mutate or sort if relevance -- maintain original order
        break;
    }

    return result;
  }, [search, category, sortBy, products]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + displayPrice(item.product) * item.quantity,
        0
      ),
    [cartItems]
  );

  const cartCurrency = cartItems[0]?.product.currency ?? "USD";

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const incrementItem = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementItem = (productId: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          {t("description")}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Filters */}
        <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              {t("filters.searchAndFilters")}
            </h2>
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              {t("filters.searchLabel")}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("filters.searchPlaceholder")}
                className="h-9 rounded-full border-slate-200 bg-slate-50/80 pl-9 text-xs focus-visible:ring-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              {t("filters.categoryLabel")}
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 rounded-full border-slate-200 bg-slate-50/80 text-xs">
                <SelectValue placeholder={t("filters.allCategories")} />
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
            <label className="text-xs font-medium text-slate-700">
              {t("filters.sortByLabel")}
            </label>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger className="h-9 rounded-full border-slate-200 bg-slate-50/80 text-xs">
                <SelectValue placeholder={t("filters.relevance")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">{t("filters.relevance")}</SelectItem>
                <SelectItem value="price_low_high">
                  {t("filters.priceLowHigh")}
                </SelectItem>
                <SelectItem value="price_high_low">
                  {t("filters.priceHighLow")}
                </SelectItem>
                <SelectItem value="rating_high_low">
                  {t("filters.ratingHighLow")}
                </SelectItem>
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
            {t("filters.clear")}
          </Button>
        </aside>

        {/* Products grid */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              {t.rich("resultsSummary", {
                count: () => (
                  <span className="font-medium text-slate-900">
                    {filteredProducts.length}
                  </span>
                ),
                sellers: () => (
                  <span className="font-medium text-slate-900">
                    {new Set(products.map((p) => p.seller_id)).size}
                  </span>
                ),
              })}
            </span>
          </div>

          {isLoading && (
            <Card className="flex items-center justify-center border-slate-200 bg-slate-50/80 py-10 text-sm text-slate-500">
              {t("loading")}
            </Card>
          )}

          {!isLoading && error && (
            <Card className="flex flex-col items-center justify-center gap-2 border-amber-200 bg-amber-50/80 py-8 text-center">
              <p className="text-sm font-medium text-amber-900">
                {t("loadError")}
              </p>
              <p className="text-xs text-amber-800/80">
                Please refresh the page or try again in a moment.
              </p>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
                      onClick={() => addToCart(product)}
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
                          {(product.seller_id ?? "").slice(0, 8)}...
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                    <div className="space-y-0.5">
                      {product.sale_price != null ? (
                        <>
                          <p className="text-xs font-medium text-slate-500 line-through">
                            {product.currency}{" "}
                            {Number(product.price).toFixed(2)}
                          </p>
                          <p className="text-sm font-semibold text-emerald-700">
                            {product.currency}{" "}
                            {Number(product.sale_price).toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-semibold text-slate-900">
                          {product.currency}{" "}
                          {Number(product.price).toFixed(2)}
                        </p>
                      )}
                      {!!product.rating_count && product.rating_count > 0 && (
                        <p className="text-[11px] text-slate-500">
                          {product.rating?.toFixed(1)} ·{" "}
                          {product.rating_count} reviews
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
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
                {t("emptyState.title")}
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                {t("emptyState.description")}
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
                {t("emptyState.reset")}
              </Button>
            </Card>
          )}
        </section>

        {/* Cart sheet trigger (desktop + mobile) */}
        <div className="fixed bottom-4 right-4 z-40">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-slate-50 shadow-lg shadow-slate-900/40 ring-1 ring-slate-700 hover:bg-slate-800"
              >
                <div className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-emerald-950">
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-semibold text-slate-50">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span>{tCart("trigger.label")}</span>
                  <span className="text-[11px] text-slate-300">
                    {cartCurrency} {cartSubtotal.toFixed(2)}
                  </span>
                </div>
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="border-l border-slate-200 bg-white text-slate-900"
            >
              <SheetHeader className="border-b border-slate-100 pb-3">
                <SheetTitle className="text-sm font-semibold text-slate-900">
                  {tCart("title")}
                </SheetTitle>
                <p className="text-xs text-slate-500">
                  {tCart("summary", { count: cartCount })}
                </p>
              </SheetHeader>

              <div className="flex-1 space-y-3 overflow-hidden">
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                  {cartItems.length === 0 ? (
                    <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        {tCart("empty.title")}
                      </p>
                      <p className="text-xs text-slate-500">
                        {tCart("empty.description")}
                      </p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 rounded-xl border border-gray-200 p-3"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={
                              item.product.thumbnail_url ??
                              "/images/hero-section-girl-asset.png"
                            }
                            alt={item.product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="line-clamp-2 text-xs font-medium text-slate-900">
                            {item.product.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.product.currency}{" "}
                            {displayPrice(item.product).toFixed(2)}
                          </p>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5">
                              <button
                                type="button"
                                onClick={() => decrementItem(item.product.id)}
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-[1.25rem] text-center text-[11px] font-medium text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => incrementItem(item.product.id)}
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[11px] text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <X className="h-3 w-3" />
                              <span>{tCart("remove")}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <SheetFooter className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{tCart("subtotal.label")}</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {cartCurrency} {cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {tCart("subtotal.help")}
                  </p>
                  <div className="mt-2 flex items-center flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearCart}
                      className="h-9 flex-1 rounded-full border-slate-200 bg-transparent text-[12px] text-slate-700 hover:bg-slate-50"
                      disabled={cartItems.length === 0}
                    >
                      {tCart("actions.clear")}
                    </Button>
                    <Button
                      type="button"
                      disabled={cartItems.length === 0}
                      className="h-9 flex-[1.4] rounded-full bg-emerald-500 text-[13px] font-semibold text-emerald-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                    >
                      {tCart("actions.checkout")}
                    </Button>
                  </div>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
