"use client";

import React from "react";
import { Sparkles, Crown, Users, Check, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "../ui/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { ArrowDoodle } from "../ui/Doodles";
import { FloatingElements } from "../ui/FloatingElements";
import { TiltEffect } from "../ui/motion/TiltEffect";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/navigation";
import { useGetActivePlansQuery } from "@/lib/store/services/plansApi";
import { components } from "@/lib/api/v1";

type Plan = components["schemas"]["PlanList"];

const PricingCard = ({
  plan,
  isPremium = false,
  icon: Icon,
  tLabel,
  period,
  subLabel,
  installmentNote,
  ctaLabel,
  onSelect,
}: {
  plan: Plan;
  isPremium?: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tLabel: string;
  period: string;
  subLabel: string;
  installmentNote: string;
  ctaLabel: string;
  onSelect: () => void;
}) => (
  <TiltEffect className="h-full">
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`
    relative flex flex-col p-6 md:p-8 rounded-[32px] transition-all duration-300 h-full w-full text-left
    ${
      isPremium
        ? "text-white shadow-[0px_20px_40px_-10px_rgba(168,85,247,0.4)] scale-100 lg:scale-105 z-10"
        : "bg-white border border-[#F3F4F6] text-brand-black shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] lg:hover:shadow-[0px_10px_30px_0px_rgba(0,0,0,0.06)]"
    }
  `}
      style={
        isPremium
          ? {
              background:
                "linear-gradient(180deg, #7F26D9 0%, #C23CDD 54.81%, #F25A73 108.57%)",
            }
          : {}
      }
    >
      {isPremium && (
        <div className="absolute -top-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <motion.div
            animate={{ rotate: [2, -2, 2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="bg-[#FFC107] text-[#1F2937] px-6 py-2 rounded-full font-bold font-display text-sm shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white relative top-0 left-0" />
            {tLabel}
          </motion.div>
        </div>
      )}
      <div
        className={`
      w-[60px] h-[60px] rounded-[20px] flex items-center justify-center mb-6 shadow-sm
      ${isPremium ? "bg-white text-[#8B5CF6]" : "bg-gradient-to-br from-[#A655F7] to-[#F46AA3] text-white"}
    `}
      >
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>

      <h3 className="font-display font-bold text-[28px] mb-2 leading-tight">
        {plan.name_display}
      </h3>
      <p
        className={`text-[15px] leading-[150%] mb-8 ${isPremium ? "text-white/90" : "text-[#6B7280]"}`}
      >
        {plan.description}
      </p>

      <div className="flex items-baseline gap-1 mb-1 relative">
        {isPremium && (
          <ArrowDoodle className="text-white/40 w-10 absolute -right-4 top-[-10px] rotate-[130deg]" />
        )}
        <span className="font-display font-bold text-[40px] tracking-tight">
          {`€${parseFloat(plan.price_three_months).toFixed(0)}`}
        </span>
        <span
          className={`text-[14px] font-medium ${isPremium ? "text-white/80" : "text-[#9CA3AF]"}`}
        >
          {period}
        </span>
      </div>
      <div
        className={`text-[13px] mb-6 ${isPremium ? "text-white/80" : "text-[#6B7280]"}`}
      >
        {subLabel}
      </div>

      <div
        className={`
      p-4 rounded-[16px] mb-8 w-full
      ${isPremium ? "bg-white/20 backdrop-blur-sm border border-white/20" : "bg-[#F3F0FF] border border-[#E9E5FF]"}
    `}
      >
        <p className="font-bold text-[16px] mb-1">{`€${parseFloat(plan.price_one_month).toFixed(0)} / mois`}</p>
        <p
          className={`text-[12px] ${isPremium ? "text-white/80" : "text-[#6B7280]"}`}
        >
          {installmentNote}
        </p>
      </div>

      <ul className="flex flex-col gap-4 mb-8 flex-grow w-full">
        {((plan?.features || []) as string[]).map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div
              className={`
            w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 mt-0.5
            ${isPremium ? "bg-white text-[#8B5CF6]" : "bg-white text-[#8B5CF6]"}
          `}
            >
              <Check size={14} strokeWidth={3} />
            </div>
            <span
              className={`text-[15px] font-medium leading-[140%] ${isPremium ? "text-white" : "text-[#4B5563]"}`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onSelect}
        className={`
      w-full py-4 rounded-[50px] font-bold text-[16px] transition-all duration-300 lg:hover:scale-[1.02] active:scale-[0.98]
      ${
        isPremium
          ? "bg-[#F46AA3] text-white shadow-lg lg:hover:bg-[#311F54] border border-white/20"
          : "bg-white border-2 border-[#1F2937] text-[#1F2937] lg:hover:bg-[#311F54] lg:hover:text-white lg:hover:border-[#311F54]"
      }
    `}
      >
        {ctaLabel}
      </motion.button>
    </motion.div>
  </TiltEffect>
);

export const Pricing = () => {
  const t = useTranslations("Pricing");
  const router = useRouter();
  const locale = useLocale();

  const { data: plansData, isLoading, isError } = useGetActivePlansQuery();

  const planIconMap: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {
    STANDARD: Sparkles,
    PREMIUM: Crown,
    FAMILLE: Users,
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="animate-spin text-brand-purple" size={48} />
        </div>
      );
    }

    if (isError || !plansData) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-red-50 text-red-700 rounded-2xl">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-bold mb-2">{t("errorTitle")}</h3>
          <p>{t("errorMessage")}</p>
        </div>
      );
    }

    const plans = plansData.map((plan) => ({
      ...plan,
      icon: planIconMap[plan.name] ?? Sparkles,
      isPremium: plan.name === "PREMIUM",
    }));

    return (
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] lg:gap-[32px] items-start w-full">
        {plans.map((plan, index) => (
          <StaggerItem key={index}>
            <PricingCard
              plan={plan}
              isPremium={plan.isPremium}
              icon={plan.icon}
              tLabel={t("mostPopular")}
              period={t("perQuarter")}
              subLabel={t("quarterly")}
              installmentNote={t("installmentNote")}
              ctaLabel={t("cta")}
              onSelect={() =>
                router.push(
                  `/signup?plan=${encodeURIComponent(plan.id)}`,
                  { locale },
                )
              }
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    );
  };

  return (
    <section
      className="w-full bg-brand-cream py-20 relative overflow-hidden"
      id="pricing"
    >
      <FloatingElements />
      <div className="w-full max-w-[1440px] mx-auto px-2 md:px-16 relative z-10">
        <div className="text-center mb-[60px]">
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
        {renderContent()}
      </div>
    </section>
  );
};
