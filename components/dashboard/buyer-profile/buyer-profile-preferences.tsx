"use client";

import { useTranslations } from "next-intl";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Package, 
  Tag, 
  Newspaper, 
  Moon, 
  Globe, 
  DollarSign,
  ChevronDown
} from "lucide-react";
import { BuyerPreferences } from "@/types/buyer-profile";

interface BuyerPreferencesSectionProps {
  preferences: BuyerPreferences;
  onPreferenceChange: (key: keyof BuyerPreferences, value: boolean | string) => void;
}

// Toggle Switch Component
function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        ${enabled ? "bg-primary" : "bg-gray-200"}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${enabled ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

export function BuyerPreferencesSection({
  preferences,
  onPreferenceChange,
}: BuyerPreferencesSectionProps) {
  const t = useTranslations("dashboard.buyerProfile");

  const notificationSettings = [
    {
      key: "emailNotifications" as const,
      icon: Mail,
      title: t("preferences.notifications.email.title"),
      description: t("preferences.notifications.email.description"),
    },
    {
      key: "smsNotifications" as const,
      icon: Smartphone,
      title: t("preferences.notifications.sms.title"),
      description: t("preferences.notifications.sms.description"),
    },
    {
      key: "orderUpdates" as const,
      icon: Package,
      title: t("preferences.notifications.orders.title"),
      description: t("preferences.notifications.orders.description"),
    },
    {
      key: "promotions" as const,
      icon: Tag,
      title: t("preferences.notifications.promotions.title"),
      description: t("preferences.notifications.promotions.description"),
    },
    {
      key: "newsletter" as const,
      icon: Newspaper,
      title: t("preferences.notifications.newsletter.title"),
      description: t("preferences.notifications.newsletter.description"),
    },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "ge", name: "ქართული" },
  ];

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GEL", symbol: "₾", name: "Georgian Lari" },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t("sections.preferences.title")}</h3>
          <p className="text-sm text-gray-500">{t("sections.preferences.description")}</p>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            {t("preferences.notifications.title")}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {t("preferences.notifications.description")}
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {notificationSettings.map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between px-6 py-4 hover:bg-white/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <setting.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{setting.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences[setting.key]}
                onChange={() => onPreferenceChange(setting.key, !preferences[setting.key])}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Moon className="w-4 h-4" />
            {t("preferences.appearance.title")}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {t("preferences.appearance.description")}
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{t("preferences.appearance.darkMode.title")}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("preferences.appearance.darkMode.description")}</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={preferences.darkMode}
              onChange={() => onPreferenceChange("darkMode", !preferences.darkMode)}
            />
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t("preferences.regional.title")}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {t("preferences.regional.description")}
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Language */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{t("preferences.regional.language.title")}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("preferences.regional.language.description")}</p>
              </div>
            </div>
            <div className="relative sm:w-48">
              <select
                value={preferences.language}
                onChange={(e) => onPreferenceChange("language", e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Currency */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{t("preferences.regional.currency.title")}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("preferences.regional.currency.description")}</p>
              </div>
            </div>
            <div className="relative sm:w-48">
              <select
                value={preferences.currency}
                onChange={(e) => onPreferenceChange("currency", e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/50 rounded-xl border border-red-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-white">
          <h4 className="font-medium text-red-700">{t("preferences.dangerZone.title")}</h4>
          <p className="text-sm text-red-500 mt-1">
            {t("preferences.dangerZone.description")}
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900 text-sm">{t("preferences.dangerZone.deleteAccount.title")}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t("preferences.dangerZone.deleteAccount.description")}</p>
            </div>
            <button
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              {t("preferences.dangerZone.deleteAccount.button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
