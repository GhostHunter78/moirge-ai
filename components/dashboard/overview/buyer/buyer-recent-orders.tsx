import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeCheck, Clock, Package, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const RECENT_ORDERS = [
  {
    id: "ORD-7352",
    items: "Wireless Headphones, Protective Case",
    total: "$145.99",
    status: "Shipped",
    date: "2024-01-15",
  },
  {
    id: "ORD-7351",
    items: "Ergonomic Mouse",
    total: "$59.99",
    status: "Processing",
    date: "2024-01-14",
  },
  {
    id: "ORD-7350",
    items: "Laptop Stand",
    total: "$35.00",
    status: "Completed",
    date: "2024-01-10",
  },
  {
    id: "ORD-7349",
    items: "USB-C Cable (2m)",
    total: "$12.50",
    status: "Completed",
    date: "2024-01-05",
  },
];

export default function BuyerRecentOrders() {
  return (
    <Card className="col-span-1 lg:col-span-2 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Track and manage your recent purchases
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/buyer/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {RECENT_ORDERS.map((order) => (
            <div key={order.id} className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  Order #{order.id}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                  {order.items}
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end mr-6 text-right">
                <p className="text-sm font-medium">{order.total}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {order.status === "Completed" && (
                  <div className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <BadgeCheck className="w-3 h-3 mr-1" />
                    Completed
                  </div>
                )}
                {order.status === "Processing" && (
                  <div className="flex items-center text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    Processing
                  </div>
                )}
                {order.status === "Shipped" && (
                  <div className="flex items-center text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    <Truck className="w-3 h-3 mr-1" />
                    Shipped
                  </div>
                )}
                {order.status === "Cancelled" && (
                  <div className="flex items-center text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    <XCircle className="w-3 h-3 mr-1" />
                    Cancelled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
