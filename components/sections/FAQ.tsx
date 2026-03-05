"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "../ui/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { useTranslations } from "next-intl";

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.02)] transition-all duration-300">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-display font-bold text-[18px] md:text-[20px] text-brand-black">
          {question}
        </span>
        <div
          className={`w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-[#A655F7] text-white" : "bg-[#F3F0FF] text-[#A655F7]"}`}
        >
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>

      <div
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[200px] opacity-100 pb-6" : "max-h-0 opacity-0"}`}
      >
        <p className="text-[#6B7280] font-sans leading-[160%]">{answer}</p>
      </div>
    </div>
  );
};

export const FAQ = () => {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  type FAQMessage = {
    question: string;
    answer: string;
  };

  const faqs: FAQMessage[] = t.raw("items") as FAQMessage[];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="w-full bg-[#FFF5F9] py-20 md:py-32 my-10 scroll-mt-24"
      id="faq"
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">
        {/* Left Column: Title */}
        <div className="w-full lg:w-1/3 sticky top-24">
          <FadeIn direction="right">
            <h2 className="font-display font-bold text-[36px] md:text-[48px] text-brand-black mb-[16px] leading-[110%]">
              {t.rich("title", {
                accent: (chunks) => (
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #7F26D9 0%, #C23CDD 46.63%, #DC2663 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {chunks}
                  </span>
                ),
              })}
            </h2>
          </FadeIn>
          <FadeIn direction="right" delay={0.2}>
            <p className="font-sans font-medium text-[#6B7280] text-[16px] md:text-[18px] leading-[160%]">
              {t("subtitle")}
            </p>
          </FadeIn>
        </div>

        {/* Right Column: Accordion */}
        <StaggerContainer className="w-full lg:w-2/3 flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <StaggerItem key={index}>
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
