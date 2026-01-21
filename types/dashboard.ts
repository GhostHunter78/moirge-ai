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
