import { Button } from "../ui/button";
import { Profile } from "@/types/user-profile";
import { useRouter } from "next/navigation";

function HeroSection({
  isSignedIn,
  userInfo,
}: {
  isSignedIn: boolean | null;
  userInfo: Profile | null;
}) {
  const isSeller = userInfo?.role === "seller";
  const router = useRouter();

  const handleStartAsBuyer = () => {
    if (!isSignedIn || isSeller) {
      router.push("/auth/signin");
    } else {
      router.push("/dashboard");
    }
  };

  const handleStartAsSeller = () => {
    if (!isSignedIn || !isSeller) {
      router.push("/auth/signin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <section className="w-full bg-[#fefcff] relative flex items-center justify-between overflow-hidden px-6 pt-12 md:px-16 lg:px-32">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
            radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      <div className="max-w-[1400px] mx-auto flex w-full items-center justify-between">
        <div className="flex flex-col justify-end z-10 pb-12 lg:pb-24 max-w-xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight">
            AI-powered ecommerce assistant for both buyers &amp; sellers.
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground mb-8">
            Shop smarter. Sell faster. Increase trust and efficiency.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={handleStartAsBuyer}
              className="text-base px-6 py-3"
              size="lg"
            >
              Start as Buyer
            </Button>
            <Button
              variant="outline"
              className="text-base px-6 py-3 border-2"
              size="lg"
              onClick={handleStartAsSeller}
            >
              Start as Seller
            </Button>
          </div>
        </div>
        {/* Right: Image */}
        <img
          src="/images/hero-section-girl-asset.png"
          alt="Hero Section Girl Asset"
          className="hidden lg:block h-auto w-[260px] sm:w-[320px] md:w-[380px] lg:w-[600px] object-contain"
        />
      </div>
    </section>
  );
}

export default HeroSection;
