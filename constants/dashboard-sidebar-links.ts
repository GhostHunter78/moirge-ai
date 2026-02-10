import { DashboardSection } from "@/types/dashboard";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  MessageSquare,
  Settings,
  Store,
  List,
  BarChart2,
  Globe,
} from "lucide-react";

export const DASHBOARD_SIDEBAR_LINKS: {
  buyer: DashboardSection[];
  seller: DashboardSection[];
} = {
  buyer: [
    {
      section: "General",
      items: [
        {
          label: "Overview",
          href: "/dashboard/buyer",
          icon: LayoutDashboard,
          title: "Overview",
          description:
            "Get a comprehensive view of your account activity and statistics",
        },
        {
          label: "My Profile",
          href: "/dashboard/buyer/profile",
          icon: User,
          title: "My Profile",
          description: "Manage your personal information and account settings",
        },
      ],
    },
    {
      section: "Shopping",
      items: [
        {
          label: "Stores",
          href: "/dashboard/buyer/stores",
          icon: Store,
          title: "Stores",
          description: "Browse all stores and discover sellers on the marketplace",
        },
        {
          label: "Products",
          href: "/dashboard/buyer/products",
          icon: List,
          title: "Products",
          description: "Browse products from all stores on the marketplace",
        },
        {
          label: "Orders",
          href: "/dashboard/buyer/orders",
          icon: ShoppingBag,
          title: "Orders",
          description: "View and track all your orders and purchase history",
        },
        {
          label: "Saved",
          href: "/dashboard/buyer/saved",
          icon: Heart,
          title: "Saved Items",
          description: "Browse your saved products and wishlist items",
        },
      ],
    },
    {
      section: "Communication",
      items: [
        {
          label: "Messages",
          href: "/dashboard/buyer/messages",
          icon: MessageSquare,
          title: "Messages",
          description: "Communicate with sellers and manage your conversations",
        },
        {
          label: "Settings",
          href: "/dashboard/buyer/settings",
          icon: Settings,
          title: "Settings",
          description:
            "Customize your account preferences and notification settings",
        },
      ],
    },
  ],

  seller: [
    {
      section: "General",
      items: [
        {
          label: "Overview",
          href: "/dashboard/seller",
          icon: LayoutDashboard,
          title: "Overview",
          description:
            "Monitor your store performance and key metrics at a glance",
        },
        {
          label: "Store Profile",
          href: "/dashboard/seller/store-profile",
          icon: Store,
          title: "Store Profile",
          description: "Manage your store information and branding",
        },
        {
          label: "Public Store Page",
          href: "/dashboard/seller/public-store",
          icon: Globe,
          title: "Public Store Page",
          description: "Preview how your store looks to buyers",
        },
      ],
    },
    {
      section: "Commerce",
      items: [
        {
          label: "Products",
          href: "/dashboard/seller/products",
          icon: List,
          title: "Products",
          description: "Manage your product catalog, inventory, and listings",
        },
        {
          label: "Orders",
          href: "/dashboard/seller/orders",
          icon: ShoppingBag,
          title: "Orders",
          description: "View and process customer orders and shipments",
        },
      ],
    },
    {
      section: "Insights",
      items: [
        {
          label: "Analytics",
          href: "/dashboard/seller/analytics",
          icon: BarChart2,
          title: "Analytics",
          description: "Analyze your sales performance and customer insights",
        },
      ],
    },
    {
      section: "Communication",
      items: [
        {
          label: "Messages",
          href: "/dashboard/seller/messages",
          icon: MessageSquare,
          title: "Messages",
          description: "Respond to customer inquiries and manage conversations",
        },
        {
          label: "Settings",
          href: "/dashboard/seller/settings",
          icon: Settings,
          title: "Settings",
          description: "Configure your store settings and preferences",
        },
      ],
    },
  ],
};
