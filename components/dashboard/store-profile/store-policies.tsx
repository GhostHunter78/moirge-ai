"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { StoreProfileFormData } from "@/types/dashboard";

interface StorePoliciesProps {
  formData: StoreProfileFormData;
  onFieldChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function StorePolicies({
  formData,
  onFieldChange,
}: StorePoliciesProps) {
  const t = useTranslations("dashboard.storeProfile");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sections.policies.title")}</CardTitle>
        <CardDescription>
          {t("sections.policies.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="returnPolicy">{t("fields.returnPolicy")}</Label>
          <Textarea
            id="returnPolicy"
            name="returnPolicy"
            value={formData.returnPolicy}
            onChange={onFieldChange}
            placeholder={t("fields.returnPolicyPlaceholder")}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shippingPolicy">{t("fields.shippingPolicy")}</Label>
          <Textarea
            id="shippingPolicy"
            name="shippingPolicy"
            value={formData.shippingPolicy}
            onChange={onFieldChange}
            placeholder={t("fields.shippingPolicyPlaceholder")}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacyPolicy">{t("fields.privacyPolicy")}</Label>
          <Textarea
            id="privacyPolicy"
            name="privacyPolicy"
            value={formData.privacyPolicy}
            onChange={onFieldChange}
            placeholder={t("fields.privacyPolicyPlaceholder")}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
