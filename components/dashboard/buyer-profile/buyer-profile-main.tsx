"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/use-user-profile";
import {
  BuyerProfileFormData,
  BuyerProfileErrors,
  BuyerAddressFormData,
  BuyerPreferences,
  BuyerStats,
} from "@/types/buyer-profile";
import {
  getBuyerProfile,
  saveBuyerProfile,
  saveBuyerPreferences,
  updateBuyerAvatar,
  updateUserProfile,
  getBuyerAddresses,
  getBuyerStats,
  transformBuyerProfileToFormData,
  transformBuyerProfileToPreferences,
  transformAddressesToFormData,
} from "@/lib/buyer-profile";
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

  const [addresses, setAddresses] = useState<BuyerAddressFormData[]>([]);
  const [stats, setStats] = useState<BuyerStats>({
    totalOrders: 0,
    wishlistItems: 0,
    reviewsGiven: 0,
    addressCount: 0,
  });

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
  const [activeTab, setActiveTab] = useState<
    "personal" | "security" | "addresses" | "preferences"
  >("personal");

  // Load all profile data on mount
  const loadProfileData = useCallback(async () => {
    if (!userInfo?.id) return;

    setIsLoadingData(true);
    try {
      // Load buyer profile, addresses, and stats in parallel
      const [profileResult, addressesResult, statsResult] = await Promise.all([
        getBuyerProfile(userInfo.id),
        getBuyerAddresses(userInfo.id),
        getBuyerStats(userInfo.id),
      ]);

      // Handle profile data
      if (profileResult.error) {
        console.error("Error loading profile:", profileResult.error);
      }

      // Transform and set form data
      const transformedFormData = transformBuyerProfileToFormData(
        profileResult.data,
        {
          username: userInfo.username || "",
          email: userInfo.email || "",
          phone: userInfo.phone || "",
        },
      );
      setFormData(transformedFormData);

      // Set avatar preview if exists
      if (transformedFormData.avatar) {
        setAvatarPreview(transformedFormData.avatar);
      }

      // Transform and set preferences
      const transformedPreferences = transformBuyerProfileToPreferences(
        profileResult.data,
      );
      setPreferences(transformedPreferences);

      // Handle addresses
      if (addressesResult.error) {
        console.error("Error loading addresses:", addressesResult.error);
      } else {
        const transformedAddresses = transformAddressesToFormData(
          addressesResult.data,
        );
        setAddresses(transformedAddresses);
      }

      // Set stats
      setStats(statsResult);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error(t("errors.loadFailed"));
    } finally {
      setIsLoadingData(false);
    }
  }, [userInfo, t]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const clearFieldError = (field: keyof BuyerProfileFormData) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const field = name as keyof BuyerProfileFormData;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (
      errors &&
      typeof errors === "object" &&
      errors[field as keyof BuyerProfileErrors]
    ) {
      clearFieldError(field);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userInfo?.id) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData((prev) => ({
          ...prev,
          avatar: result,
        }));

        // Save avatar to database immediately
        const { error } = await updateBuyerAvatar(userInfo.id, result);
        if (error) {
          console.error("Error saving avatar:", error);
          toast.error(t("errors.saveFailed"));
        } else {
          toast.success(t("messages.saveSuccess"));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreferenceChange = async (
    key: keyof BuyerPreferences,
    value: boolean | string,
  ) => {
    const newPreferences = {
      ...preferences,
      [key]: value,
    };
    setPreferences(newPreferences);

    // Save preferences to database
    if (userInfo?.id) {
      const { error } = await saveBuyerPreferences(userInfo.id, newPreferences);
      if (error) {
        console.error("Error saving preferences:", error);
        // Revert on error
        setPreferences(preferences);
        toast.error(t("errors.saveFailed"));
      }
    }
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
      // Update username and phone in the main profiles table
      // This ensures changes are reflected across the entire platform
      const { error: profileError } = await updateUserProfile(userInfo.id, {
        username: formData.username,
        phone: formData.phone,
      });

      if (profileError) {
        console.error("Error updating user profile:", profileError);
        toast.error(t("errors.saveFailed"));
        setIsLoading(false);
        return;
      }

      // Save additional buyer profile data to buyer_profiles table
      const { error: buyerProfileError } = await saveBuyerProfile(userInfo.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        avatar: formData.avatar,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      });

      if (buyerProfileError) {
        console.error("Error saving buyer profile:", buyerProfileError);
        toast.error(t("errors.saveFailed"));
      } else {
        toast.success(t("messages.saveSuccess"));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(t("errors.saveFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Callback to refresh stats after address changes
  const refreshStats = useCallback(async () => {
    if (userInfo?.id) {
      const newStats = await getBuyerStats(userInfo.id);
      setStats(newStats);
    }
  }, [userInfo?.id]);

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
        stats={stats}
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
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[140px]"
                >
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
            <BuyerAddresses
              addresses={addresses}
              setAddresses={setAddresses}
              onAddressChange={refreshStats}
            />
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
