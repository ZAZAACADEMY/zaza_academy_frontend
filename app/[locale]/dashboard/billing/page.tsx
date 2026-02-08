"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Crown,
  Download,
  HelpCircle,
  Sparkles,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { ContactModal } from "@/components/ui/ContactModal";
import { motion, AnimatePresence } from "framer-motion";

// Define strict props for Lucide icons to avoid TS errors
type LucideIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

type PlanMessage = {
  title: string;
  description: string;
  price: string;
  installment: string;
  features: string[];
  icon?: string;
  mostPopular?: boolean;
};

const planIconMap: Record<string, React.ComponentType<LucideIconProps>> = {
  sparkles: Sparkles,
  crown: Crown,
  users: Users,
};

type PricingPlan = Omit<PlanMessage, "icon"> & {
  icon: React.ComponentType<LucideIconProps>;
  isPopular: boolean;
};

const PlanCard = ({
  plan,
  mostPopularLabel,
  periodLabel,
  installmentNote,
  ctaLabel,
  subscriptionLabel,
}: {
  plan: PricingPlan;
  mostPopularLabel: string;
  periodLabel: string;
  installmentNote: string;
  ctaLabel: string;
  subscriptionLabel: string;
}) => {
  const Icon = plan.icon;
  return (
    <div className="h-full rounded-[32px] bg-white border border-[#E0E0E0] p-8 flex flex-col gap-6 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Icon */}
      <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#A655F7] to-[#F46AA3] flex items-center justify-center text-white shadow-lg mb-2">
        <Icon size={32} strokeWidth={1.5} />
      </div>

      {/* Title & Desc */}
      <div>
        <h3 className="text-3xl font-display font-bold text-[#1F1235] mb-2">
          {plan.title}
        </h3>
        <p className="text-[#6B7280] text-sm leading-relaxed">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-display font-bold text-[#1F1235]">
            {plan.price}
          </span>
          <span className="text-gray-500 text-sm font-medium">
            {periodLabel}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{subscriptionLabel}</p>
      </div>

      {/* Installment Box */}
      <div className="bg-[#F3F0FF] rounded-xl p-4 border border-[#E9E5FF]">
        <p className="text-[#1F1235] font-bold text-lg">{plan.installment}</p>
        <p className="text-[#6B7280] text-sm mt-1">{installmentNote}</p>
      </div>

      {/* Features */}
      <ul className="space-y-4">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="rounded-full bg-[#8B5CF6] text-white p-1 shrink-0 mt-0.5">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-[#374151] text-sm font-medium">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button className="mt-auto w-full py-4 rounded-full border-2 border-[#1F1235] text-[#1F1235] font-bold text-base hover:bg-[#1F1235] hover:text-white transition-colors">
        {ctaLabel}
      </button>
    </div>
  );
};

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-[#1F1235] font-bold text-base">{question}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-[#7F26D9]" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-[#E5E7EB] pt-4 mt-[-4px]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function BillingPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const t = useTranslations("DashboardBilling");
  const tPricing = useTranslations("Pricing");
  const locale = useLocale();

  // Safety check for faqItems
  const rawFaqItems = t.raw("faqItems");
  const faqItems = Array.isArray(rawFaqItems)
    ? (rawFaqItems as { question: string; answer: string }[])
    : [];

  const plans = (tPricing.raw("plans") as PlanMessage[]).map((plan) => {
    const Icon = plan.icon ? planIconMap[plan.icon] || Sparkles : Sparkles;
    return {
      ...plan,
      icon: Icon,
      isPopular: Boolean(plan.mostPopular),
    } satisfies PricingPlan;
  });

  // Filter to show only plans above the current plan price
  const currentPriceNumber = 199; // default current plan price
  const higherPlans = plans.filter((plan) => {
    const numeric = Number((plan.price || "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) && numeric > currentPriceNumber;
  });

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-8 bg-[#F5F2FF] min-h-screen">
      <Link
        href={`/${locale}/dashboard`}
        className="inline-flex items-center gap-2 text-[#7F26D9] font-semibold hover:underline"
      >
        <ArrowLeft size={18} />
        <span>{t("back")}</span>
      </Link>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="relative rounded-[28px] border border-[#C6B8FF] bg-gradient-to-br from-[#F7F2FF] via-[#FCEFFE] to-[#F5F2FF] shadow-[0_20px_60px_-28px_rgba(65,41,101,0.4)] p-6 md:p-8 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6), transparent 35%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.7), transparent 30%)",
            }}
          />
          <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#2F1B4B] text-white text-xs font-semibold shadow-sm">
                  {t("statusActive")}
                </span>
                <span className="px-3 py-1 rounded-full bg-white text-[#7F26D9] text-xs font-semibold border border-[#E0D4FF] shadow-sm">
                  {t("popular")}
                </span>
              </div>
              <div>
                <h1 className="text-4xl md:text-[40px] font-display font-bold text-[#1F1235]">
                  Standard
                </h1>
                <p className="text-sm text-gray-700">Most Popular</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl md:text-5xl font-display font-bold text-[#1F1235] leading-none">
                $199
              </div>
              <div className="text-sm text-gray-600">
                {tPricing("perQuarter")}
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-white/80 border border-[#E7DFFF] shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{t("nextBilling")}</p>
              <p className="text-sm font-semibold text-[#1F1235]">
                February 17, 2026
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-[#E7DFFF] shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{t("paymentMethod")}</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1F1235]">
                <CreditCard size={16} />
                <span>{t("paymentMethodMasked")}</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-[#E7DFFF] shadow-sm">
              <p className="text-xs text-gray-500 mb-1">
                {t("installmentStatus")}
              </p>
              <p className="text-sm font-semibold text-[#7F26D9]">
                2 of 3 payments completed
              </p>
              <p className="text-xs text-[#7F26D9] text-right">
                {t("remaining", { amount: "$52" })}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-700">{t("progressLabel")}</p>
            <div className="h-2 w-full rounded-full bg-[#E7DFFF] overflow-hidden">
              <div
                className="h-full w-[72%] bg-gradient-to-r from-[#7F26D9] via-[#AC77F2] to-[#E6A1FF]"
                aria-hidden
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{t("nextInstallment", { date: "March 10, 2026" })}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <button className="w-full md:flex-1 px-6 py-3 rounded-full bg-white text-[#1F1235] font-semibold border border-[#E0DEFA] hover:bg-[#F4F2FF] transition shadow-sm">
              {t("updatePayment")}
            </button>
            <button className="w-full md:flex-1 px-6 py-3 rounded-full bg-[#F25A73] text-white font-semibold shadow hover:bg-[#E64E66] transition">
              {t("cancel")}
            </button>
          </div>
        </div>

        <div className="rounded-[20px] bg-white border border-[#E7DFFF] shadow-sm p-5 md:p-6">
          <h2 className="text-lg font-display font-bold text-[#1F1235] mb-4">
            {t("usageTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Children Usage */}
            <div className="rounded-2xl bg-[#EFE9FF] p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={64} className="text-[#7F26D9]" />
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1">
                {t("childrenActive")}
              </p>
              <div className="flex items-end gap-2 mb-3">
                <p className="text-3xl font-display font-bold text-[#1F1235]">
                  2
                </p>
                <p className="text-sm text-gray-500 mb-1.5 font-medium">/ 3</p>
              </div>
              <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden">
                <div className="h-full bg-[#7F26D9] w-[66%] rounded-full" />
              </div>
            </div>

            {/* Videos Usage */}
            <div className="rounded-2xl bg-[#E9E9FF] p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={64} className="text-[#5B4AF0]" />
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1">
                {t("videosWatched")}
              </p>
              <p className="text-3xl font-display font-bold text-[#1F1235]">
                24
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/60 text-[10px] font-bold text-[#5B4AF0]">
                <Sparkles size={10} /> Top 10%
              </div>
            </div>

            {/* Live Usage */}
            <div className="rounded-2xl bg-[#F0F2FF] p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <Crown size={64} className="text-[#2F6BEB]" />
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1">
                {t("liveSessions")}
              </p>
              <p className="text-3xl font-display font-bold text-[#1F1235]">
                8
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/60 text-[10px] font-bold text-[#2F6BEB]">
                <Check size={10} strokeWidth={3} /> On track
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-display font-bold text-[#1F1235]">
              {t("plansTitle")}
            </h2>
            <p className="text-sm text-gray-600">{t("plansSubtitle")}</p>
            <p className="text-xs text-gray-500 mt-1">{t("upgradeOnly")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {higherPlans.map((plan, index) => (
            <PlanCard
              key={`${plan.title}-${index}`}
              plan={plan}
              mostPopularLabel={tPricing("mostPopular")}
              periodLabel={tPricing("perQuarter")}
              installmentNote={tPricing("installmentNote")}
              ctaLabel={tPricing("cta")}
              subscriptionLabel={tPricing("quarterly")}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6 max-w-6xl mx-auto">
        {/* Billing History Card */}
        <div className="rounded-[32px] bg-white border border-[#E5E7EB] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-display font-bold text-[#1F1235]">
              {t("historyTitle")}
            </h3>
          </div>
          <div className="space-y-4">
            {["January 17, 2026", "December 17, 2025", "November 17, 2025"].map(
              (date, idx) => (
                <div
                  key={date}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#F3F0FF] flex items-center justify-center text-[#7F26D9] shrink-0">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#1F1235] text-[15px]">
                        Family Plan - Monthly
                      </p>
                      <p className="text-sm text-gray-500">{date}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div>
                      <p className="font-bold text-[#1F1235] mb-1">$39</p>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold">
                        {t("historyPaid")}
                      </span>
                    </div>
                    <button className="text-xs text-gray-500 hover:text-[#7F26D9] flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100 transition-all">
                      <Download size={14} />
                      {t("downloadInvoice")}
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Need Help Card */}
        <div className="rounded-[24px] border border-[#E9D5FF] bg-[#FAF5FF] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1 shrink-0 text-[#1F1235]">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1F1235] mb-1">
                {t("needHelp")}
              </h4>
              <p className="text-[#4B5563] text-sm md:text-base leading-relaxed">
                {t("supportCopy")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="whitespace-nowrap px-8 py-3 rounded-full bg-white text-[#1F1235] font-bold shadow-sm border border-[#E5E7EB] hover:shadow-md hover:border-[#D1D5DB] transition-all"
          >
            {t("contactSupport")}
          </button>
        </div>

        {/* FAQ Section */}
        <div className="rounded-[32px] bg-white border border-[#E5E7EB] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#F3F0FF] rounded-lg text-[#7F26D9]">
              <HelpCircle size={24} />
            </div>
            <h3 className="text-2xl font-display font-bold text-[#1F1235]">
              {t("faqTitle")}
            </h3>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </section>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
