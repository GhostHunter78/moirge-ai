import { useState } from "react";
import { useTranslations } from "next-intl";

const faqs = [
  {
    question:
      "What makes this platform different from regular ecommerce sites?",
    answer:
      "Our platform uses advanced AI to provide tailored product recommendations and instant virtual try-on for buyers, while sellers enjoy AI-powered tools to generate listings, images, and descriptions effortlessly. This results in a smarter, more secure, and engaging experience.",
  },
  {
    question: "Is my data and shopping activity safe on this platform?",
    answer:
      "Absolutely. We use industry-leading security protocols—your data is encrypted and never shared with third parties. Transactions are protected and all sellers are verified for added peace of mind.",
  },
  {
    question: "How does the virtual try-on feature work?",
    answer:
      "Our AI analyzes garment images and your inputs to create a realistic simulation, so you instantly see how an item fits or looks on you before you buy. No special equipment or uploads required!",
  },
  {
    question: "What if I have an issue with my order or listing?",
    answer:
      "Our dedicated support team is here to help. Simply contact us through the Help Center or live chat, and we’ll resolve your issue as quickly as possible.",
  },
];

function FaqSection() {
  const t = useTranslations("homePage.faqSection");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 px-5 sm:px-10 md:px-20 bg-linear-to-b from-[#f7faff] to-[#f3f7fc] overflow-x-clip">
      <div className="w-full h-full bg-linear-to-br from-[#e6edfc] via-[#f8e5f6] to-[#d8dffd] opacity-95" />
      <div className="absolute left-0 top-0 w-[420px] h-[420px] bg-linear-to-br from-[#9bc2fa]/70 to-[#e9e7fc]/0 rounded-full blur-2xl opacity-80 animate-pulse" />
      <div className="absolute right-0 bottom-0 w-[370px] h-[370px] bg-linear-to-br from-[#d6a8ff]/80 to-transparent rounded-full blur-2xl opacity-80" />
      <div className="max-w-[1800px] mx-auto relative">
        <img
          src="/images/faq-section-asset.png"
          alt="Features Section Title"
          className="absolute top-[100px] left-0 w-[800px] h-[800px] object-contain"
        />
        <img
          src="/images/trousers-asset.png"
          alt="Features Section Title"
          className="absolute top-[-300px] right-[-90px] object-contain"
        />
        <div className="max-w-2xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-linear-to-r from-primary/10 to-secondary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3 shadow transition-colors duration-200">
              {t("badge")}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 drop-shadow-lg leading-tight">
              {t("heading")}
            </h2>
          </div>
          <div className="space-y-5 rounded-2xl bg-white/60 shadow-xl px-2 sm:px-10 py-8 backdrop-blur-xl">
            {faqs.map((faq, idx) => (
              <div
                key={faq.question}
                className={`faq-item group transition-all duration-300 border-b border-muted-foreground/15 pb-4 last:border-b-0`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="flex items-center justify-between w-full text-left py-2 px-2 focus:outline-none"
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`ml-4 transition-transform duration-300 ease-in-out ${
                      openIndex === idx
                        ? "rotate-90 text-primary"
                        : "rotate-0 text-muted-foreground"
                    }`}
                  >
                    <svg
                      width={22}
                      height={22}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="inline"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === idx
                      ? "opacity-100 max-h-40 mt-2"
                      : "opacity-0 max-h-0 mt-0 pointer-events-none"
                  }`}
                  style={{
                    transitionProperty: "opacity, max-height, margin-top",
                  }}
                  aria-hidden={openIndex !== idx}
                >
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed px-2 pb-2">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
