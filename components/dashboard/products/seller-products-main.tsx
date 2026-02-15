"use client";

import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getSellerProducts, type Product } from "@/lib/products";
import type { ProductStatus } from "@/lib/products";
import { createProductAction } from "@/actions/products";
import { createClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { SellerProductsHero } from "./seller-products-hero";
import { SellerProductsMetrics } from "./seller-products-metrics";
import { SellerProductsFilters } from "./seller-products-filters";
import { SellerProductsFeaturedCard } from "./seller-products-featured-card";
import { SellerProductsTable } from "./seller-products-table";
import {
  CreateProductDialog,
  type CreateProductFormState,
} from "./create-product-dialog";
import {
  createProductSchema,
  flattenProductErrors,
} from "@/lib/validation/product";

const initialFormState: CreateProductFormState = {
  title: "",
  price: "",
  salePrice: "",
  category: "",
  stock: "",
  status: "draft",
  description: "",
};

export default function SellerProductsMain() {
  const tErrors = useTranslations("dashboard.sellerProducts.errors");
  const tToast = useTranslations("dashboard.sellerProducts.toast");

  const { userInfo } = useUserProfile();
  const supabase = useMemo(() => createClient(), []);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<CreateProductFormState>(initialFormState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProducts = async () => {
      if (!userInfo?.id) return;
      setIsLoading(true);
      const { data, error } = await getSellerProducts(userInfo.id);
      if (error) {
        console.error("Error loading products", error);
        toast.error(tErrors("loadFailed"));
      } else if (data) {
        setProducts(data);
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    };

    loadProducts();
  }, [userInfo, tErrors]);

  const categories = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.category)
        .filter((c): c is string => !!c && c.trim().length > 0),
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
    (p) => p.status === "out_of_stock",
  ).length;
  const totalDrafts = products.filter((p) => p.status === "draft").length;
  const featured = products.find((p) => p.featured);

  const onFormChange = <K extends keyof CreateProductFormState>(
    field: K,
    value: CreateProductFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (
      field === "title" ||
      field === "price" ||
      field === "description"
    ) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) {
      setImageFiles([]);
      setImagePreviews([]);
    } else {
      setImageFiles(files);
      Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            }),
        ),
      ).then(setImagePreviews);
    }
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });
  };

  const handleCreateProduct = async () => {
    if (!userInfo?.id) {
      toast.error(tErrors("signInRequired"));
      return;
    }

    const schema = createProductSchema(tErrors);
    const parsed = schema.safeParse({
      title: form.title,
      price: form.price,
      description: form.description,
    });

    const errors: Record<string, string> = {};
    if (!parsed.success) {
      Object.assign(errors, flattenProductErrors(parsed.error));
    }
    if (imageFiles.length === 0) {
      errors.image = tErrors("imageRequired");
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const numericPrice = Number(form.price);
    const numericStock = form.stock.trim().length ? Number(form.stock) : 0;
    if (Number.isNaN(numericStock) || numericStock < 0) {
      toast.error(tErrors("invalidStock"));
      return;
    }
    const salePriceTrimmed = form.salePrice.trim();
    const numericSalePrice = salePriceTrimmed.length
      ? Number(salePriceTrimmed)
      : null;
    if (
      salePriceTrimmed.length > 0 &&
      (Number.isNaN(numericSalePrice) || numericSalePrice! < 0)
    ) {
      toast.error(tErrors("invalidPrice"));
      return;
    }

    setIsSaving(true);
    try {
      let thumbnailUrlToUse: string | undefined;
      let galleryUrls: string[] | undefined;

      if (imageFiles.length > 0 && userInfo?.id) {
        const uploads = await Promise.all(
          imageFiles.map(async (file) => {
            const extension = file.name.split(".").pop() || "jpg";
            const fileName = `${crypto.randomUUID()}.${extension}`;
            const filePath = `${userInfo.id}/${fileName}`;
            const { error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: publicUrlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(filePath);
            return publicUrlData.publicUrl;
          }),
        );
        galleryUrls = uploads;
        thumbnailUrlToUse = uploads[0];
      }

      const { data, error } = await createProductAction({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        price: numericPrice,
        sale_price:
          numericSalePrice !== null && numericSalePrice >= 0
            ? numericSalePrice
            : null,
        category: form.category.trim() || undefined,
        stock: numericStock,
        status: form.status,
        thumbnail_url: thumbnailUrlToUse,
        image_urls: galleryUrls,
      });

      if (error || !data) {
        console.error("Error creating product", error);
        toast.error(
          (error as { message?: string } | null)?.message ??
            tErrors("createFailed"),
        );
        return;
      }

      setProducts((prev) => [data, ...prev]);
      toast.success(tToast("createSuccess"));
      setIsDialogOpen(false);
      setForm(initialFormState);
      setImageFiles([]);
      setImagePreviews([]);
      setFieldErrors({});
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SellerProductsHero onNewProduct={() => setIsDialogOpen(true)} />

      <SellerProductsMetrics
        totalActive={totalActive}
        totalOutOfStock={totalOutOfStock}
        totalDrafts={totalDrafts}
      />

      <Card className="border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <SellerProductsFilters
          query={query}
          onQueryChange={setQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={categories}
        />

        <Separator className="bg-slate-100" />

        <div className="grid gap-4 px-4 pb-4 pt-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          {featured && <SellerProductsFeaturedCard product={featured} />}
          <SellerProductsTable
            products={filteredProducts}
            isLoading={isLoading}
          />
        </div>
      </Card>

      <CreateProductDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setFieldErrors({});
        }}
        form={form}
        onFormChange={onFormChange}
        imagePreviews={imagePreviews}
        onImageChange={handleImageChange}
        isSaving={isSaving}
        onSubmit={handleCreateProduct}
        onCancel={() => {
          setIsDialogOpen(false);
          setFieldErrors({});
        }}
        fieldErrors={fieldErrors}
      />
    </div>
  );
}
