"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Store, Upload } from "lucide-react";
import Image from "next/image";
import { StoreProfileFormData, StoreProfileErrors } from "@/types/dashboard";

interface StoreBasicInfoProps {
  formData: StoreProfileFormData;
  errors: StoreProfileErrors;
  logoPreview: string | null;
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StoreBasicInfo({
  formData,
  errors,
  logoPreview,
  onFieldChange,
  onLogoUpload,
}: StoreBasicInfoProps) {
  const t = useTranslations("dashboard.storeProfile");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          {t("sections.basicInfo.title")}
        </CardTitle>
        <CardDescription>
          {t("sections.basicInfo.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Store Logo */}
        <div className="space-y-2">
          <Label htmlFor="storeLogo">{t("fields.storeLogo")}</Label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Store logo"
                  fill
                  className="object-cover"
                />
              ) : (
                <Store className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="logo-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {t("buttons.uploadLogo")}
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={onLogoUpload}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {t("fields.logoHint")}
              </p>
            </div>
          </div>
        </div>

        {/* Store Name */}
        <div className="space-y-2">
          <Label htmlFor="storeName">
            {t("fields.storeName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={onFieldChange}
            placeholder={t("fields.storeNamePlaceholder")}
            className={errors.storeName ? "border-destructive" : ""}
          />
          {errors.storeName && (
            <p className="text-sm text-destructive">{errors.storeName}</p>
          )}
        </div>

        {/* Store Description */}
        <div className="space-y-2">
          <Label htmlFor="storeDescription">
            {t("fields.storeDescription")}
          </Label>
          <Textarea
            id="storeDescription"
            name="storeDescription"
            value={formData.storeDescription}
            onChange={onFieldChange}
            placeholder={t("fields.storeDescriptionPlaceholder")}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
