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
import { Phone, Mail } from "lucide-react";
import { StoreProfileFormData } from "@/types/dashboard";

interface StoreContactInfoProps {
  formData: StoreProfileFormData;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StoreContactInfo({
  formData,
  onFieldChange,
}: StoreContactInfoProps) {
  const t = useTranslations("dashboard.storeProfile");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          {t("sections.contactInfo.title")}
        </CardTitle>
        <CardDescription>
          {t("sections.contactInfo.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="w-4 h-4 inline mr-2" />
              {t("fields.phone")}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={onFieldChange}
              placeholder={t("fields.phonePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="w-4 h-4 inline mr-2" />
              {t("fields.email")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onFieldChange}
              placeholder={t("fields.emailPlaceholder")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
