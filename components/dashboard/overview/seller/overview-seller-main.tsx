import KpiCard from "../kpi-card";
import { getSellerKpis } from "@/constants/overview-seller-kpi-cards";

function OverviewSellerMain() {
  const sellerKpis = getSellerKpis();
  return (
    <div>
      <KpiCard items={sellerKpis} />
    </div>
  );
}

export default OverviewSellerMain;
