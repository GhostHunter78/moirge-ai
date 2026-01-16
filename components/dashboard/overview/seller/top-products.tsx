import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Check if Badge exists
import { TrendingUp } from "lucide-react";

// Fallback if Badge doesn't exist, I will use span
// Checking for Badge existence first is better, but I'll write the file optimistically and then check.
// I'll stick to span with classes to be safe as I didn't see badge.tsx in the list.

const TOP_PRODUCTS = [
  {
    name: "Premium Wireless Headphones",
    sales: 120,
    revenue: "$15,600",
    growth: "+12%",
  },
  {
    name: "Ergonomic Office Chair",
    sales: 85,
    revenue: "$21,250",
    growth: "+5%",
  },
  {
    name: "Mechanical Keyboard",
    sales: 64,
    revenue: "$5,760",
    growth: "+8%",
  },
  {
    name: "USB-C Hub",
    sales: 42,
    revenue: "$1,890",
    growth: "-2%",
  },
];

export default function TopProducts() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best performing items this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {TOP_PRODUCTS.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.sales} sales
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{product.revenue}</p>
                <div className={`text-xs flex items-center justify-end ${product.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {product.growth.startsWith('+') && <TrendingUp className="w-3 h-3 mr-1" />}
                    {product.growth}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
