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
} from "lucide-react";

export const DASHBOARD_SIDEBAR_LINKS = {
  buyer: [
    {
      section: "General",
      items: [
        { label: "Overview", href: "/dashboard/buyer", icon: LayoutDashboard },
        { label: "My Profile", href: "/dashboard/buyer/profile", icon: User },
      ],
    },
    {
      section: "Shopping",
      items: [
        { label: "Orders", href: "/dashboard/buyer/orders", icon: ShoppingBag },
        { label: "Saved", href: "/dashboard/buyer/saved", icon: Heart },
      ],
    },
    {
      section: "Communication",
      items: [
        {
          label: "Messages",
          href: "/dashboard/buyer/messages",
          icon: MessageSquare,
        },
        {
          label: "Settings",
          href: "/dashboard/buyer/settings",
          icon: Settings,
        },
      ],
    },
  ],

  seller: [
    {
      section: "General",
      items: [
        { label: "Overview", href: "/dashboard/seller", icon: LayoutDashboard },
        {
          label: "Store Profile",
          href: "/dashboard/seller/store-profile",
          icon: Store,
        },
      ],
    },
    {
      section: "Commerce",
      items: [
        { label: "Products", href: "/dashboard/seller/products", icon: List },
        {
          label: "Orders",
          href: "/dashboard/seller/orders",
          icon: ShoppingBag,
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
        },
        {
          label: "Settings",
          href: "/dashboard/seller/settings",
          icon: Settings,
        },
      ],
    },
  ],
};
