"use client";
import React from "react";
import { Sparkles, Check, ArrowLeft } from "lucide-react";
import { useSignup } from "./SignupContext";
import { useTranslations } from "next-intl";

export const Step2Plans = () => {
  const { selectedPlan, setSelectedPlan, setStep } = useSignup();
  const t = useTranslations("Signup.step2");

  const plans = [
    {
      id: "Solo",
      title: t("soloTitle"),
      price: "$199",
      sub: t("soloSub"),
      note: t("note"),
      tag: null,
      count: 1,
    },
    {
      id: "Family",
      title: t("familyTitle"),
      price: "$249.99",
      sub: t("familySub"),
      note: t("note"),
      tag: t("tagPopular"),
      count: 3,
    },
    {
      id: "Family Plus",
      title: t("familyPlusTitle"),
      price: "$499.99",
      sub: t("familyPlusSub"),
      note: t("note"),
      tag: null,
      count: 5,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {plans.map((plan) => {
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
          onClick={() => setStep(1)}
          className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 bg-brand-dark text-white font-bold text-[16px] rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          {t("next")} <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>
    </div>
  );
};
