"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";

const baseCompleteProfileSchema = z.object({
  username: z.string().min(1, "usernameRequired"),
  phone: z.string().min(1, "phoneRequired"),
  role: z.enum(["buyer", "seller"], {
    error: "roleRequired",
  }),
});

export type CompleteProfileFormValues = z.infer<
  typeof baseCompleteProfileSchema
>;

type CompleteProfileErrors = Partial<
  Record<keyof CompleteProfileFormValues, string>
>;

export default function CompleteProfileForm({
  handleCompleteProfile,
  error,
}: {
  error: string;
  handleCompleteProfile: (
    values: CompleteProfileFormValues
  ) => Promise<void> | void;
}) {
  const t = useTranslations("completeProfile.form");

  const completeProfileSchema = baseCompleteProfileSchema;

  const [formData, setFormData] = useState<CompleteProfileFormValues>({
    username: "",
    role: "buyer",
    phone: "",
  });
  const [errors, setErrors] = useState<CompleteProfileErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const getFieldStyles = (hasError?: string) =>
    `h-12 rounded-2xl border ${
      hasError ? "border-destructive" : "border-emerald-100"
    } bg-white/80 px-4 shadow-inner shadow-emerald-50 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200`;

  const clearFieldError = (field: keyof CompleteProfileFormValues) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = name as keyof CompleteProfileFormValues;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
    if (errors.phone) {
      clearFieldError("phone");
    }
  };

  const handleRoleChange = (value: "buyer" | "seller") => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
    if (errors.role) {
      clearFieldError("role");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const result = completeProfileSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const formattedErrors = Object.entries(
        fieldErrors
      ).reduce<CompleteProfileErrors>((acc, [key, messages]) => {
        if (messages && messages.length > 0) {
          const code = messages[0];
          acc[key as keyof CompleteProfileFormValues] = t(
            `errors.${code as string}`
          );
        }
        return acc;
      }, {});

      setErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    try {
      await handleCompleteProfile(result.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-100 bg-linear-to-b from-white via-white to-emerald-50/80 shadow-2xl shadow-emerald-200/60 backdrop-blur">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-2 h-40 rounded-full bg-linear-to-r from-emerald-300/60 via-teal-300/50 to-cyan-200/60 blur-3xl"
      />

      <CardHeader className="relative z-10 space-y-3 text-center">
        <CardTitle className="text-3xl font-bold text-slate-900">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 pt-1">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              {t("fields.usernameLabel")}
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={t("fields.usernamePlaceholder")}
              value={formData.username}
              onChange={handleChange}
              className={getFieldStyles(errors.username)}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              {t("fields.phoneLabel")}
            </Label>
            <div className="phone-input-wrapper">
              <PhoneInput
                country={"us"}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputClass={getFieldStyles(errors.phone)}
                disabled={isLoading}
                containerClass="phone-input-container"
                buttonClass="phone-input-button"
                inputProps={{
                  name: "phone",
                  id: "phone",
                }}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              {t("role.label")}
            </Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
              disabled={isLoading}
            >
              <SelectTrigger className={getFieldStyles(errors.role)}>
                <SelectValue placeholder={t("role.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">{t("role.buyer")}</SelectItem>
                <SelectItem value="seller">{t("role.seller")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? t("buttons.submitting") : t("buttons.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
