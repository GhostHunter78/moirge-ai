import {
  BrainCog,
  ShieldCheck,
  Shirt,
  BarChart3,
  Images,
  PencilLine,
} from "lucide-react";
import { Profile } from "@/types/user-profile";

function FeaturesSection({ userInfo }: { userInfo: Profile | null }) {
  const buyerFeatures = [
    {
      title: "Smart Recommendations",
      description:
        "Enjoy personalized AI-powered product recommendations to help you find the perfect items with ease.",
      icon: <BrainCog className="w-9 h-9 text-primary" />,
    },
    {
      title: "Virtual Try-On",
      description:
        "See how clothes would look on you instantly—just click one button to try products on virtually using AI.",
      icon: <Shirt className="w-9 h-9 text-primary" />,
    },
    {
      title: "Safe & Verified Sellers",
      description:
        "Shop confidently with trusted, verified sellers and secure transactions on every purchase you make.",
      icon: <ShieldCheck className="w-9 h-9 text-primary" />,
    },
  ];

  const sellerFeatures = [
    {
      title: "Generate Product Images",
      description:
        "Create stunning, high-quality product images instantly with AI-powered tools—no photography skills needed.",
      icon: <Images className="w-9 h-9 text-primary" />,
    },
    {
      title: "Automated product description writing",
      description:
        "Let AI craft compelling, SEO-optimized product descriptions for every item in your shop automatically.",
      icon: <PencilLine className="w-9 h-9 text-primary" />,
    },
    {
      title: "Analytics & insights",
      description:
        "Access real-time analytics and insights to track performance, understand customers, and boost your sales.",
      icon: <BarChart3 className="w-9 h-9 text-primary" />,
    },
  ];

  const relevantFeatures =
    userInfo?.role === "buyer" ? buyerFeatures : sellerFeatures;

  return (
    <section className="relative py-16 px-6 md:px-16 bg-linear-to-b from-[#faf6ff] via-white to-[#f3f6ff] w-full">
      <div className="max-w-[1800px] mx-auto relative">
        <img
          src="/images/hoodie-asset.png"
          alt="Features Section Title"
          className="absolute top-[-200px] left-0 w-[300px] h-[300px] object-contain"
        />
        <div className="max-w-[1400px] mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-linear-to-r from-primary/10 to-secondary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3 shadow transition-colors duration-200">
              What We Can
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              {userInfo?.role === "buyer"
                ? "Discover our Key Features for Buyers"
                : "Discover our Key Features for Sellers"}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Empowering your ecommerce experience—smarter, safer, and more
              connected.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
