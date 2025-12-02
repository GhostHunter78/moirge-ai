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
    <section className="relative flex w-full items-center justify-between overflow-hidden px-6 pt-12 md:px-16 lg:px-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-linear-to-br from-[#f0f4ff] via-[#f9edfa] to-[#dde0fd]" />
        <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-linear-to-br from-[#b5d2fa]/50 to-[#e9e7fc]/0 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute right-0 bottom-0 w-[350px] h-[350px] bg-linear-to-br from-[#d6a8ff]/40 to-transparent rounded-full blur-3xl opacity-60" />
      </div>
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
