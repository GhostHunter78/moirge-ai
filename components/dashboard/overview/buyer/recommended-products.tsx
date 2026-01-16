import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Image from "next/image";

const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    name: "Minimalist Desk Lamp",
    price: "$45.00",
    category: "Home Office",
    image: "https://images.unsplash.com/photo-1507473888900-52a11b750125?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzayUyMGxhbXB8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 2,
    name: "Wireless Noise Cancelling Headphones",
    price: "$299.00",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: "$120.00",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjaGFuaWNhbCUyMGtleWJvYXJkfGVufDB8fDB8fHww",
  },
];

export default function RecommendedProducts() {
  return (
    <Card className="col-span-1 lg:col-span-2 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>
            Based on your recent viewing history
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECOMMENDED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-lg border p-3 hover:shadow-md transition-all"
            >
              <div className="aspect-square relative mb-3 overflow-hidden rounded-md bg-gray-100">
                 {/* Using standard img for now if next/image is strict on domains, otherwise will use Image */}
                 <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                 />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <h3 className="font-medium leading-tight truncate">{product.name}</h3>
                <div className="flex items-center justify-between pt-2">
                    <span className="font-bold">{product.price}</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                    </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
            <Button variant="link" className="text-xs text-muted-foreground">
                View more recommendations <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
