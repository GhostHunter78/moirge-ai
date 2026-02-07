"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { StoreProfile } from "@/types/dashboard";
import type { Profile } from "@/types/user-profile";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Music2,
  Shield,
  Truck,
  FileText,
} from "lucide-react";

type StorePublicProfileViewProps = {
  store: StoreProfile | null;
  owner?: Profile | null;
  mode?: "public" | "preview";
};

export default function StorePublicProfileView({
  store,
  owner,
  mode = "public",
}: StorePublicProfileViewProps) {
  if (!store) {
    if (mode === "preview") {
      return (
        <Card className="p-8 border-dashed border-slate-300 bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Your public store page is not ready yet
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Complete your store profile to generate a beautiful public page that
            buyers can see when they visit your store.
          </p>
          <Link
            href="/dashboard/seller/store-profile"
            className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Go to Store Profile
          </Link>
        </Card>
      );
    }

    // Public view – show a simple not found-style message
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Store profile not found
        </h2>
        <p className="text-sm text-slate-600">
          This seller has not set up their public store page yet.
        </p>
      </Card>
    );
  }

  const storeName = store.store_name || ""
  const description = store.store_description || "";

  const fullAddress = [
    store.address,
    store.city,
    store.state,
    store.zip_code,
    store.country,
  ]
    .filter(Boolean)
    .join(", ");

  const hasPolicies =
    !!store.return_policy || !!store.shipping_policy || !!store.privacy_policy;

  return (
    <div className="space-y-6">
      {/* Hero section with cover + logo */}
      <Card className="overflow-hidden border-slate-200 bg-slate-950 text-slate-50">
        <div className="relative h-40 sm:h-48 w-full bg-linear-to-r from-slate-900 via-slate-800 to-slate-900">
          {store.store_cover ? (
            <Image
              src={store.store_cover}
              alt={`${storeName} cover`}
              fill
              className="object-cover opacity-90"
            />
          ) : (
            <div className="absolute inset-0 opacity-70">
              <div className="absolute -left-20 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.5),transparent_60%)] blur-2xl" />
              <div className="absolute right-[-10%] bottom-[-20%] h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.45),transparent_60%)] blur-2xl" />
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 pb-6 sm:pb-8 -mt-12 sm:-mt-16 relative">
          <div className="flex flex-wrap items-end gap-4">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-lg shadow-slate-900/40">
              {store.store_logo ? (
                <Image
                  src={store.store_logo}
                  alt={storeName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold">
                  {storeName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {storeName}
                  </h1>
                  {owner?.username && (
                    <p className="mt-1 text-xs text-slate-300">
                      @{owner.username}
                    </p>
                  )}
                </div>

                {mode === "preview" && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                    This is how buyers see your store
                  </span>
                )}
              </div>

              {description && (
                <p className="mt-3 max-w-2xl text-sm text-slate-200">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Left column: About + Policies */}
        <div className="space-y-6">
          <Card className="p-5 sm:p-6 border-slate-200 bg-white/90">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              About this store
            </h2>
            {description ? (
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                The seller hasn&apos;t added a description for this store yet.
              </p>
            )}
          </Card>

          {hasPolicies && (
            <Card className="p-5 sm:p-6 border-slate-200 bg-white/90 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-700" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Store policies
                </h2>
              </div>
              <Separator />
              <div className="space-y-4 text-sm text-slate-700">
                {store.return_policy && (
                  <section>
                    <div className="flex items-center gap-2 mb-1.5">
                      <FileText className="h-4 w-4 text-slate-600" />
                      <h3 className="font-medium text-slate-900">
                        Return policy
                      </h3>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line">
                      {store.return_policy}
                    </p>
                  </section>
                )}

                {store.shipping_policy && (
                  <section>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Truck className="h-4 w-4 text-slate-600" />
                      <h3 className="font-medium text-slate-900">
                        Shipping policy
                      </h3>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line">
                      {store.shipping_policy}
                    </p>
                  </section>
                )}

                {store.privacy_policy && (
                  <section>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield className="h-4 w-4 text-slate-600" />
                      <h3 className="font-medium text-slate-900">
                        Privacy policy
                      </h3>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line">
                      {store.privacy_policy}
                    </p>
                  </section>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right column: Contact, address, social */}
        <div className="space-y-4">
          <Card className="p-5 sm:p-6 border-slate-200 bg-white/90 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Contact & location
            </h2>
            <Separator />

            <div className="space-y-3 text-sm text-slate-700">
              {store.email && (
                <div className="flex items-start gap-2">
                  <Mail className="mt-[2px] h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Email</p>
                    <a
                      href={`mailto:${store.email}`}
                      className="text-slate-800 hover:underline break-all"
                    >
                      {store.email}
                    </a>
                  </div>
                </div>
              )}

              {store.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="mt-[2px] h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Phone</p>
                    <a
                      href={`tel:${store.phone}`}
                      className="text-slate-800 hover:underline"
                    >
                      {store.phone}
                    </a>
                  </div>
                </div>
              )}

              {fullAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-[2px] h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Address
                    </p>
                    <p className="text-slate-800 whitespace-pre-line">
                      {fullAddress}
                    </p>
                  </div>
                </div>
              )}

              {store.website && (
                <div className="flex items-start gap-2">
                  <Globe className="mt-[2px] h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Website
                    </p>
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-800 hover:underline break-all"
                    >
                      {store.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {(store.facebook || store.instagram || store.tiktok) && (
            <Card className="p-5 sm:p-6 border-slate-200 bg-white/90 space-y-4">
              <div className="flex items-center gap-2">
                <Music2 className="h-4 w-4 text-slate-700" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Social profiles
                </h2>
              </div>
              <Separator />

              <div className="flex flex-wrap gap-2 text-sm">
                {store.facebook && (
                  <Link
                    href={store.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-100"
                  >
                    <Facebook className="h-3.5 w-3.5" />
                    Facebook
                  </Link>
                )}
                {store.instagram && (
                  <Link
                    href={store.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-100"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    Instagram
                  </Link>
                )}
                {store.tiktok && (
                  <Link
                    href={store.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-100"
                  >
                    <Music2 className="h-3.5 w-3.5" />
                    TikTok
                  </Link>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
