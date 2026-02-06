"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, Shield, Smartphone, History, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PasswordChangeData, BuyerProfileErrors } from "@/types/buyer-profile";

export function BuyerSecuritySettings() {
  const t = useTranslations("dashboard.buyerProfile");
  
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<BuyerProfileErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);
  const strengthLabels = ["", t("security.strength.weak"), t("security.strength.fair"), t("security.strength.good"), t("security.strength.strong"), t("security.strength.excellent")];
  const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof BuyerProfileErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: BuyerProfileErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = t("errors.currentPasswordRequired");
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = t("errors.newPasswordRequired");
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = t("errors.passwordTooShort");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = t("errors.passwordsDoNotMatch");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(t("security.passwordChanged"));
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(t("errors.passwordChangeFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Password requirements
  const requirements = [
    { met: passwordData.newPassword.length >= 8, label: t("security.requirements.minLength") },
    { met: /[a-z]/.test(passwordData.newPassword), label: t("security.requirements.lowercase") },
    { met: /[A-Z]/.test(passwordData.newPassword), label: t("security.requirements.uppercase") },
    { met: /[0-9]/.test(passwordData.newPassword), label: t("security.requirements.number") },
    { met: /[^a-zA-Z0-9]/.test(passwordData.newPassword), label: t("security.requirements.special") },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t("sections.security.title")}</h3>
          <p className="text-sm text-gray-500">{t("sections.security.description")}</p>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-gray-600" />
          <h4 className="font-medium text-gray-900">{t("security.changePassword")}</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t("security.currentPassword")}</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`h-11 pr-10 ${errors.currentPassword ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t("security.newPassword")}</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`h-11 pr-10 ${errors.newPassword ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword}</p>
            )}
            
            {/* Password Strength Indicator */}
            {passwordData.newPassword && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= passwordStrength ? strengthColors[passwordStrength] : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {t("security.strength.label")}: <span className="font-medium">{strengthLabels[passwordStrength]}</span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("security.confirmPassword")}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`h-11 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Password Requirements */}
          {passwordData.newPassword && (
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">{t("security.requirements.title")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {req.met ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-300" />
                    )}
                    <span className={`text-xs ${req.met ? "text-green-600" : "text-gray-500"}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("buttons.updating")}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                {t("buttons.updatePassword")}
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mt-0.5">
              <Smartphone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{t("security.twoFactor.title")}</h4>
              <p className="text-sm text-gray-500 mt-1">{t("security.twoFactor.description")}</p>
            </div>
          </div>
          <Button variant="outline" className="shrink-0">
            {t("security.twoFactor.enable")}
          </Button>
        </div>
      </div>

      {/* Login History */}
      <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-600" />
          <h4 className="font-medium text-gray-900">{t("security.loginHistory.title")}</h4>
        </div>
        
        <div className="space-y-3">
          {[
            { device: "Chrome on Windows", location: "Tbilisi, Georgia", time: "2 hours ago", current: true },
            { device: "Safari on iPhone", location: "Tbilisi, Georgia", time: "Yesterday", current: false },
            { device: "Firefox on MacOS", location: "Batumi, Georgia", time: "3 days ago", current: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${session.current ? "bg-green-500" : "bg-gray-300"}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {t("security.loginHistory.current")}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{session.location} · {session.time}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-xs text-red-500 hover:text-red-600 font-medium">
                  {t("security.loginHistory.revoke")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
