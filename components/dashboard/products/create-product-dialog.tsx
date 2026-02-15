"use client";

import type React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ProductStatus } from "@/lib/products";

export type CreateProductFormState = {
  title: string;
  price: string;
  salePrice: string;
  category: string;
  stock: string;
  status: ProductStatus;
  description: string;
};

export function CreateProductDialog({
  open,
  onOpenChange,
  form,
  onFormChange,
  imagePreviews,
  onImageChange,
  isSaving,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CreateProductFormState;
  onFormChange: <K extends keyof CreateProductFormState>(
    field: K,
    value: CreateProductFormState[K],
  ) => void;
  imagePreviews: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("dashboard.sellerProducts.createDialog");
  const tStatus = useTranslations("dashboard.sellerProducts.status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              {t("titleLabel")}
            </label>
            <Input
              value={form.title}
              onChange={(e) => onFormChange("title", e.target.value)}
              placeholder={t("titlePlaceholder")}
              className="h-9 text-xs"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                {t("priceLabel")}
              </label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => onFormChange("price", e.target.value)}
                placeholder={t("pricePlaceholder")}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                {t("salePriceLabel")}
              </label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.salePrice}
                onChange={(e) => onFormChange("salePrice", e.target.value)}
                placeholder={t("salePricePlaceholder")}
                className="h-9 text-xs"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                {t("stockLabel")}
              </label>
              <Input
                type="number"
                min={0}
                step={1}
                value={form.stock}
                onChange={(e) => onFormChange("stock", e.target.value)}
                placeholder={t("stockPlaceholder")}
                className="h-9 text-xs"
              />
            </div>
            <div className="hidden sm:block" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                {t("categoryLabel")}
              </label>
              <Input
                value={form.category}
                onChange={(e) => onFormChange("category", e.target.value)}
                placeholder={t("categoryPlaceholder")}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                {t("statusLabel")}
              </label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  onFormChange("status", v as ProductStatus)
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{tStatus("draft")}</SelectItem>
                  <SelectItem value="active">{tStatus("active")}</SelectItem>
                  <SelectItem value="out_of_stock">
                    {tStatus("outOfStock")}
                  </SelectItem>
                  <SelectItem value="archived">
                    {tStatus("archived")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              {t("photosLabel")}
            </label>
            <Input
              type="file"
              accept="image/*"
              multiple
              className="h-9 text-xs cursor-pointer"
              onChange={onImageChange}
            />
            {imagePreviews.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="relative h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">{t("photosHint")}</p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              {t("descriptionLabel")}
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => onFormChange("description", e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              className="min-h-[80px] text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={onCancel}
            disabled={isSaving}
          >
            {t("cancel")}
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-emerald-500 text-xs font-medium text-emerald-950 hover:bg-emerald-400"
            onClick={onSubmit}
            disabled={isSaving}
          >
            {isSaving ? t("saving") : t("create")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
