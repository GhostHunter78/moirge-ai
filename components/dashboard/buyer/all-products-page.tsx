"use client";

import { useMemo, useState } from "react";
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

type MockProduct = {
  id: number;
  name: string;
  price: number;
  currency: string;
  category: string;
  color?: string;
  sellerName: string;
  sellerId: string;
  image: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isFeatured?: boolean;
};

const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 1,
    name: "Minimalist Desk Lamp",
    price: 45,
    currency: "$",
    category: "Home Office",
    color: "Matte Black",
    sellerName: "Lumen Studio",
    sellerId: "seller_1",
    image:
      "https://images.unsplash.com/photo-1507473888900-52a11b750125?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 124,
    isFeatured: true,
  },
  {
    id: 2,
    name: "Wireless Noise Cancelling Headphones",
    price: 299,
    currency: "$",
    category: "Electronics",
    color: "Space Gray",
    sellerName: "Soundscape Co.",
    sellerId: "seller_2",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 312,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 120,
    currency: "$",
    category: "Electronics",
    color: "White",
    sellerName: "Keycraft Studio",
    sellerId: "seller_3",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews: 210,
    isNew: true,
  },
  {
    id: 4,
    name: "Stoneware Coffee Mug Set",
    price: 32,
    currency: "$",
    category: "Kitchen & Dining",
    color: "Ocean Blue",
    sellerName: "Ceramic Stories",
    sellerId: "seller_4",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviews: 87,
  },
  {
    id: 5,
    name: "Textured Throw Blanket",
    price: 68,
    currency: "$",
    category: "Home Decor",
    color: "Soft Sand",
    sellerName: "Nord Studio",
    sellerId: "seller_5",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 6,
    name: "Ergonomic Office Chair",
    price: 189,
    currency: "$",
    category: "Home Office",
    color: "Charcoal",
    sellerName: "Studio Grid",
    sellerId: "seller_6",
    image:
      "https://images.unsplash.com/photo-1580480054278-3130a27c8c1a?w=600&auto=format&fit=crop&q=80",
    rating: 4.4,
    reviews: 64,
  },
  {
    id: 7,
    name: "Hand-Poured Soy Candle",
    price: 24,
    currency: "$",
    category: "Home Decor",
    color: "Cedar & Musk",
    sellerName: "Amber & Oak",
    sellerId: "seller_7",
    image:
      "https://images.unsplash.com/photo-1602874801007-65497f96fe4a?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 42,
    isNew: true,
  },
  {
    id: 8,
    name: "Reusable Glass Water Bottle",
    price: 28,
    currency: "$",
    category: "Lifestyle",
    color: "Frosted Mint",
    sellerName: "Everday Studio",
    sellerId: "seller_8",
    image:
      "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=600&auto=format&fit=crop&q=80",
    rating: 4.3,
    reviews: 98,
  },
  {
    id: 9,
    name: "Smart Table Lamp",
    price: 89,
    currency: "$",
    category: "Electronics",
    color: "Warm White",
    sellerName: "Glow & Co.",
    sellerId: "seller_9",
    image:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=600&auto=format&fit=crop&q=80",
    rating: 4.2,
    reviews: 51,
  },
];

type SortOption = "relevance" | "price_low_high" | "price_high_low" | "rating_high_low";

export default function AllProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const categories = useMemo(() => {
    const set = new Set(MOCK_PRODUCTS.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q)
      );
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
        result.sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
        );
        break;
      default:
        break;
    }

    return result;
  }, [search, category, sortBy]);

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
                {new Set(MOCK_PRODUCTS.map((p) => p.sellerId)).size}
              </span>{" "}
              sellers
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group relative flex flex-col overflow-hidden border-slate-200 bg-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute left-2 top-2 flex flex-col gap-1">
                    {product.isNew && (
                      <Badge className="h-6 rounded-full bg-emerald-500/90 px-2 text-[10px] font-semibold text-emerald-950">
                        New
                      </Badge>
                    )}
                    {product.isFeatured && (
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
                        {product.category}
                      </p>
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {product.name}
                      </h3>
                      <p className="truncate text-xs text-slate-500">
                        by <span className="font-medium text-slate-700">{product.sellerName}</span>
                      </p>
                      {product.color && (
                        <p className="truncate text-[11px] text-slate-500">
                          Color: <span className="text-slate-700">{product.color}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-900">
                        {product.currency}
                        {product.price.toFixed(2)}
                      </p>
                      {product.rating && (
                        <p className="text-[11px] text-slate-500">
                          {product.rating.toFixed(1)} · {product.reviews} reviews
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

