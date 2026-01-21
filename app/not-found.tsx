"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center gap-6">
        <div className="relative w-77 h-60 sm:w-64 sm:h-64 md:w-130 md:h-72">
          <Image
            src="/images/404-not-found-img.png"
            alt="404 - Page not found illustration"
            fill
            priority
            sizes="(min-width: 768px) 18rem, 14rem"
            className="object-contain drop-shadow-xl"
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2">
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 focus-visible:ring-offset-white"
          >
            {t("goHome")}
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 focus-visible:ring-offset-white"
          >
            {t("goBack")}
          </button>
        </div>
      </div>
    </main>
  );
}
