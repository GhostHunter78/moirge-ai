"use client";

import { useEffect, useMemo, useState } from "react";
import type React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getSellerProducts, Product } from "@/lib/products";
import { createProductAction } from "@/actions/products";
import { createClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  MoreHorizontal,
  Star,
  ChevronDown,
} from "lucide-react";

type ProductStatus = "active" | "draft" | "out_of_stock" | "archived";

function StatusPill({ status }: { status: ProductStatus }) {
  const map: Record<
    ProductStatus,
    { label: string; className: string; dotClass: string }
  > = {
    active: {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dotClass: "bg-emerald-500",
    },
    draft: {
      label: "Draft",
      className: "bg-slate-50 text-slate-700 border-slate-100",
      dotClass: "bg-slate-400",
    },
    out_of_stock: {
      label: "Out of stock",
      className: "bg-amber-50 text-amber-800 border-amber-100",
      dotClass: "bg-amber-500",
    },
    archived: {
      label: "Archived",
      className: "bg-rose-50 text-rose-700 border-rose-100",
      dotClass: "bg-rose-500",
    },
  };

  const cfg = map[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        cfg.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dotClass)} />
      {cfg.label}
    </span>
  );
}

function MetricCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "emerald" | "indigo" | "amber";
}) {
  const accentClasses: Record<
    typeof accent,
    { ring: string; chip: string; glow: string }
  > = {
    emerald: {
      ring: "ring-emerald-100",
      chip: "bg-emerald-600 text-emerald-50",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.25)]",
    },
    indigo: {
      ring: "ring-indigo-100",
      chip: "bg-indigo-600 text-indigo-50",
      glow: "shadow-[0_0_40px_rgba(79,70,229,0.25)]",
    },
    amber: {
      ring: "ring-amber-100",
      chip: "bg-amber-500 text-amber-50",
      glow: "shadow-[0_0_40px_rgba(245,158,11,0.25)]",
    },
  };

  const styles = accentClasses[accent];

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-none bg-linear-to-br from-white via-slate-50 to-slate-100/80 p-4 sm:p-5",
        "ring-1",
        styles.ring
      )}
    >
      <div className="absolute -top-10 -right-6 h-24 w-24 rounded-full bg-linear-to-br from-slate-200/60 to-slate-50/0 blur-2xl" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-slate-50 px-2 py-1 text-[10px] uppercase tracking-[0.16em]">
            <span className={cn("h-1.5 w-1.5 rounded-full", styles.chip)} />
            {label}
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              {value}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <div
          className={cn(
            "hidden sm:flex items-center justify-center rounded-full bg-white/80",
            "h-10 w-10 border border-slate-100 backdrop-blur-sm",
            styles.glow
          )}
        >
          <Star className="h-4 w-4 text-amber-400" />
        </div>
      </div>
    </Card>
  );
}

export default function SellerProductsMain() {
  const { userInfo } = useUserProfile();
  const supabase = useMemo(() => createClient(), []);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formStatus, setFormStatus] = useState<ProductStatus>("draft");
  const [formDescription, setFormDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (!userInfo?.id) return;
      setIsLoading(true);
      const { data, error } = await getSellerProducts(userInfo.id);
      if (error) {
        console.error("Error loading products", error);
        toast.error("Failed to load products. Please try again.");
      } else if (data) {
        setProducts(data);
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    };

    loadProducts();
  }, [userInfo]);

  const categories = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.category)
        .filter((c): c is string => !!c && c.trim().length > 0)
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        !query.trim() ||
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        (product.sku ?? "").toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [query, statusFilter, categoryFilter, products]);

  const totalActive = products.filter((p) => p.status === "active").length;
  const totalOutOfStock = products.filter(
    (p) => p.status === "out_of_stock"
  ).length;
  const totalDrafts = products.filter((p) => p.status === "draft").length;

  const featured = products.find((p) => p.featured);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (!file) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async () => {
    if (!userInfo?.id) {
      toast.error("You need to be signed in as a seller to add products.");
      return;
    }

    if (!formTitle.trim()) {
      toast.error("Please add a product title.");
      return;
    }

    const numericPrice = Number(formPrice);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      toast.error("Please provide a valid price.");
      return;
    }

    const numericStock = formStock.trim().length ? Number(formStock) : 0;
    if (Number.isNaN(numericStock) || numericStock < 0) {
      toast.error("Please provide a valid stock number.");
      return;
    }

    setIsSaving(true);

    try {
      let thumbnailUrlToUse: string | undefined;

      if (imageFile && userInfo?.id) {
        const extension = imageFile.name.split(".").pop() || "jpg";
        const fileName = `${crypto.randomUUID()}.${extension}`;
        const filePath = `${userInfo.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Error uploading product image", uploadError);
          toast.error("Could not upload product image. Please try again.");
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        thumbnailUrlToUse = publicUrlData.publicUrl;
      }

      const { data, error } = await createProductAction({
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        price: numericPrice,
        category: formCategory.trim() || undefined,
        stock: numericStock,
        status: formStatus,
        thumbnail_url: thumbnailUrlToUse,
      });

      if (error || !data) {
        console.error("Error creating product", error);
        toast.error(
          (error as { message?: string } | null)?.message ||
            "Could not create product. Please try again."
        );
        return;
      }

      setProducts((prev) => [data, ...prev]);
      toast.success("Product added to your catalog.");
      setIsDialogOpen(false);

      setFormTitle("");
      setFormPrice("");
      setFormCategory("");
      setFormStock("");
      setFormStatus("draft");
      setFormDescription("");
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top strip */}
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
              Seller workspace
            </p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
              Curate your product story.
            </h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-300">
              Design a collection that feels intentional. Control visibility,
              inventory, and presentation from a single, cinematic canvas.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Button
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs sm:text-sm font-medium text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              New product
            </Button>
            <button className="inline-flex items-center gap-1 text-[11px] text-slate-300/80 hover:text-slate-100 transition-colors">
              Or import from existing catalog
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Live products"
          value={String(totalActive)}
          hint="Visible in your storefront right now"
          accent="emerald"
        />
        <MetricCard
          label="Low / out of stock"
          value={String(totalOutOfStock)}
          hint="Items that need your attention"
          accent="amber"
        />
        <MetricCard
          label="Draft concepts"
          value={String(totalDrafts)}
          hint="Quietly in progress, not yet visible"
          accent="indigo"
        />
      </div>

      {/* Controls */}
      <Card className="border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col gap-3 px-4 pb-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or SKU"
                className="h-9 rounded-full border-slate-200 bg-slate-50/80 pl-9 text-xs focus-visible:ring-slate-200"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
                setStatusFilter(v as ProductStatus | "all")
              }
            >
              <SelectTrigger className="h-9 min-w-[130px] rounded-full border-slate-200 bg-slate-50/80 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out-of-stock">Out of stock</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v)}
            >
              <SelectTrigger className="h-9 min-w-[130px] rounded-full border-slate-200 bg-slate-50/80 text-xs">
                <SelectValue placeholder="Category" />
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
        </div>

        <Separator className="bg-slate-100" />

        {/* Layout: featured highlight + list */}
        <div className="grid gap-4 px-4 pb-4 pt-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          {featured && (
            <Card className="relative overflow-hidden border-none bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50">
              <div className="absolute inset-0 opacity-[0.65] mix-blend-screen">
                <div className="absolute left-[-30%] top-[-10%] h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.35),transparent_60%)] blur-2xl" />
                <div className="absolute right-[-10%] bottom-[-20%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.4),transparent_60%)] blur-2xl" />
              </div>

              <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-stretch sm:p-5">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 sm:w-40">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0,rgba(248,250,252,0.14),transparent_55%)]" />
                  <Image
                    src={featured.thumbnail_url ?? "/images/hero-section-girl-asset.png"}
                    alt={featured.title}
                    fill
                    className="object-contain object-center mix-blend-screen"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Featured hero product
                    </div>
                    <h2 className="mt-2 text-sm sm:text-base font-semibold tracking-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-1 text-[11px] text-slate-300/90">
                      Ideal for campaigns, lookbooks and hero sections. Adjust
                      photography and copy to tell the right story.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-200/80">
                    <div>
                      <p className="text-slate-400">Price</p>
                      <p className="font-medium">
                        {featured.currency} {featured.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Sold</p>
                      <p className="font-medium">{featured.sold_count}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Rating</p>
                      <p className="inline-flex items-center gap-1 font-medium">
                        <Star className="h-3 w-3 text-amber-300" />
                        {featured.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button className="h-8 rounded-full bg-slate-50 px-3 text-xs font-medium text-slate-900 hover:bg-slate-100">
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit product details
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 rounded-full border-slate-600 bg-transparent px-3 text-[11px] text-slate-200 hover:bg-slate-800 hover:text-slate-50"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View in storefront
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="border-slate-200/80 bg-slate-50/80">
            <ScrollArea className="h-[320px]">
              <table className="min-w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-100/80 text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    <th className="px-3 py-2.5 text-left font-medium">Product</th>
                    <th className="hidden px-3 py-2.5 text-left font-medium sm:table-cell">
                      Inventory
                    </th>
                    <th className="hidden px-3 py-2.5 text-left font-medium md:table-cell">
                      Performance
                    </th>
                    <th className="px-3 py-2.5 text-right font-medium">
                      Price
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
                        Loading your products...
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100/80 bg-white/80 last:border-0 hover:bg-slate-50/80"
                    >
                      <td className="max-w-[220px] px-3 py-2.5 align-top">
                        <div className="flex gap-2">
                          <div className="relative mt-0.5 h-9 w-9 overflow-hidden rounded-md border border-slate-100 bg-slate-50">
                            <Image
                              src={product.thumbnail_url ?? "/images/hero-section-girl-asset.png"}
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
                                  Hero
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
                            <StatusPill status={product.status} />
                          </div>
                        </div>
                      </td>

                      <td className="hidden px-3 py-2.5 align-middle text-[11px] text-slate-600 sm:table-cell">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {product.stock} in stock
                          </p>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={cn(
                                "h-full rounded-full bg-emerald-500",
                                product.stock === 0 && "bg-rose-500",
                                product.stock > 0 &&
                                  product.stock < 15 &&
                                  "bg-amber-500"
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
                              ? "Restock recommended"
                              : product.stock < 15
                              ? "Running low · plan restock"
                              : "Healthy inventory"}
                          </p>
                        </div>
                      </td>

                      <td className="hidden px-3 py-2.5 align-middle text-[11px] text-slate-600 md:table-cell">
                        <div className="space-y-1">
                          <p className="font-medium">{product.sold_count} sold</p>
                          {product.rating > 0 ? (
                            <p className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                              <Star className="h-3 w-3 text-amber-400" />
                              {product.rating.toFixed(1)} average rating
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-400">
                              Not rated yet
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-2.5 align-middle text-right text-[11px] font-medium text-slate-900">
                        {product.currency} {product.price}
                      </td>

                      <td className="px-2 py-2.5 align-middle">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye className="h-3.5 w-3.5" />
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

                  {!isLoading && filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-10 text-center text-xs text-slate-400"
                      >
                        No products match this view yet. Adjust filters or add a
                        new item to your collection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </Card>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create product</DialogTitle>
            <DialogDescription>
              Add a new item to your catalog. You can refine details later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Title
              </label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Midnight Nylon Bomber Jacket"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Price
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="129.00"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Stock
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  placeholder="34"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Category
                </label>
                <Input
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="Outerwear, Footwear, Accessories..."
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Status
                </label>
                <Select
                  value={formStatus}
                  onValueChange={(v) =>
                    setFormStatus(v as ProductStatus)
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="out_of_stock">Out of stock</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Product image
              </label>
              <Input
                type="file"
                accept="image/*"
                className="h-9 text-xs cursor-pointer"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="relative h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    This image will be used as the thumbnail in your catalog.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Description
              </label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Tell the story of this piece—materials, fit, styling suggestions..."
                className="min-h-[80px] text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-emerald-500 text-xs font-medium text-emerald-950 hover:bg-emerald-400"
              onClick={handleCreateProduct}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Create product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

