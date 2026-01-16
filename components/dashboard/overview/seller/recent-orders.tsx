import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeCheck, Clock, XCircle } from "lucide-react";

const RECENT_ORDERS = [
  {
    id: "ORD-001",
    customer: "Alice Smith",
    product: "Premium Wireless Headphones",
    amount: "$129.99",
    status: "Completed",
    date: "2023-10-25",
  },
  {
    id: "ORD-002",
    customer: "Bob Jones",
    product: "Ergonomic Office Chair",
    amount: "$249.50",
    status: "Processing",
    date: "2023-10-24",
  },
  {
    id: "ORD-003",
    customer: "Charlie Brown",
    product: "USB-C Hub Multiport Adapter",
    amount: "$45.00",
    status: "Shipped",
    date: "2023-10-24",
  },
  {
    id: "ORD-004",
    customer: "Diana Prince",
    product: "Mechanical Keyboard",
    amount: "$89.99",
    status: "Cancelled",
    date: "2023-10-23",
  },
  {
    id: "ORD-005",
    customer: "Evan Wright",
    product: "Gaming Mouse",
    amount: "$59.99",
    status: "Completed",
    date: "2023-10-22",
  },
];

export default function RecentOrders() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          You have {RECENT_ORDERS.length} orders this week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Order
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Customer
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Status
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {RECENT_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">
                    {order.id}
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customer}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {order.product}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="flex items-center gap-2">
                      {order.status === "Completed" && (
                        <BadgeCheck className="w-4 h-4 text-green-500" />
                      )}
                      {order.status === "Processing" && (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      {order.status === "Shipped" && (
                        <Clock className="w-4 h-4 text-blue-500" />
                      )}
                      {order.status === "Cancelled" && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span>{order.status}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                    {order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
