"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSignup } from "./SignupContext";

export const Step4Review = () => {
  const { setStep, selectedPlan, paymentFrequency } = useSignup();
  const t = useTranslations("Signup.step4");
  const tPlans = useTranslations("Signup.step2");
  const tBilling = useTranslations("Signup.step3");

  const displayPlan = (() => {
    if (selectedPlan === "Solo") return tPlans("soloTitle");
    if (selectedPlan === "Family") return tPlans("familyTitle");
    if (selectedPlan === "Family Plus") return tPlans("familyPlusTitle");
    return selectedPlan;
  })();

  const displayBilling = (() => {
    if (paymentFrequency === "Monthly") return tBilling("monthly");
    if (paymentFrequency === "Quarterly") return tBilling("quarterly");
    return paymentFrequency;
  })();

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#FAFAFA] rounded-[24px] p-6 border border-gray-100">
        <h3 className="font-display font-bold text-lg mb-4 text-brand-black">
          {t("title")}
        </h3>
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
            <span className="font-bold text-[#A655F7]">$249.99</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-2">
        <button
          onClick={() => setStep(3)}
          className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <button
          onClick={() => setStep(5)}
          className="flex-1 bg-brand-dark text-white font-bold text-[16px] rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          {t("confirm")}
          <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>
    </div>
  );
};
