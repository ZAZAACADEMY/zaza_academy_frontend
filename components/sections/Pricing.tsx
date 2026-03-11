"use client";

import React from "react";
import { Sparkles, Crown, Users, Check } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "../ui/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { ArrowDoodle } from "../ui/Doodles";
import { FloatingElements } from "../ui/FloatingElements";
import { TiltEffect } from "../ui/motion/TiltEffect";
import { useTranslations, useMessages, useLocale } from "next-intl";
import { usePageTransition } from "../ui/PageTransition";
import { useGetActivePlansQuery } from "@/lib/store/services/plansApi";
import { components } from "@/lib/api/v1";

type Plan = components["schemas"]["PlanList"];

interface StaticPlan {
  planId: string;
  title: string;
  description: string;
  /** Quarterly price string from translations, e.g. "199 $" – shown while API loads */
  price?: string;
  /** Installment label from translations – shown while API loads */
  installment?: string;
  features: string[];
  icon: string;
  mostPopular?: boolean;
}

const PLAN_ORDER: Record<string, number> = {
  STANDARD: 0,
  PREMIUM: 1,
  FAMILLE: 2,
};

const iconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  sparkles: Sparkles,
  crown: Crown,
  users: Users,
};

// ─── Shimmer placeholder ─────────────────────────────────────────────────────
const PriceSkeleton = ({ isPremium }: { isPremium: boolean }) => (
  <span
    className={`inline-block h-11 w-28 rounded-xl animate-pulse ${
      isPremium ? "bg-white/20" : "bg-gray-200"
    }`}
  />
);

// ─── Pricing card ─────────────────────────────────────────────────────────────
const PricingCard = ({
  staticPlan,
  apiPlan,
  isLoadingPrice,
  isPremium = false,
  tLabel,
  period,
  subLabel,
  installmentNote,
  installmentLabel,
  perMonth,
  ctaLabel,
  onSelect,
}: {
  staticPlan: StaticPlan;
  apiPlan?: Plan;
  isLoadingPrice?: boolean;
  isPremium?: boolean;
  tLabel: string;
  period: string;
  subLabel: string;
  installmentNote: string;
  installmentLabel: (amount: string) => string;
  perMonth: string;
  ctaLabel: string;
  onSelect: () => void;
}) => {
  const Icon = iconMap[staticPlan.icon] ?? Sparkles;

  // Use live API prices when available, fall back to static translation prices
  const quarterlyPrice = apiPlan
    ? "$" +
      parseFloat(apiPlan.price_three_months).toFixed(2).replace(/\.00$/, "")
    : (staticPlan.price ?? null);

  const monthlyAmountStr = apiPlan
    ? "$" + parseFloat(apiPlan.price_one_month).toFixed(2).replace(/\.00$/, "")
    : null;

  const monthlyLineText = monthlyAmountStr
    ? installmentLabel(monthlyAmountStr)
    : (staticPlan.installment ?? null);

  const monthlyRightText = monthlyAmountStr
    ? `${monthlyAmountStr}${perMonth}`
    : null;

  return (
    <TiltEffect className="h-full">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={`
          relative flex flex-col p-6 md:p-8 rounded-4xl transition-all duration-300 h-full w-full text-left
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
          className={`w-15 h-15 rounded-[20px] flex items-center justify-center mb-6 shadow-sm
            ${isPremium ? "bg-white text-[#8B5CF6]" : "bg-linear-to-br from-[#A655F7] to-[#F46AA3] text-white"}`}
        >
          <Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>

        <h3 className="font-display font-bold text-[28px] mb-2 leading-tight">
          {staticPlan.title}
        </h3>
        <p
          className={`text-[15px] leading-[150%] mb-6 ${isPremium ? "text-white/90" : "text-[#6B7280]"}`}
        >
          {staticPlan.description}
        </p>

        {/* Quarterly price */}
        <div className="flex items-baseline gap-1 mb-1 relative">
          {isPremium && (
            <ArrowDoodle className="text-white/40 w-10 absolute -right-4 -top-2.5 rotate-130" />
          )}
          {isLoadingPrice && !quarterlyPrice ? (
            <PriceSkeleton isPremium={isPremium} />
          ) : (
            <span className="font-display font-bold text-[40px] tracking-tight">
              {quarterlyPrice}
            </span>
          )}
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

        {/* Installment box */}
        <div
          className={`p-4 rounded-2xl mb-8 w-full
            ${isPremium ? "bg-white/20 backdrop-blur-sm border border-white/20" : "bg-[#F3F0FF] border border-[#E9E5FF]"}`}
        >
          <div className="flex items-baseline justify-between gap-2 mb-1">
            {isLoadingPrice && !monthlyLineText ? (
              <span
                className={`inline-block h-4 w-36 rounded animate-pulse ${isPremium ? "bg-white/20" : "bg-gray-200"}`}
              />
            ) : (
              <p className="font-bold text-[15px]">{monthlyLineText}</p>
            )}
            {monthlyRightText && (
              <span
                className={`font-bold text-[16px] whitespace-nowrap ${isPremium ? "text-white" : "text-brand-purple"}`}
              >
                {monthlyRightText}
              </span>
            )}
          </div>
          <p
            className={`text-[12px] ${isPremium ? "text-white/80" : "text-[#6B7280]"}`}
          >
            {installmentNote}
          </p>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-4 mb-8 grow w-full">
          {staticPlan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-white text-[#8B5CF6]">
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
};

// ─── Main section ─────────────────────────────────────────────────────────────
export const Pricing = () => {
  const t = useTranslations("Pricing");
  const messages = useMessages();
  const locale = useLocale();
  const { navigateTo } = usePageTransition();

  // Fetch with generous staleTime — plan prices rarely change
  const { data: plansData, isLoading } = useGetActivePlansQuery();

  // Static plan data is bundled in JS — available instantly, no network needed
  const staticPlans = ((messages as any).Pricing?.plans ?? []) as StaticPlan[];

  // Sort the static plans so we always render in the right order immediately
  const sortedStaticPlans = [...staticPlans].sort(
    (a, b) => (PLAN_ORDER[a.planId] ?? 99) - (PLAN_ORDER[b.planId] ?? 99),
  );

  // Build a lookup from the API response (available after fetch)
  const apiPlanByName = Object.fromEntries(
    (plansData ?? []).map((p) => [p.name, p]),
  );

  return (
    <section
      className="w-full bg-brand-cream py-20 relative overflow-hidden scroll-mt-24"
      id="pricing"
    >
      <FloatingElements />
      <div className="w-full max-w-360 mx-auto px-5 md:px-16 relative z-10">
        <div className="text-center mb-15">
          <FadeIn direction="up">
            <h2 className="font-display font-bold text-[36px] md:text-[48px] text-brand-black mb-4 tracking-tight">
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
            <p className="font-sans font-medium text-[#6B7280] text-[16px] md:text-[18px] max-w-150 mx-auto leading-[160%]">
              {t("subtitle")}
            </p>
          </FadeIn>
        </div>

        {/* Always render cards — static first, then enriched with API data */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start w-full">
          {sortedStaticPlans.map((staticPlan, index) => {
            const apiPlan = apiPlanByName[staticPlan.planId];
            const isPremium = staticPlan.planId === "PREMIUM";

            return (
              <StaggerItem key={staticPlan.planId}>
                <PricingCard
                  staticPlan={staticPlan}
                  apiPlan={apiPlan}
                  isLoadingPrice={isLoading}
                  isPremium={isPremium}
                  tLabel={t("mostPopular")}
                  period={t("perQuarter")}
                  subLabel={t("quarterly")}
                  installmentNote={t("installmentNote")}
                  installmentLabel={(amount) =>
                    t("installmentLabel", { amount })
                  }
                  perMonth={t("perMonth")}
                  ctaLabel={t("cta")}
                  onSelect={() => {
                    const planParam = apiPlan?.id
                      ? `?plan=${encodeURIComponent(apiPlan.id)}`
                      : "";
                    navigateTo(`/signup${planParam}`, { locale });
                  }}
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};
