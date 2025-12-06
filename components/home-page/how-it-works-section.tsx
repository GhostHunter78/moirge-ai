import { Profile } from "@/types/user-profile";
import { useRef, useEffect } from "react";

const buyerSteps = [
  {
    title: "Sign Up or Log In",
    description:
      "Create your account in seconds or log in to get instant access to personalized shopping features.",
  },
  {
    title: "Discover & Try",
    description:
      "Uncover handpicked items with AI-powered recommendations. Instantly try items on virtually for a fun, immersive experience.",
  },
  {
    title: "Shop Confidently",
    description:
      "Purchase from verified sellers and enjoy a safe, seamless checkout with built-in protection.",
  },
  {
    title: "Track & Receive",
    description:
      "Track your order in real-time and enjoy fast, reliable delivery right to your door.",
  },
];

const sellerSteps = [
  {
    title: "Register as Seller",
    description:
      "Set up your seller shop quickly — just provide some details and start your journey.",
  },
  {
    title: "Create Listings with AI",
    description:
      "Effortlessly generate pro product images and descriptions with AI. No studio needed.",
  },
  {
    title: "Attract & Sell",
    description:
      "Reach active buyers as the AI boosts your visibility. Track interest in real-time.",
  },
  {
    title: "Analyze & Grow",
    description:
      "Use powerful analytics to boost your shop's performance and confidence.",
  },
];

function useStepAnimations() {
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      itemsRef.current.forEach((item, idx) => {
        if (item) {
          const rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
            item.classList.add("animate-fade-in-up");
            item.style.transitionDelay = `${idx * 80 + 100}ms`;
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return itemsRef;
}

function HowItWorksSection({ userInfo }: { userInfo: Profile | null }) {
  const isBuyer = userInfo?.role === "buyer";
  const steps = isBuyer ? buyerSteps : sellerSteps;
  const itemsRef = useStepAnimations();

  return (
    <section className="relative w-full py-20 px-4 md:px-8 bg-linear-to-b from-[#f4f8ff] via-white to-[#f1f6fc] overflow-x-clip">
      {/* Decorative Animated Blobs */}
      <div className="pointer-events-none absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30 animate-float -z-10" />
      <div className="pointer-events-none absolute right-0 top-28 w-80 h-80 bg-[#d0bfff]/30 rounded-full blur-2xl opacity-40 animate-float2 -z-10" />
      <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-[520px] h-[180px] bg-linear-to-b from-[#cdc7ff]/30 via-transparent to-transparent rounded-full blur-2xl opacity-20 animate-pulse-slow -z-10" />
      <div className="max-w-[1800px] mx-auto relative">
        <img
          src="/images/ferrari-jacket-asset.png"
          alt="Features Section Title"
          className="absolute hidden xl:block top-[-100px] right-0 w-[300px] h-[300px] object-contain"
        />
        <div className="max-w-[1400px] mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-linear-to-r from-primary/10 to-secondary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3 shadow transition-colors duration-200">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 drop-shadow leading-tight">
              {isBuyer
                ? "Shop Smarter in 4 Simple Steps"
                : "Sell Effortlessly with AI in 4 Steps"}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              {isBuyer
                ? "Explore, try, and buy with total confidence. See how easy intelligent shopping can be."
                : "List, grow, and analyze your shop with seamless AI assistance. Start selling in minutes."}
            </p>
          </div>
          {/* Add gap between cards for both mobile and desktop */}
          <ol className="relative grid gap-8 md:gap-6 md:gap-y-8 md:grid-cols-2 lg:grid-cols-4 md:px-4">
            {steps.map((step, idx) => {
              return (
                <li
                  key={step.title}
                  ref={(el) => {
                    itemsRef.current[idx] = el;
                  }}
                  className="relative flex flex-col items-center bg-white rounded-3xl shadow-xl px-6 py-10 text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl scale-100 opacity-0 animate-none mx-0 md:mx-2"
                >
                  {/* Step connector - animated line */}
                  {idx < steps.length - 1 && (
                    <span
                      className="hidden lg:block absolute right-0 top-1/2 w-16 h-1 bg-linear-to-r from-primary via-primary/40 to-transparent rounded-l-xl animate-grow-line"
                      style={{
                        left: "100%",
                        marginTop: "-0.5rem",
                        zIndex: 0,
                      }}
                    />
                  )}
                  {/* Animated step bubble */}
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-linear-to-b from-primary to-primary/80 text-white flex items-center justify-center text-xl font-extrabold border-4 border-white shadow-lg animate-pop-in drop-shadow-xl">
                    {idx + 1}
                  </span>
                  {/* Title/desc */}
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground tracking-wide drop-shadow animate-slide-in">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed animate-fade-in">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Extra keyframes for animations */}
      <style jsx global>{`
        @keyframes floatBlob {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: floatBlob 8s ease-in-out infinite;
        }
        .animate-float2 {
          animation: floatBlob 7s 1s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3.8s infinite;
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(32px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0px) !important;
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes popIn {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          80% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-pop-in {
          animation: popIn 0.8s cubic-bezier(0.76, -0.05, 0.24, 1.05) forwards;
        }
        @keyframes growLine {
          0% {
            width: 0;
            opacity: 0;
          }
          60% {
            opacity: 1;
          }
          100% {
            width: 4rem;
            opacity: 1;
          }
        }
        .animate-grow-line {
          animation: growLine 1.2s cubic-bezier(0.22, 0.68, 0, 1.71) forwards;
        }
        @keyframes inSpin {
          from {
            transform: rotate(-20deg) scale(0.91);
          }
          to {
            transform: rotate(0deg) scale(1);
          }
        }
        .animate-in-spin {
          animation: inSpin 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 1.1s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </section>
  );
}

export default HowItWorksSection;
