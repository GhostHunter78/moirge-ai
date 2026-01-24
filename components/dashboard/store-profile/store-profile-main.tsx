"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { StoreProfileFormData, StoreProfileErrors } from "@/types/dashboard";
import { getStoreProfile, saveStoreProfile, transformStoreProfileToFormData } from "@/lib/store-profile";
import { useUserProfile } from "@/hooks/use-user-profile";
import { StoreBasicInfo } from "./store-basic-info";
import { StoreContactInfo } from "./store-contact-info";
import { StoreAddress } from "./store-address";
import { StoreSocialMedia } from "./store-social-media";
import { StorePolicies } from "./store-policies";

function StoreProfileMain() {
  const t = useTranslations("dashboard.storeProfile");
  const { userInfo } = useUserProfile();

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
    tiktok: "",
    returnPolicy: "",
    shippingPolicy: "",
    privacyPolicy: "",
  });

  const [errors, setErrors] = useState<StoreProfileErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
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

  // Load existing store profile data on mount
  useEffect(() => {
    const loadStoreProfile = async () => {
      if (!userInfo?.id) return;

      setIsLoadingData(true);
      try {
        const { data, error } = await getStoreProfile(userInfo.id);
        
        if (error) {
          console.error("Error loading store profile:", error);
          // PGRST116 means no rows found, which is expected for new users
          // Other errors should be shown to the user
          if (error.code !== "PGRST116") {
            toast.error(
              error.message || 
              t("errors.loadFailed") || 
              "Failed to load store profile. Please try refreshing the page."
            );
          }
          
          // If no store profile exists, prefill email and phone from user profile
          if (error.code === "PGRST116" && userInfo) {
            setFormData((prev) => ({
              ...prev,
              email: userInfo.email || "",
              phone: userInfo.phone || "",
            }));
          }
        } else if (data) {
          const formDataFromDb = transformStoreProfileToFormData(data);
          
          // Prefill email and phone from user profile if store profile fields are empty
          const prefilledData = {
            ...formDataFromDb,
            email: (formDataFromDb.email?.trim() || "") 
              ? formDataFromDb.email 
              : (userInfo?.email || ""),
            phone: (formDataFromDb.phone?.trim() || "") 
              ? formDataFromDb.phone 
              : (userInfo?.phone || ""),
          };
          
          setFormData(prefilledData);
          
          // Set logo preview if logo exists
          if (prefilledData.storeLogo) {
            setLogoPreview(prefilledData.storeLogo);
          }
        }
      } catch (error) {
        console.error("Error loading store profile:", error);
        toast.error(
          t("errors.loadFailed") || 
          "An unexpected error occurred while loading your store profile. Please try refreshing the page."
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    loadStoreProfile();
  }, [userInfo, t]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!userInfo?.id) {
      toast.error("User not authenticated");
      return;
    }

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

    try {
      const { error } = await saveStoreProfile(userInfo.id, formData);
      
      if (error) {
        console.error("Error saving store profile:", error);
        toast.error(error.message || t("errors.saveFailed") || "Failed to save store profile. Please try again.");
      } else {
        toast.success(t("messages.saveSuccess") || "Store profile saved successfully!");
      }
    } catch (error) {
      console.error("Error saving store profile:", error);
      toast.error(t("errors.unexpectedError") || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading store profile page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <StoreBasicInfo
          formData={formData}
          errors={errors}
          logoPreview={logoPreview}
          onFieldChange={handleChange}
          onLogoUpload={handleLogoUpload}
        />

        <StoreContactInfo
          formData={formData}
          onFieldChange={handleChange}
        />

        <StoreAddress
          formData={formData}
          onFieldChange={handleChange}
        />

        <StoreSocialMedia
          formData={formData}
          onFieldChange={handleChange}
        />

        <StorePolicies
          formData={formData}
          onFieldChange={handleChange}
        />

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
