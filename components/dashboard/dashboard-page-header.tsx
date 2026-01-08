"use client";

import { DashboardPageHeaderProps } from "@/types/dashboard";

export default function DashboardPageHeader({
  icon: Icon,
  title,
  description,
}: DashboardPageHeaderProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 p-3">
        <div className="shrink-0">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-teal-700" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      <hr className="border-gray-200" />
    </div>
  );
}
