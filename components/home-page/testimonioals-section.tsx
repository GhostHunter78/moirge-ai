import { useEffect, useState } from "react";
import { Profile } from "@/types/user-profile";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  context: "buyer" | "seller" | "both";
  highlight: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Amelia Carter",
    role: "Fashion Lover • Buyer",
    quote:
      "“I stopped second-guessing every purchase. The AI try-on feels like looking in a smart mirror — I actually enjoy online shopping again.”",
    context: "buyer",
    highlight: "Virtual try-on made online shopping feel human again.",
  },
  {
    name: "Jason Miller",
    role: "Streetwear Seller",
    quote:
      "“I launched my shop with no studio, no camera, nothing. The AI generated images and descriptions in minutes and my first drop sold out in a week.”",
    context: "seller",
    highlight: "AI listings helped me launch faster and sell out quicker.",
  },
  {
    name: "Sophia Nguyen",
    role: "Busy Professional • Buyer",
    quote:
      "“I don’t have hours to scroll. The recommendations are shockingly accurate — it feels like the platform already knows my style.”",
    context: "buyer",
    highlight: "Smart recommendations save me time every single week.",
  },
  {
    name: "David Romero",
    role: "Boutique Owner • Seller",
    quote:
      "“Analytics used to be guesswork. Now I see exactly what buyers react to and adjust my collections with confidence.”",
    context: "seller",
    highlight: "Real-time insights guide every decision I make.",
  },
  {
    name: "Lena & Max",
    role: "Partners • Buyer & Seller",
    quote:
      "“One of us shops, one of us sells — and the platform feels perfectly built for both. Trust, speed, and a genuinely fun experience.”",
    context: "both",
    highlight: "A single platform that treats buyers and sellers as a team.",
  },
];

function getRelevantTestimonials(userInfo: Profile | null) {
  const role = userInfo?.role;

  if (role === "buyer") {
    return testimonials.filter(
      (t) => t.context === "buyer" || t.context === "both"
    );
  }

  if (role === "seller") {
    return testimonials.filter(
      (t) => t.context === "seller" || t.context === "both"
    );
  }

  return testimonials;
}

function TestimonialsSection({ userInfo }: { userInfo: Profile | null }) {
  const items = getRelevantTestimonials(userInfo);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goTo = (index: number) => {
    const total = items.length;
    const nextIndex = ((index % total) + total) % total;
    setActiveIndex(nextIndex);
  };

  const handleNext = () => goTo(activeIndex + 1);
  const handlePrev = () => goTo(activeIndex - 1);

  useEffect(() => {
    if (items.length <= 1) return;

    const id = setInterval(() => {
      if (!isHovered) {
        setActiveIndex(
          (prev) => (((prev + 1) % items.length) + items.length) % items.length
        );
      }
    }, 7000);

    return () => clearInterval(id);
  }, [items.length, isHovered]);

  if (!items.length) return null;

  return (
    <section
      className="relative w-full py-20 px-4 sm:px-8 md:px-12 lg:px-20 overflow-x-clip"
      style={{
        background:
          "linear-gradient(135deg, #f5f7fa 0%, #eaeffc 60%, #dbeafe 100%)",
      }}
    >
      {/* Decorative background layer */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-0 w-80 h-80 rounded-full bg-linear-to-br from-[#bacafe]/60 via-[#e6d1ff]/30 to-transparent blur-3xl opacity-60" />
        <div className="absolute right-0 bottom-[-120px] w-[420px] h-[420px] rounded-full bg-linear-to-tl from-[#fcefff]/70 via-[#bee2ff]/50 to-transparent blur-3xl opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#d4e8ff]/50 via-transparent to-transparent opacity-80" />
      </div>
      <div className="max-w-[1800px] mx-auto relative">
        <img
          src="/images/hat-asset.png"
          alt="Testimonials Section Asset"
          className="absolute top-[-160px] left-[50px] sm:left-[100px] md:top-[-150px] md:left-[150px] lg:top-[-100px] lg:left-[0] w-[300px] object-contain"
        />

        <div className="max-w-[1400px] mx-auto relative">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between mb-12">
            <div className="max-w-xl space-y-5 text-center lg:text-left">
              <span className="inline-block px-4 py-1 rounded-full bg-linear-to-r from-primary/10 to-secondary/10 text-primary text-xs font-bold tracking-widest uppercase shadow-sm">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight drop-shadow-sm">
                Loved by{" "}
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  buyers
                </span>{" "}
                &amp;{" "}
                <span className="bg-linear-to-r from-secondary to-primary bg-clip-text text-transparent">
                  sellers
                </span>
                .
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Real stories from people who use AI to shop smarter, sell
                faster, and build more trust in every interaction.
              </p>
              <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground/90">
                <div className="flex -space-x-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary border border-white shadow-sm">
                    J
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-xs font-semibold text-blue-500 border border-white shadow-sm">
                    D
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316]/10 text-xs font-semibold text-[#f97316] border border-white shadow-sm">
                    L
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Join thousands of users trusting our AI to power every
                  transaction.
                </p>
              </div>
            </div>

            <div className="relative w-full max-w-xl">
              <div
                className="group relative rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/70 px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Accent linear ring */}
                <div className="pointer-events-none absolute -right-24 -top-24 w-64 h-64 rounded-full bg-linear-to-br from-primary/20 via-secondary/20 to-transparent blur-2xl opacity-60" />

                {/* Carousel track */}
                <div className="relative overflow-hidden pb-6 sm:pb-8">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${activeIndex * 100}%)`,
                    }}
                  >
                    {items.map((item, index) => (
                      <article
                        key={item.name + item.role}
                        className="w-full shrink-0 pr-4 sm:pr-6"
                      >
                        <div className="flex items-start gap-4 sm:gap-5 mb-4 sm:mb-6">
                          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-white font-semibold shadow-lg">
                            <span>
                              {item.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                            <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary shadow-md">
                              ★
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm uppercase tracking-[0.18em] text-primary/80 font-semibold">
                              {index + 1} of {items.length}
                            </p>
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                              {item.name}
                            </h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                              {item.role}
                            </p>
                          </div>
                        </div>

                        <p className="text-base sm:text-lg text-foreground/90 leading-relaxed mb-4 sm:mb-5">
                          {item.quote}
                        </p>
                        <p className="text-sm sm:text-base text-primary/90 font-medium bg-primary/5 inline-flex rounded-full px-4 py-1.5">
                          {item.highlight}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-muted-foreground/10 bg-white text-muted-foreground hover:text-primary hover:border-primary/30 shadow-sm transition-colors"
                      aria-label="Previous testimonial"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-muted-foreground/10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-colors"
                      aria-label="Next testimonial"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {items.map((item, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={item.name + index}
                          type="button"
                          onClick={() => goTo(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isActive
                              ? "w-6 bg-primary"
                              : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                          }`}
                          aria-label={`Go to testimonial ${index + 1}`}
                          aria-current={isActive ? "true" : "false"}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
