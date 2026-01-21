import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function SalesOverview() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly revenue performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[200px] bg-muted/20 border-2 border-dashed border-muted rounded-lg">
          <BarChart3 className="w-10 h-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground font-medium">
            Chart Visualization Placeholder
          </p>
          <p className="text-xs text-muted-foreground text-center max-w-[250px] mt-1">
            Data visualization will be integrated here to show revenue trends over time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
