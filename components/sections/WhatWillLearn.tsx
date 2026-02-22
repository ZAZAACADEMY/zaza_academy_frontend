"use client";

import React from "react";
import {
  PiggyBank,
  Wallet,
  TrendingUp,
  CircleDollarSign,
  CreditCard,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "../ui/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { useTranslations } from "next-intl";

const LearnCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-[32px] rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-[16px] h-full"
  >
    <div className="w-[48px] h-[48px] rounded-[12px] bg-[#F3F0FF] flex items-center justify-center">
      {icon}
    </div>
    <div className="flex flex-col gap-[8px]">
      <h3 className="font-display font-bold text-[20px] md:text-[22px] text-brand-black leading-tight">
        {title}
      </h3>
      <p className="font-sans text-[#6B7280] text-[15px] leading-[160%]">
        {description}
      </p>
    </div>
  </motion.div>
);

export const WhatWillLearn = () => {
  const t = useTranslations("WhatWillLearn");
  const features = [
    {
      icon: (
        <PiggyBank
          size={24}
          strokeWidth={2}
          stroke="url(#learn-icon-gradient)"
        />
      ),
      title: t("features.0.title"),
      description: t("features.0.description"),
    },
    {
      icon: (
        <Wallet size={24} strokeWidth={2} stroke="url(#learn-icon-gradient)" />
      ),
      title: t("features.1.title"),
      description: t("features.1.description"),
    },
    {
      icon: (
        <TrendingUp
          size={24}
          strokeWidth={2}
          stroke="url(#learn-icon-gradient)"
        />
      ),
      title: t("features.2.title"),
      description: t("features.2.description"),
    },
    {
      icon: (
        <CircleDollarSign
          size={24}
          strokeWidth={2}
          stroke="url(#learn-icon-gradient)"
        />
      ),
      title: t("features.3.title"),
      description: t("features.3.description"),
    },
    {
      icon: (
        <CreditCard
          size={24}
          strokeWidth={2}
          stroke="url(#learn-icon-gradient)"
        />
      ),
      title: t("features.4.title"),
      description: t("features.4.description"),
    },
    {
      icon: (
        <Target size={24} strokeWidth={2} stroke="url(#learn-icon-gradient)" />
      ),
      title: t("features.5.title"),
      description: t("features.5.description"),
    },
  ];

  return (
    <section
      id="curriculum"
      className="w-full py-[60px] md:py-[100px] scroll-mt-24 relative"
      style={{
        background: "linear-gradient(180deg, #FFDAEB 0%, #FFF5C6 100%)",
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-2 md:px-16">
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <linearGradient
              id="learn-icon-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#7F26D9" />
              <stop offset="46.63%" stopColor="#C23CDD" />
              <stop offset="100%" stopColor="#DC2663" />
            </linearGradient>
          </defs>
        </svg>

        <div className="max-w-[1200px] mx-auto text-center mb-[60px]">
          <FadeIn direction="up">
            <h2 className="font-display font-bold text-[36px] md:text-[48px] text-brand-black mb-[16px] tracking-tight">
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
          <FadeIn direction="up" delay={0.2}>
            <p className="font-sans font-medium text-[#6B7280] text-[16px] md:text-[18px] max-w-[600px] mx-auto leading-[160%]">
              {t("subtitle")}
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[32px] w-full">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <LearnCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
