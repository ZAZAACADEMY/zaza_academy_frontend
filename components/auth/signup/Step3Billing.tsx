"use client";
import React from "react";
import { Circle, CheckCircle2, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useSignup } from "./SignupContext";
import { PaymentFrequency } from "./types";
import { useTranslations } from "next-intl";
import { useGetPlanByIdQuery } from "@/lib/store/services/plansApi";

export const Step3Billing = () => {
  const { selectedPlan, paymentFrequency, setPaymentFrequency, setStep } = useSignup();
  const t = useTranslations("Signup.step3");

  const { data: plan, isLoading, isError } = useGetPlanByIdQuery(selectedPlan, {
    skip: !selectedPlan, // Don't fetch if no plan is selected
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin text-brand-purple" size={32} />
        </div>
      );
    }

    if (isError || !plan) {
      return (
        <div className="flex flex-col items-center justify-center h-48 bg-red-50 text-red-700 rounded-2xl p-4">
          <AlertTriangle className="w-10 h-10 mb-4" />
          <h3 className="text-lg font-bold mb-2 text-center">{t("errorTitle")}</h3>
          <p className="text-center text-sm">{t("errorMessage")}</p>
        </div>
      );
    }
    
    const priceMonthly = parseFloat(plan.price_one_month);
    const priceQuarterly = parseFloat(plan.price_three_months);
    const totalMonthlyForQuarter = priceMonthly * 3;
    const savings = totalMonthlyForQuarter - priceQuarterly;
    const savingsPercent = Math.round((savings / totalMonthlyForQuarter) * 100);

    const frequencies: {
      id: PaymentFrequency;
      label: string;
      price: string;
      save?: string;
    }[] = [
      {
        id: "Monthly",
        label: t("monthly"),
        price: `€${priceMonthly.toFixed(0)} / ${t("perMonth")}`,
      },
      {
        id: "Quarterly",
        label: t("quarterly"),
        price: `€${priceQuarterly.toFixed(0)} / ${t("perQuarter")}`,
        save: t("save", { percent: savingsPercent }),
      },
    ];

    return (
      <div className="flex flex-col gap-3">
        {frequencies.map((freq) => {
          const isSelected = paymentFrequency === freq.id;
          return (
            <div
              key={freq.id}
              onClick={() => setPaymentFrequency(freq.id)}
              className={`relative px-6 py-5 rounded-[20px] border-2 cursor-pointer transition-all duration-200 flex items-center justify-between
                ${isSelected ? "border-[#A655F7] bg-[#F3F0FF]/30 shadow-sm" : "border-gray-100 bg-white hover:border-[#A655F7]/30"}
              `}
            >
              <div className="flex items-center gap-4">
                {isSelected ? (
                  <CheckCircle2
                    className="text-[#A655F7] fill-[#F3F0FF]"
                    size={24}
                  />
                ) : (
                  <Circle className="text-gray-300" size={24} />
                )}
                <div>
                  <h3 className="font-bold text-brand-black">{freq.label}</h3>
                  {freq.save && (
                    <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full mt-1 inline-block">
                      {freq.save}
                    </span>
                  )}
                </div>
              </div>
              <span className="font-bold text-lg text-brand-gray">
                {freq.price}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {renderContent()}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setStep(2)}
          className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={isLoading || isError}
          className="flex-1 bg-brand-dark text-white font-bold text-[16px] rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {t("next")} <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>
    </div>
  );
};
