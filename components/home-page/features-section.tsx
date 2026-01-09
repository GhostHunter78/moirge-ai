import {
  BrainCog,
  ShieldCheck,
  Shirt,
  BarChart3,
  Images,
  PencilLine,
} from "lucide-react";
import { Profile } from "@/types/user-profile";
import { useTranslations } from "next-intl";

function FeaturesSection({ userInfo }: { userInfo: Profile | null }) {
  const t = useTranslations("homePage.featuresSection");
  const isBuyer = userInfo?.role === "buyer";

  const buyerFeatures = [
    {
      title: t("buyerFeatures.smartRecommendations.title"),
      description: t("buyerFeatures.smartRecommendations.description"),
      icon: <BrainCog className="w-9 h-9 text-primary" />,
    },
    {
      title: t("buyerFeatures.virtualTryOn.title"),
      description: t("buyerFeatures.virtualTryOn.description"),
      icon: <Shirt className="w-9 h-9 text-primary" />,
    },
    {
      title: t("buyerFeatures.safeVerifiedSellers.title"),
      description: t("buyerFeatures.safeVerifiedSellers.description"),
      icon: <ShieldCheck className="w-9 h-9 text-primary" />,
    },
  ];

  const sellerFeatures = [
    {
      title: t("sellerFeatures.generateProductImages.title"),
      description: t("sellerFeatures.generateProductImages.description"),
      icon: <Images className="w-9 h-9 text-primary" />,
    },
    {
      title: t("sellerFeatures.automatedDescription.title"),
      description: t("sellerFeatures.automatedDescription.description"),
      icon: <PencilLine className="w-9 h-9 text-primary" />,
    },
    {
      title: t("sellerFeatures.analyticsInsights.title"),
      description: t("sellerFeatures.analyticsInsights.description"),
      icon: <BarChart3 className="w-9 h-9 text-primary" />,
    },
  ];

  const relevantFeatures = isBuyer ? buyerFeatures : sellerFeatures;

  return (
    <section className="relative py-16 px-6 md:px-16 bg-linear-to-b from-[#faf6ff] via-white to-[#f3f6ff] w-full">
      <div className="max-w-[1800px] mx-auto relative">
        <img
          src="/images/hoodie-asset.png"
          alt="Features Section Title"
          className="absolute top-[-250px] left-[90px] sm:top-[-250px] sm:right-[0] sm:left-[auto] lg:top-[-200px] lg:left-0 w-[300px] h-[300px] object-contain"
        />
        <div className="max-w-[1400px] mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-linear-to-r from-primary/10 to-secondary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3 shadow transition-colors duration-200">
              {t("badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              {isBuyer ? t("headingBuyer") : t("headingSeller")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <div
            className="
              grid gap-8
              grid-cols-1
              sm:grid-cols-2
              sm:[&>*:nth-child(3)]:col-span-2
              lg:grid-cols-3
              lg:[&>*:nth-child(3)]:col-span-1
            "
          >
            {relevantFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
