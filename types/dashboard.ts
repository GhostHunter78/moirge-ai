import { Profile } from "./user-profile";
import { LucideIcon } from "lucide-react";

export type DashboardPageMetadata = {
  label: string;
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
};

export type DashboardSection = {
  section: string;
  items: DashboardPageMetadata[];
};

export interface DashboardPageWrapperProps {
  children: React.ReactNode;
  userInfo: Profile;
}

export interface DashboardPageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  userInfo?: Profile;
}

// overview page types
export type KPI = {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down";
};

export interface KpiCardProps {
  items: KPI[];
}

// store profile types
export interface StoreProfileFormData {
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  storeCover?: string;
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
  tiktok: string;
  returnPolicy: string;
  shippingPolicy: string;
  privacyPolicy: string;
}

export type StoreProfileErrors = Partial<
  Record<keyof StoreProfileFormData, string>
>;

export interface StoreProfile {
  id: string;
  user_id: string;
  store_name: string;
  store_description: string;
  store_logo: string;
  store_cover?: string | null;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  return_policy: string;
  shipping_policy: string;
  privacy_policy: string;
}
