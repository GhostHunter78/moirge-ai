"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/use-user-profile";
import { BuyerProfileFormData, BuyerProfileErrors, BuyerAddress, BuyerPreferences } from "@/types/buyer-profile";
import { BuyerProfileHeader } from "./buyer-profile-header";
import { BuyerPersonalInfo } from "./buyer-profile-personal-info";
import { BuyerSecuritySettings } from "./buyer-profile-security";
import { BuyerAddresses } from "./buyer-profile-addresses";
import { BuyerPreferencesSection } from "./buyer-profile-preferences";

function BuyerProfileMain() {
  const t = useTranslations("dashboard.buyerProfile");
  const { userInfo } = useUserProfile();

  const [formData, setFormData] = useState<BuyerProfileFormData>({
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    bio: "",
    avatar: "",
    dateOfBirth: "",
    gender: "",
  });

  const [addresses, setAddresses] = useState<BuyerAddress[]>([
    {
      id: "1",
      label: "Home",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: true,
    },
  ]);

  const [preferences, setPreferences] = useState<BuyerPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    darkMode: false,
    language: "en",
    currency: "USD",
  });

  const [errors, setErrors] = useState<BuyerProfileErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"personal" | "security" | "addresses" | "preferences">("personal");

  // Load user profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!userInfo?.id) return;

      setIsLoadingData(true);
      try {
        // Set form data from user profile
        setFormData((prev) => ({
          ...prev,
          username: userInfo.username || "",
          email: userInfo.email || "",
          phone: userInfo.phone || "",
        }));
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error(t("errors.loadFailed"));
      } finally {
        setIsLoadingData(false);
      }
    };

    loadProfile();
  }, [userInfo, t]);

  const clearFieldError = (field: keyof BuyerProfileFormData) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = name as keyof BuyerProfileFormData;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData((prev) => ({
          ...prev,
          avatar: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreferenceChange = (key: keyof BuyerPreferences, value: boolean | string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInfo?.id) {
      toast.error(t("errors.notAuthenticated"));
      return;
    }

    setIsLoading(true);

    // Basic validation
    const newErrors: BuyerProfileErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t("errors.usernameRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulating API call - you would replace this with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("messages.saveSuccess"));
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(t("errors.saveFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Profile Header with Avatar and Stats */}
      <BuyerProfileHeader
        formData={formData}
        avatarPreview={avatarPreview}
        onAvatarUpload={handleAvatarUpload}
        userInfo={userInfo}
      />

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
          {[
            { key: "personal", label: t("tabs.personal") },
            { key: "security", label: t("tabs.security") },
            { key: "addresses", label: t("tabs.addresses") },
            { key: "preferences", label: t("tabs.preferences") },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium transition-all duration-200 relative
                ${
                  activeTab === tab.key
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "personal" && (
            <form onSubmit={handleSubmit}>
              <BuyerPersonalInfo
                formData={formData}
                errors={errors}
                onFieldChange={handleChange}
              />

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
          )}

          {activeTab === "security" && <BuyerSecuritySettings />}

          {activeTab === "addresses" && (
            <BuyerAddresses addresses={addresses} setAddresses={setAddresses} />
          )}

          {activeTab === "preferences" && (
            <BuyerPreferencesSection
              preferences={preferences}
              onPreferenceChange={handlePreferenceChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default BuyerProfileMain;
