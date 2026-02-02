"use client";
import React from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSignup } from "./SignupContext";

export const Step7Success = () => {
  const { setStep } = useSignup();
  const t = useTranslations("Signup.step7");
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="w-24 h-24 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-6 animate-fade-in-up">
        <ShieldCheck className="text-[#16A34A]" size={48} />
      </div>
      <h3 className="text-3xl font-display font-bold text-brand-black mb-4">
        {t("title")}
      </h3>
      <p className="text-gray-500 max-w-[400px] mb-8">{t("body")}</p>
      <button
        onClick={() => setStep(8)}
        className="w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        {t("cta")} <ArrowLeft className="rotate-180" size={20} />
      </button>
    </div>
  );
};
