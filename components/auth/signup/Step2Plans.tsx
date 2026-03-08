"use client";
import React from "react";
import { Sparkles, Check, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useSignup } from "./SignupContext";
import { useTranslations } from "next-intl";
import { tokenStore } from "@/lib/api/tokenStore";
import { useRouter } from "@/navigation";
import { useGetActivePlansQuery } from "@/lib/store/services/plansApi";

export const Step2Plans = () => {
  const { selectedPlan, setSelectedPlan, setStep } = useSignup();
  const t = useTranslations("Signup.step2");
  const router = useRouter();
  const hasToken = !!tokenStore.getToken();

  const { data: plansData, isLoading, isError } = useGetActivePlansQuery();

  const handleBack = () => {
    if (hasToken) {
      router.push("/");
    } else {
      setStep(1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#A655F7]" />
        <p className="text-gray-500 font-medium italic">Loading plans...</p>
      </div>
    );
  }

  if (isError || !plansData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <AlertTriangle size={24} />
        </div>
        <h3 className="font-display font-bold text-lg text-brand-black">
          {t("errorTitle")}
        </h3>
        <p className="text-gray-500 max-w-[300px]">{t("errorMessage")}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-[#A655F7] font-bold hover:underline mt-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Map API plans to UI structure
  const plans = plansData.map((plan) => {
    const isFamily = plan.name === "FAMILLE";
    const isPremium = plan.name === "PREMIUM";
    
    return {
      id: plan.id,
      title: plan.name_display,
      price: `$${plan.price_three_months}`,
      sub: isFamily ? t("familyPlusSub") : (isPremium ? t("familySub") : t("soloSub")),
      note: t("note"),
      tag: isPremium ? t("tagPopular") : null, // Assuming Premium is the most popular from translations
      count: isFamily ? 3 : 1,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {plans?.map((plan) => {
          const isSelected = selectedPlan === plan.id;
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
                    {plan.title}
                  </h3>
                  {plan.tag && (
                    <span className="px-3 py-1 bg-[#EFEEFF] text-[#A655F7] text-xs font-bold rounded-full flex items-center gap-1">
                      <Sparkles size={10} /> {plan.tag}
                    </span>
                  )}
                </div>
                <span className="font-display font-bold text-[20px] text-brand-black">
                  {plan.price}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <p className="text-[#6B7280] text-sm">{plan.sub}</p>
                <p className="text-[#9CA3AF] text-xs">{plan.note}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-[#4B5563]">
                <Check size={16} className="text-[#A655F7]" />
                <span>{t("childLimit", { count: plan.count })}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleBack}
          className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!selectedPlan}
          className="flex-1 bg-brand-dark text-white font-bold text-[16px] rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {t("next")} <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>
    </div>
  );
};
