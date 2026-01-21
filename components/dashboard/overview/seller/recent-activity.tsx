import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Package, UserPlus, AlertCircle } from "lucide-react";

const ACTIVITY_ITEMS = [
  {
    title: "New order received",
    description: "Order #ORD-006 from Sarah Williams",
    time: "10 minutes ago",
    icon: CreditCard,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    title: "Product out of stock",
    description: "'Minimalist Watch' is now out of stock",
    time: "2 hours ago",
    icon: AlertCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-100",
  },
  {
    title: "New customer registered",
    description: "Welcome Michael Brown to your store",
    time: "5 hours ago",
    icon: UserPlus,
    iconColor: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    title: "Order shipped",
    description: "Order #ORD-003 has been shipped",
    time: "Yesterday",
    icon: Package,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-100",
  },
];

export default function RecentActivity() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions on your store</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {ACTIVITY_ITEMS.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full ${item.bgColor}`}
              >
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
