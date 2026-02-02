"use client";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSignup } from "./SignupContext";

export const Step6Processing = () => {
  const { setStep } = useSignup();
  const t = useTranslations("Signup.step6");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(7);
    }, 3000);
    return () => clearTimeout(timer);
  }, [setStep]);

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-20 h-20 rounded-full bg-[#F3F0FF] flex items-center justify-center mb-6">
        <Loader2 className="animate-spin text-[#A655F7]" size={40} />
      </div>
      <h3 className="text-2xl font-display font-bold text-brand-black mb-2">
        {t("title")}
      </h3>
      <p className="text-gray-500 text-center max-w-[300px]">{t("body")}</p>
    </div>
  );
};
