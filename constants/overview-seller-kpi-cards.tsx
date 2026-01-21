import { DollarSign, ShoppingBag, Boxes, Clock } from "lucide-react";

export const getSellerKpis = () => [
  {
    label: "Revenue",
    value: "$14,520",
    icon: DollarSign,
  },
  {
    label: "Orders",
    value: 129,
    icon: ShoppingBag,
  },
  {
    label: "Active Products",
    value: 34,
    icon: Boxes,
  },
  {
    label: "Pending Orders",
    value: 6,
    icon: Clock,
  },
];
