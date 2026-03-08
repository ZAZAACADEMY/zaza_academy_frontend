"use client";
import React, { useEffect } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSignup } from "./SignupContext";

export const Step6Processing = () => {
  const { setStep, paymentGateway } = useSignup();
  const t = useTranslations("Signup.step6");

  useEffect(() => {
    // In production, this would poll the backend for payment status
    // or wait for a webhook-triggered state update.
    // For now, we simulate a processing delay.
    const timer = setTimeout(() => {
      setStep(7);
    }, 4000);

    return () => clearTimeout(timer);
  }, [setStep]);

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-[#F3F0FF] flex items-center justify-center">
          {paymentGateway === "Mobile Money" ? (
            <Smartphone className="text-[#A655F7] animate-pulse" size={40} />
          ) : (
            <Loader2 className="animate-spin text-[#A655F7]" size={40} />
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
          <Loader2 className="animate-spin text-[#F46AA3]" size={20} />
        </div>
      </div>
      
      <h3 className="text-2xl font-display font-bold text-brand-black mb-3">
        {t("title")}
      </h3>
      
      {paymentGateway === "Mobile Money" ? (
        <div className="space-y-4">
          <p className="text-gray-500 max-w-[320px] leading-relaxed">
            Please check your phone for the <strong>payment prompt</strong>. Once you've entered your PIN, we'll confirm it here.
          </p>
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-xs text-yellow-700 font-medium">
            Do not close this window until the process is complete.
          </div>
        </div>
      ) : (
        <p className="text-gray-500 max-w-[300px]">{t("body")}</p>
      )}
    </div>
  );
};
