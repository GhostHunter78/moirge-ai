"use client";

import { useTranslations } from "next-intl";

export default function SignupSidebar() {
  const t = useTranslations("signup.sidebar");

  const features = [
    {
      icon: "⚡",
      title: t("features.fastSetupTitle"),
      desc: t("features.fastSetupDesc"),
    },
    {
      icon: "🔒",
      title: t("features.secureTitle"),
      desc: t("features.secureDesc"),
    },
    {
      icon: "📈",
      title: t("features.growTitle"),
      desc: t("features.growDesc"),
    },
    {
      icon: "👕",
      title: t("features.clothUpTitle"),
      desc: t("features.clothUpDesc"),
    },
  ];

  return (
    <div
      className="w-full relative overflow-hidden flex flex-col justify-center items-start p-12 lg:p-16"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_5-u4qkmmy4nHtbVueIXPFJxcd8lPGm5K.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-md">
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center">
              <span className="font-bold text-teal-700">✦</span>
            </div>
            <span className="text-sm font-medium text-white">
              {t("brand")}
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight text-balance">
          {t("heading")}
        </h1>

        {/* Subheading */}
        <p className="text-lg text-white/90 mb-8 leading-relaxed">
          {t("subheading")}
        </p>

        {/* Features List */}
        <div className="space-y-4">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="text-2xl mt-1">{feature.icon}</div>
              <div>
                <p className="font-semibold text-white">{feature.title}</p>
                <p className="text-sm text-white/75">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">
              {t("bottom.sellersPrefix")}
            </span>{" "}
            {t("bottom.sellersText")}
          </p>
        </div>
      </div>
    </div>
  );
}
