"use client";

import { useTranslations } from "next-intl";
import { Camera, Package, Heart, Star, MapPin } from "lucide-react";
import Image from "next/image";
import { BuyerProfileFormData } from "@/types/buyer-profile";
import { Profile } from "@/types/user-profile";

interface BuyerProfileHeaderProps {
  formData: BuyerProfileFormData;
  avatarPreview: string | null;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userInfo: Profile | null;
}

export function BuyerProfileHeader({
  formData,
  avatarPreview,
  onAvatarUpload,
  userInfo,
}: BuyerProfileHeaderProps) {
  const t = useTranslations("dashboard.buyerProfile");

  // Mock stats - would come from API in real app
  const stats = [
    { icon: Package, label: t("stats.orders"), value: "12" },
    { icon: Heart, label: t("stats.wishlist"), value: "24" },
    { icon: Star, label: t("stats.reviews"), value: "8" },
    { icon: MapPin, label: t("stats.addresses"), value: "2" },
  ];

  const displayName = formData.firstName && formData.lastName 
    ? `${formData.firstName} ${formData.lastName}`
    : formData.username || userInfo?.username || "User";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-gray-100 shadow-sm">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-gradient-to-br from-primary/20 to-primary/10">
              {avatarPreview || formData.avatar ? (
                <Image
                  src={avatarPreview || formData.avatar}
                  alt="Profile avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
              
              {/* Upload Overlay */}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={onAvatarUpload}
                className="hidden"
              />
            </div>
            
            {/* Online Status */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-sm" />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {displayName}
            </h1>
            <p className="text-gray-500 mb-1">@{formData.username || userInfo?.username}</p>
            <p className="text-sm text-gray-400 mb-4">{formData.email || userInfo?.email}</p>
            
            {formData.bio && (
              <p className="text-gray-600 text-sm max-w-md mb-4 line-clamp-2">
                {formData.bio}
              </p>
            )}

            {/* Member Since Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600 shadow-sm border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t("memberSince", { year: "2024" })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
