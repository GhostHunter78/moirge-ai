"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { StoreProfile } from "@/types/dashboard";
import type { Profile } from "@/types/user-profile";
import { Store, MapPin } from "lucide-react";

export interface StoreWithOwner {
  store: StoreProfile;
  owner: Profile | null;
}

export default function StoreCard({ store, owner }: StoreWithOwner) {
  const name = store.store_name || owner?.username || "Store";
  const description =
    store.store_description?.slice(0, 120) ||
    "Discover products from this seller.";
  const hasMoreDescription =
    (store.store_description?.length ?? 0) > 120 ? "..." : "";
  const logo = store.store_logo?.trim() || null;
  const location = [store.city, store.country].filter(Boolean).join(", ");

  return (
    <Link href={`/store/${store.user_id}`} className="block group">
      <Card className="h-full overflow-hidden border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-200 hover:-translate-y-0.5">
        <div className="relative h-36 bg-linear-to-br from-slate-100 to-teal-50 flex items-center justify-center overflow-hidden">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              width={96}
              height={96}
              className="object-contain rounded-xl w-20 h-20 sm:w-24 sm:h-24 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
              <Store className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600" />
            </div>
          )}
        </div>
        <CardContent className="p-4 sm:p-5">
          <h3 className="font-semibold text-gray-900 text-lg truncate group-hover:text-teal-700 transition-colors">
            {name}
          </h3>
          {owner?.username && owner.username !== name && (
            <p className="text-xs text-gray-500 mt-0.5">@{owner.username}</p>
          )}
          <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
            {description}
            {hasMoreDescription}
          </p>
          {location && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-teal-600" />
              <span className="truncate">{location}</span>
            </div>
          )}
          <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-teal-600 group-hover:text-teal-700">
            View store
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
