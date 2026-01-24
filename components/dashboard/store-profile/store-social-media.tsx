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
import { Globe, Facebook, Instagram, Music2 } from "lucide-react";
import { StoreProfileFormData } from "@/types/dashboard";

interface StoreSocialMediaProps {
  formData: StoreProfileFormData;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StoreSocialMedia({
  formData,
  onFieldChange,
}: StoreSocialMediaProps) {
  const t = useTranslations("dashboard.storeProfile");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {t("sections.socialMedia.title")}
        </CardTitle>
        <CardDescription>
          {t("sections.socialMedia.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="website">
            <Globe className="w-4 h-4 inline mr-2" />
            {t("fields.website")}
          </Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={onFieldChange}
            placeholder={t("fields.websitePlaceholder")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">
              <Facebook className="w-4 h-4 inline mr-2" />
              Facebook
            </Label>
            <Input
              id="facebook"
              name="facebook"
              type="url"
              value={formData.facebook}
              onChange={onFieldChange}
              placeholder={t("fields.socialPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">
              <Instagram className="w-4 h-4 inline mr-2" />
              Instagram
            </Label>
            <Input
              id="instagram"
              name="instagram"
              type="url"
              value={formData.instagram}
              onChange={onFieldChange}
              placeholder={t("fields.socialPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiktok">
              <Music2 className="w-4 h-4 inline mr-2" />
              TikTok
            </Label>
            <Input
              id="tiktok"
              name="tiktok"
              type="url"
              value={formData.tiktok}
              onChange={onFieldChange}
              placeholder={t("fields.socialPlaceholder")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
