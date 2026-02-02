"use client";

import React from "react";
import { TrendingUp, Heart, Lightbulb, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "../ui/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { HighlightsDoodle } from "../ui/Doodles";
import { useTranslations } from "next-intl";

const ReasonCard = ({
  icon,
  title,
  subtitle,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-[24px] rounded-[24px] border border-[#F3F4F6] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] hover:shadow-[0px_8px_30px_0px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col items-start gap-[16px] h-full"
  >
    <div className="w-[48px] h-[48px] rounded-[16px] bg-[#F3F0FF] flex items-center justify-center">
      {icon}
    </div>
    <div className="flex flex-col gap-[8px]">
      <h3
        className="font-display font-bold text-[28px] leading-tight"
        style={{
          background:
            "linear-gradient(90deg, #7F26D9 0%, #C23CDD 46.63%, #DC2663 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {title}
      </h3>
      <h4 className="font-sans font-bold text-[18px] text-brand-black leading-tight">
        {subtitle}
      </h4>
    </div>
    <p className="font-sans text-[#6B7280] text-[15px] leading-[160%]">
      {description}
    </p>
  </motion.div>
);

export const WhyZaza = () => {
  const t = useTranslations("WhyZaza");
  const gradientId = "whyzaza-icon-gradient";
  const reasons = [
    {
      icon: (
        <TrendingUp
          size={24}
          strokeWidth={2.5}
          stroke={`url(#${gradientId})`}
        />
      ),
      title: t("reasons.0.title"),
      subtitle: t("reasons.0.subtitle"),
      description: t("reasons.0.description"),
    },
    {
      icon: (
        <Heart size={24} strokeWidth={2.5} stroke={`url(#${gradientId})`} />
      ),
      title: t("reasons.1.title"),
      subtitle: t("reasons.1.subtitle"),
      description: t("reasons.1.description"),
    },
    {
      icon: (
        <Lightbulb size={24} strokeWidth={2.5} stroke={`url(#${gradientId})`} />
      ),
      title: t("reasons.2.title"),
      subtitle: t("reasons.2.subtitle"),
      description: t("reasons.2.description"),
    },
    {
      icon: (
        <Wallet size={24} strokeWidth={2.5} stroke={`url(#${gradientId})`} />
      ),
      title: t("reasons.3.title"),
      subtitle: t("reasons.3.subtitle"),
      description: t("reasons.3.description"),
    },
  ];

  return (
    <section
      id="about"
      className="w-full bg-brand-cream py-20 md:py-32 scroll-mt-24 relative"
    >
      <div className="w-full max-w-[1440px] mx-auto px-2 md:px-16">
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7F26D9" />
              <stop offset="46.63%" stopColor="#C23CDD" />
              <stop offset="100%" stopColor="#DC2663" />
            </linearGradient>
          </defs>
        </svg>
        <div className="text-center mb-[60px]">
          <FadeIn direction="up">
            <h2 className="font-display font-bold text-[36px] md:text-[48px] text-brand-black mb-[16px] tracking-tight relative inline-block">
              {t("title")}{" "}
              <span
                className="relative inline-block"
                style={{
                  background:
                    "linear-gradient(90deg, #7F26D9 0%, #C23CDD 46.63%, #DC2663 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {t("titleAccent")}
                <HighlightsDoodle className="absolute -top-6 -right-8 w-8 h-8 text-[#FFD700] rotate-12" />
              </span>
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="font-sans font-medium text-[#6B7280] text-[16px] md:text-[18px] max-w-[720px] mx-auto leading-[160%]">
              {t("intro")}
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {reasons.map((reason, index) => (
            <StaggerItem key={index}>
              <ReasonCard {...reason} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
