"use client";

import { DollarSign, Heart, Package, Star } from "lucide-react";
import KpiCard from "../kpi-card";
import BuyerRecentOrders from "./buyer-recent-orders";
import RecommendedProducts from "./recommended-products";

const BUYER_KPI_DATA = [
  {
    label: "Total Orders",
    value: "12",
    icon: Package,
  },
  {
    label: "Total Spent",
    value: "$1,240.50",
    icon: DollarSign,
  },
  {
    label: "Wishlist Items",
    value: "8",
    icon: Heart,
  },
  {
    label: "Reviews Given",
    value: "5",
    icon: Star,
  },
];

function OverviewBuyerMain() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KpiCard items={BUYER_KPI_DATA} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <BuyerRecentOrders />
        </div>
        <div className="xl:col-span-1">
          <RecommendedProducts />
        </div>
      </div>
    </div>
  );
}

export default OverviewBuyerMain;
