"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, Calendar, Users } from "lucide-react";
import { BuyerProfileFormData, BuyerProfileErrors } from "@/types/buyer-profile";

interface BuyerPersonalInfoProps {
  formData: BuyerProfileFormData;
  errors: BuyerProfileErrors;
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

export function BuyerPersonalInfo({
  formData,
  errors,
  onFieldChange,
}: BuyerPersonalInfoProps) {
  const t = useTranslations("dashboard.buyerProfile");

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t("sections.personal.title")}</h3>
          <p className="text-sm text-gray-500">{t("sections.personal.description")}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            {t("fields.username")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={onFieldChange}
            placeholder={t("fields.usernamePlaceholder")}
            className={`h-11 ${errors.username ? "border-destructive" : ""}`}
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username}</p>
          )}
        </div>

        {/* Email (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            {t("fields.email")}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onFieldChange}
            placeholder={t("fields.emailPlaceholder")}
            className="h-11 bg-gray-50"
            disabled
          />
          <p className="text-xs text-gray-400">{t("fields.emailHint")}</p>
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("fields.firstName")}</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onFieldChange}
            placeholder={t("fields.firstNamePlaceholder")}
            className={`h-11 ${errors.firstName ? "border-destructive" : ""}`}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("fields.lastName")}</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onFieldChange}
            placeholder={t("fields.lastNamePlaceholder")}
            className={`h-11 ${errors.lastName ? "border-destructive" : ""}`}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            {t("fields.phone")}
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onFieldChange}
            placeholder={t("fields.phonePlaceholder")}
            className={`h-11 ${errors.phone ? "border-destructive" : ""}`}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            {t("fields.dateOfBirth")}
          </Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={onFieldChange}
            className="h-11"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="gender" className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            {t("fields.gender")}
          </Label>
          <div className="flex flex-wrap gap-3">
            {["male", "female", "other", "prefer_not_to_say"].map((option) => (
              <label
                key={option}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200
                  ${
                    formData.gender === option
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={formData.gender === option}
                  onChange={onFieldChange}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                    ${formData.gender === option ? "border-primary" : "border-gray-300"}`}
                >
                  {formData.gender === option && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </span>
                <span className="text-sm font-medium">{t(`fields.genderOptions.${option}`)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <Label htmlFor="bio">{t("fields.bio")}</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={onFieldChange}
          placeholder={t("fields.bioPlaceholder")}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-400 text-right">
          {formData.bio.length}/500 {t("fields.characters")}
        </p>
      </div>
    </div>
  );
}
