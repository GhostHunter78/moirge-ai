"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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
import { Store, Upload, Save, MapPin, Phone, Mail, Globe, Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

interface StoreProfileFormData {
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  returnPolicy: string;
  shippingPolicy: string;
  privacyPolicy: string;
}

type StoreProfileErrors = Partial<Record<keyof StoreProfileFormData, string>>;

function StoreProfileMain() {
  const t = useTranslations("dashboard.storeProfile");

  const [formData, setFormData] = useState<StoreProfileFormData>({
    storeName: "",
    storeDescription: "",
    storeLogo: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    returnPolicy: "",
    shippingPolicy: "",
    privacyPolicy: "",
  });

  const [errors, setErrors] = useState<StoreProfileErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const clearFieldError = (field: keyof StoreProfileFormData) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const field = name as keyof StoreProfileFormData;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData((prev) => ({
          ...prev,
          storeLogo: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    const newErrors: StoreProfileErrors = {};
    
    if (!formData.storeName.trim()) {
      newErrors.storeName = t("errors.storeNameRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // TODO: Implement API call to save store profile
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Store profile data:", formData);
      // Show success message
    } catch (error) {
      console.error("Error saving store profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Basic Information */}
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
                    onChange={handleLogoUpload}
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
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder={t("fields.storeDescriptionPlaceholder")}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder={t("fields.emailPlaceholder")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Address */}
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
                onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder={t("fields.cityPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">{t("fields.state")}</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder={t("fields.statePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">{t("fields.zipCode")}</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
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
                onChange={handleChange}
                placeholder={t("fields.countryPlaceholder")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media & Website */}
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
                onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder={t("fields.socialPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">
                  <Twitter className="w-4 h-4 inline mr-2" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  name="twitter"
                  type="url"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder={t("fields.socialPlaceholder")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Policies */}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder={t("fields.privacyPolicyPlaceholder")}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {t("buttons.saving")}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t("buttons.saveChanges")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StoreProfileMain;
