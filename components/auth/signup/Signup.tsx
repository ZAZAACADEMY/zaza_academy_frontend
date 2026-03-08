"use client";
import React, { Suspense, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/navigation";
import { SignupProvider, useSignup } from "./SignupContext";
import { tokenStore } from "@/lib/api/tokenStore";

import { Step1Account } from "./Step1Account";
import { Step2Plans } from "./Step2Plans";
import { Step3Billing } from "./Step3Billing";
import { Step4Review } from "./Step4Review";
import { Step5Payment } from "./Step5Payment";
import { Step6Processing } from "./Step6Processing";
import { Step7Success } from "./Step7Success";
import { Step8ChildSetup, Step9ChildSummary } from "./Step8ChildSetup";
import ImageCreate from "../../../public/images/CreateAccount.png";

const SignupContent = () => {
  const { step, setStep } = useSignup();
  const router = useRouter();
  const t = useTranslations("Signup");

  useEffect(() => {
    if (step === 1 && tokenStore.getToken()) {
      setStep(2);
    }
  }, [step, setStep]);

  const handleBack = () => {
    if (step === 1) {
      router.push("/");
    } else if (step === 2 && tokenStore.getToken()) {
      // Cannot go back from Plan selection if already registered/logged in
      router.push("/");
    } else if (step === 7) {
      // Cannot go back from Success
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const getStepTitle = () => {
    // Mapping internal logic to translation keys
    const mapping: Record<number, string> = {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7",
      8: "8",
      9: "9"
    };
    return t(`stepTitles.${mapping[step] || step}`);
  };

  const getStepSubtitle = () => {
    const mapping: Record<number, string> = {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7",
      8: "8",
      9: "9"
    };
    return t(`stepSubtitles.${mapping[step] || step}`);
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* ... Left Side content ... */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7E2EE8] via-[#A63BDC] to-[#F668A3]" />
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7) 0, rgba(255,255,255,0) 30%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.6) 0, rgba(255,255,255,0) 30%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.4) 0, rgba(255,255,255,0) 25%)",
          }}
        ></div>

        <div className="relative z-10 w-full max-w-[540px] drop-shadow-2xl">
          <Image
            src={ImageCreate}
            alt={t("illustrationAlt", { default: "Create Account" })}
            width={600}
            height={600}
            className="w-full h-auto object-contain [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]
      [-webkit-mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto bg-[#FAFAFA]">
        <div className="w-full max-w-[500px] flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            {step < 7 && (
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-brand-black hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <Link
              href="/"
              className="font-display font-bold text-2xl text-brand-dark"
            >
              Zaza
            </Link>

            <div className="w-10"></div>
          </div>

          {/* Progress Indicator (Updated for 5 total main steps) */}
          {step <= 5 && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>{t("progress", { step, total: 5 })}</span>
                <span>{Math.round((step / 5) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#A655F7] to-[#F46AA3] transition-all duration-500 ease-out"
                  style={{ width: `${(step / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-card-1 border border-gray-50">
            <div className="mb-8 text-center">
              <h2 className="font-display font-bold text-[28px] text-brand-black mb-2">
                {getStepTitle()}
              </h2>
              <p className="text-gray-500 font-medium">{getStepSubtitle()}</p>
            </div>

            {/* Step Content */}
            {step === 1 && <Step1Account />}
            {step === 2 && <Step2Plans />}
            {step === 3 && <Step3Billing />}
            {step === 4 && <Step4Review />}
            {step === 5 && <Step5Payment />}
            {step === 6 && <Step6Processing />}
            {step === 7 && <Step7Success />}
            {step === 8 && <Step8ChildSetup />}
            {step === 9 && <Step9ChildSummary />}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Signup = () => {
  return (
    <Suspense fallback={null}>
      <SignupProvider>
        <SignupContent />
      </SignupProvider>
    </Suspense>
  );
};
