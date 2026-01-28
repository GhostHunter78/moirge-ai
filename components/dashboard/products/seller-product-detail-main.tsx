"use client";

import { useEffect, useState } from "react";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Product, ProductStatus } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Star,
  Package,
  TrendingUp,
  DollarSign,
  Edit,
  Eye,
} from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { updateProductAction } from "@/actions/products";
import { toast } from "sonner";
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
        cfg.className,
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

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formStatus, setFormStatus] = useState<ProductStatus>("draft");
  const [formDescription, setFormDescription] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // Initialize form when opening edit dialog
  const handleOpenEditDialog = () => {
    if (!product) return;
    setFormTitle(product.title);
    setFormPrice(product.price.toString());
    setFormCategory(product.category ?? "");
    setFormStock(product.stock.toString());
    setFormStatus(product.status);
    setFormDescription(product.description ?? "");
    setFormFeatured(product.featured);
    setImagePreview(product.thumbnail_url);
    setImageFiles([]);
    setIsEditDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles(files);

    if (!files.length) {
      setImagePreview(product?.thumbnail_url ?? null);
      return;
    }

    const first = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(first);
  };

  const handleUpdateProduct = async () => {
    if (!product) return;

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
      const supabase = createClient();
      let thumbnailUrlToUse: string | undefined =
        product.thumbnail_url ?? undefined;
      let galleryUrls: string[] | undefined;

      // Upload new images if provided
      if (imageFiles.length > 0 && product.seller_id) {
        const uploads = await Promise.all(
          imageFiles.map(async (file) => {
            const extension = file.name.split(".").pop() || "jpg";
            const fileName = `${crypto.randomUUID()}.${extension}`;
            const filePath = `${product.seller_id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(filePath, file, {
                upsert: false, // Don't overwrite, use unique filename
              });

            if (uploadError) {
              throw uploadError;
            }

            const { data: publicUrlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(filePath);

            return publicUrlData.publicUrl;
          }),
        );

        const existingGallery = product.image_urls ?? [];
        galleryUrls = [...existingGallery, ...uploads];

        // If there was no thumbnail before, use the first gallery image as thumbnail
        if (!thumbnailUrlToUse) {
          thumbnailUrlToUse = galleryUrls[0];
        }
      }

      const updatePayload: Parameters<typeof updateProductAction>[1] = {
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        price: numericPrice,
        category: formCategory.trim() || undefined,
        stock: numericStock,
        status: formStatus,
        featured: formFeatured,
      };

      // Only include thumbnail_url if it's being changed
      if (
        thumbnailUrlToUse !== undefined &&
        thumbnailUrlToUse !== product.thumbnail_url
      ) {
        updatePayload.thumbnail_url = thumbnailUrlToUse;
      }

      if (galleryUrls) {
        updatePayload.image_urls = galleryUrls;
      }

      const { data: updatedProduct, error: updateError } =
        await updateProductAction(product.id, updatePayload);

      if (updateError || !updatedProduct) {
        console.error("Error updating product", updateError);
        toast.error(
          (updateError as { message?: string } | null)?.message ||
            "Could not update product. Please try again.",
        );
        setIsSaving(false);
        return;
      }

      setProduct(updatedProduct);
      toast.success("Product updated successfully.");
      setIsEditDialogOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const fallbackImage =
    product?.thumbnail_url ?? "/images/hero-section-girl-asset.png";

  const galleryImages =
    product?.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : [fallbackImage];

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
              {/* Image Section with gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 shadow-sm">
                  <Image
                    src={galleryImages[selectedImageIndex] ?? fallbackImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {galleryImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {galleryImages.map((img, index) => (
                      <button
                        key={img + index}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all",
                          selectedImageIndex === index
                            ? "border-emerald-500 ring-2 ring-emerald-500/40"
                            : "border-slate-200 hover:border-slate-300",
                        )}
                      >
                        <Image
                          src={img}
                          alt={`${product.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
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
                    onClick={handleOpenEditDialog}
                  >
                    <Edit className="mr-2 h-3.5 w-3.5" />
                    Edit product
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

          {/* Edit Product Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit product</DialogTitle>
                <DialogDescription>
                  Update product details. Changes will be saved immediately.
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
                      onValueChange={(v) => setFormStatus(v as ProductStatus)}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="out_of_stock">
                          Out of stock
                        </SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Product photos
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
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
                        {imageFiles.length
                          ? "Selected images will be added to this product’s gallery. The first one may be used as the thumbnail."
                          : "Current primary product image."}
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

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="featured"
                    className="text-xs font-medium text-slate-700"
                  >
                    Mark as featured product
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="rounded-full bg-emerald-500 text-xs font-medium text-emerald-950 hover:bg-emerald-400"
                  onClick={handleUpdateProduct}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
