"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSignup } from "./SignupContext";

import { useGetPlanByIdQuery } from "@/lib/store/services/plansApi";
import { Loader2 } from "lucide-react";

export const Step4Review = () => {
  const { setStep, selectedPlan, paymentFrequency } = useSignup();
  const t = useTranslations("Signup.step4");

  const { data: plan, isLoading } = useGetPlanByIdQuery(selectedPlan, {
    skip: !selectedPlan,
  });

  const { displayPlan, displayBilling, displayTotal } = React.useMemo(() => {
    if (!plan) return { displayPlan: "...", displayBilling: "...", displayTotal: "..." };

    const price = paymentFrequency === 'Monthly' ? plan.price_one_month : plan.price_three_months;
    const freqLabel = paymentFrequency === 'Monthly' ? t('billingMonthly') : t('billingQuarterly');
    
    return {
      displayPlan: plan.name_display,
      displayBilling: freqLabel,
      displayTotal: `€${parseFloat(price).toFixed(2)}`,
    };
  }, [plan, paymentFrequency, t]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#FAFAFA] rounded-[24px] p-6 border border-gray-100">
        <h3 className="font-display font-bold text-lg mb-4 text-brand-black">
          {t("title")}
        </h3>
        {isLoading ? (
           <div className="flex justify-center items-center h-24">
             <Loader2 className="animate-spin text-brand-purple" />
           </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{t("plan")}</span>
              <span className="font-bold text-brand-black">{displayPlan}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{t("billing")}</span>
              <span className="font-bold text-brand-black">{displayBilling}</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-brand-black">{t("total")}</span>
              <span className="font-bold text-[#A655F7]">{displayTotal}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-2">
        <button
          onClick={() => setStep(4)}
          disabled={isLoading}
          className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <button
          onClick={() => setStep(6)}
          disabled={isLoading}
          className="flex-1 bg-brand-dark text-white font-bold text-[16px] rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {t("confirm")}
          <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>
    </div>
  );
};
