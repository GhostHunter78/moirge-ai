"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { StoreProfileFormData } from "@/types/dashboard";

interface StoreAddressProps {
  formData: StoreProfileFormData;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StoreAddress({
  formData,
  onFieldChange,
}: StoreAddressProps) {
  const t = useTranslations("dashboard.storeProfile");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t("sections.address.title")}
        </CardTitle>
        <CardDescription>
          {t("sections.address.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">{t("fields.address")}</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={onFieldChange}
            placeholder={t("fields.addressPlaceholder")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">{t("fields.city")}</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={onFieldChange}
              placeholder={t("fields.cityPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">{t("fields.state")}</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={onFieldChange}
              placeholder={t("fields.statePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">{t("fields.zipCode")}</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={onFieldChange}
              placeholder={t("fields.zipCodePlaceholder")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">{t("fields.country")}</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={onFieldChange}
            placeholder={t("fields.countryPlaceholder")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
