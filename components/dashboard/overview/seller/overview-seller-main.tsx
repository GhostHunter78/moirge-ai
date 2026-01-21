import KpiCard from "../kpi-card";
import { getSellerKpis } from "@/constants/overview-seller-kpi-cards";
import RecentOrders from "./recent-orders";
import RecentActivity from "./recent-activity";
import SalesOverview from "./sales-overview";
import TopProducts from "./top-products";

function OverviewSellerMain() {
  const sellerKpis = getSellerKpis();
  return (
    <div className="space-y-6">
      <KpiCard items={sellerKpis} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesOverview />
        <TopProducts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrders />
        <RecentActivity />
      </div>
    </div>
  );
}

export default OverviewSellerMain;
