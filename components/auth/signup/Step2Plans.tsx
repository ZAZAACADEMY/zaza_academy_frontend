"use client";
import React, { useEffect } from "react";
import { Sparkles, Check, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useSignup } from "./SignupContext";
import { useTranslations } from "next-intl";
import { useGetActivePlansQuery } from "@/lib/store/services/plansApi";
import { useSearchParams } from "next/navigation";

export const Step2Plans = () => {
  const { selectedPlan, setSelectedPlan, setStep } = useSignup();
  const t = useTranslations("Signup.step2");
  const searchParams = useSearchParams();

  const { data: plansData, isLoading,  isError, error } = useGetActivePlansQuery();

  useEffect(() => {
    const planIdFromUrl = searchParams.get("plan");
    if (planIdFromUrl && !selectedPlan) {
      setSelectedPlan(planIdFromUrl);
    }
  }, [searchParams, selectedPlan, setSelectedPlan]);

  const renderContent = () => {
    // if (isLoading && !plansData?.length) {
    //   return (
    //     <div className="flex justify-center items-center h-64">
    //       <Loader2 className="animate-spin text-brand-purple" size={32} />
    //     </div>
    //   );
    // }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 text-red-700 rounded-2xl p-4">
          <AlertTriangle className="w-10 h-10 mb-4" />
          <h3 className="text-lg font-bold mb-2 text-center">{t("errorTitle")}</h3>
          <p className="text-center text-sm">{ JSON.stringify(error)}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {(plansData as any)?.map((plan: any) => {
          const isSelected = selectedPlan === plan.id;
          const isPremium = plan.name === "PREMIUM";
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-5 rounded-[24px] border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between
                ${isSelected ? "border-[#A655F7] bg-[#F3F0FF]/30 shadow-md" : "border-gray-100 bg-white hover:border-[#A655F7]/30"}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-display font-bold text-[18px] text-brand-black">
                    {plan.name_display}
                  </h3>
                  {isPremium && (
                    <span className="px-3 py-1 bg-[#EFEEFF] text-[#A655F7] text-xs font-bold rounded-full flex items-center gap-1">
                      <Sparkles size={10} /> {t("tagPopular")}
                    </span>
                  )}
                </div>
                <span className="font-display font-bold text-[20px] text-brand-black">
                  {`€${parseFloat(plan.price_three_months).toFixed(0)}`}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <p className="text-[#6B7280] text-sm">{plan.description}</p>
                <p className="text-[#9CA3AF] text-xs">{t("note")}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {renderContent()}

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setStep(2)}
          className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!selectedPlan || isLoading}
          className="flex-1 bg-brand-dark text-white font-bold text-[16px] rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {t("next")} <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>
    </div>
  );
};
