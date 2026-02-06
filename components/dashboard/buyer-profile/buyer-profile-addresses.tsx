"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Building,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import { BuyerAddressFormData } from "@/types/buyer-profile";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/use-user-profile";
import {
  addBuyerAddress,
  updateBuyerAddress,
  deleteBuyerAddress,
  setDefaultAddress,
} from "@/lib/buyer-profile";

interface BuyerAddressesProps {
  addresses: BuyerAddressFormData[];
  setAddresses: React.Dispatch<React.SetStateAction<BuyerAddressFormData[]>>;
  onAddressChange?: () => void;
}

export function BuyerAddresses({
  addresses,
  setAddresses,
  onAddressChange,
}: BuyerAddressesProps) {
  const t = useTranslations("dashboard.buyerProfile");
  const { userInfo } = useUserProfile();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<BuyerAddressFormData, "id">>({
    label: "Home",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });

  const resetForm = () => {
    setFormData({
      label: "Home",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLabelSelect = (label: string) => {
    setFormData((prev) => ({ ...prev, label }));
  };

  const handleSave = async () => {
    if (!userInfo?.id) {
      toast.error(t("errors.notAuthenticated"));
      return;
    }

    if (
      !formData.fullName ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.country
    ) {
      toast.error(t("addresses.errors.requiredFields"));
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        // Update existing address
        const { data, error } = await updateBuyerAddress(
          editingId,
          userInfo.id,
          formData as BuyerAddressFormData,
        );

        if (error) {
          console.error("Error updating address:", error);
          toast.error(t("addresses.errors.saveFailed"));
          return;
        }

        // Update local state
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingId
              ? {
                  ...formData,
                  id: editingId,
                }
              : // If the updated address is now default, unset other defaults
                data?.is_default
                ? { ...addr, isDefault: false }
                : addr,
          ),
        );
        toast.success(t("addresses.messages.updated"));
      } else {
        // Add new address
        const { data, error } = await addBuyerAddress(
          userInfo.id,
          formData as BuyerAddressFormData,
        );

        if (error) {
          console.error("Error adding address:", error);
          toast.error(t("addresses.errors.saveFailed"));
          return;
        }

        // Add to local state
        const newAddress: BuyerAddressFormData = {
          id: data.id,
          label: data.label,
          fullName: data.full_name,
          phone: data.phone || "",
          addressLine1: data.address_line_1,
          addressLine2: data.address_line_2 || "",
          city: data.city,
          state: data.state || "",
          zipCode: data.zip_code || "",
          country: data.country,
          isDefault: data.is_default,
        };

        // If the new address is default, update other addresses
        if (newAddress.isDefault) {
          setAddresses((prev) => [
            ...prev.map((addr) => ({ ...addr, isDefault: false })),
            newAddress,
          ]);
        } else {
          setAddresses((prev) => [...prev, newAddress]);
        }

        toast.success(t("addresses.messages.added"));
      }

      resetForm();
      setEditingId(null);
      setIsAdding(false);
      onAddressChange?.();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(t("addresses.errors.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (address: BuyerAddressFormData) => {
    setFormData({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address.id || null);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!userInfo?.id) {
      toast.error(t("errors.notAuthenticated"));
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await deleteBuyerAddress(id, userInfo.id);

      if (error) {
        console.error("Error deleting address:", error);
        toast.error(t("addresses.errors.deleteFailed"));
        return;
      }

      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      toast.success(t("addresses.messages.deleted"));
      onAddressChange?.();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(t("addresses.errors.deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!userInfo?.id) {
      toast.error(t("errors.notAuthenticated"));
      return;
    }

    try {
      const { error } = await setDefaultAddress(id, userInfo.id);

      if (error) {
        console.error("Error setting default address:", error);
        toast.error(t("addresses.errors.saveFailed"));
        return;
      }

      // Update local state - the database trigger handles unsetting other defaults
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        })),
      );
      toast.success(t("addresses.messages.defaultSet"));
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(t("addresses.errors.saveFailed"));
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingId(null);
    setIsAdding(false);
  };

  const labelOptions = [
    { value: "Home", icon: Home },
    { value: "Work", icon: Building },
    { value: "Other", icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t("sections.addresses.title")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("sections.addresses.description")}
            </p>
          </div>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            {t("addresses.addNew")}
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              {editingId
                ? t("addresses.editAddress")
                : t("addresses.newAddress")}
            </h4>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Label Selection */}
          <div className="space-y-2">
            <Label>{t("addresses.fields.label")}</Label>
            <div className="flex gap-2">
              {labelOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleLabelSelect(option.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all
                    ${
                      formData.label === option.value
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t(`addresses.labels.${option.value.toLowerCase()}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                {t("addresses.fields.fullName")} *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t("addresses.fields.fullNamePlaceholder")}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("addresses.fields.phone")}</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("addresses.fields.phonePlaceholder")}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">
              {t("addresses.fields.addressLine1")} *
            </Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder={t("addresses.fields.addressLine1Placeholder")}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">
              {t("addresses.fields.addressLine2")}
            </Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder={t("addresses.fields.addressLine2Placeholder")}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">{t("addresses.fields.city")} *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder={t("addresses.fields.cityPlaceholder")}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">{t("addresses.fields.state")}</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder={t("addresses.fields.statePlaceholder")}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">{t("addresses.fields.zipCode")}</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder={t("addresses.fields.zipCodePlaceholder")}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t("addresses.fields.country")} *</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder={t("addresses.fields.countryPlaceholder")}
                className="h-11"
              />
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isDefault: e.target.checked,
                }))
              }
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <Label
              htmlFor="isDefault"
              className="text-sm font-normal cursor-pointer"
            >
              {t("addresses.setDefault")}
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={handleCancel}>
              {t("buttons.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("buttons.saving")}
                </>
              ) : (
                t("buttons.saveAddress")
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{t("addresses.empty")}</p>
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              {t("addresses.addFirst")}
            </Button>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`relative bg-white rounded-xl p-5 border transition-all hover:shadow-sm
                ${
                  address.isDefault
                    ? "border-primary/30 bg-primary/5"
                    : "border-gray-200"
                }`}
            >
              {address.isDefault && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  {t("addresses.default")}
                </span>
              )}

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  {address.label === "Home" && (
                    <Home className="w-5 h-5 text-gray-600" />
                  )}
                  {address.label === "Work" && (
                    <Building className="w-5 h-5 text-gray-600" />
                  )}
                  {(address.label === "Other" ||
                    !["Home", "Work"].includes(address.label)) && (
                    <MapPin className="w-5 h-5 text-gray-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {address.fullName}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {t(`addresses.labels.${address.label.toLowerCase()}`)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className="text-sm text-gray-600">
                      {address.addressLine2}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {address.city}
                    {address.state && `, ${address.state}`}
                    {address.zipCode && ` ${address.zipCode}`}
                  </p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                  {address.phone && (
                    <p className="text-sm text-gray-500 mt-1">
                      {address.phone}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!address.isDefault && address.id && (
                    <button
                      onClick={() => handleSetDefault(address.id!)}
                      className="text-xs text-gray-500 hover:text-primary font-medium"
                    >
                      {t("addresses.setDefault")}
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => address.id && handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === address.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
