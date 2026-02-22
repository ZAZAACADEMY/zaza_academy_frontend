"use client";
import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSignup } from "./SignupContext";
import { useRegisterMutation } from "@/lib/store/services/authApi";

export const Step6Processing = () => {
  const {
    setStep,
    firstName,
    lastName,
    email,
    password,
    country,
    selectedPlan,
    paymentFrequency,
    paymentGateway,
  } = useSignup();

  const t = useTranslations("Signup.step6");
  const [register, { isError, error }] = useRegisterMutation();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const performSignup = async () => {
      try {
        await register({
          firstName,
          lastName,
          email,
          password,
          country,
          plan: selectedPlan,
          paymentFrequency,
          paymentGateway,
        }).unwrap();

        // Success
        setStep(7);
      } catch (err: any) {
        // Detailed error logging
        if (err?.status) {
          console.error(
            `Registration failed [Status ${err.status}]:`,
            JSON.stringify(err.data, null, 2),
          );

          // FALLBACK FOR DEVELOPMENT (If Backend is Offline/502)
          // This allows the UI flow to be tested even without the Django backend running.
          if (err.status === 502 && process.env.NODE_ENV === "development") {
            console.warn(
              "⚠️ Backend unavailable (502). Proceeding in DEMO mode.",
            );
            setTimeout(() => setStep(7), 2000);
            return;
          }
        } else {
          console.error("Registration failed [Network/Unknown]:", err);
        }
      }
    };

    performSignup();
  }, [
    firstName,
    lastName,
    email,
    password,
    country,
    selectedPlan,
    paymentFrequency,
    paymentGateway,
    register,
    setStep,
  ]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <span className="text-red-500 text-3xl">!</span>
        </div>
        <h3 className="text-xl font-bold text-red-600 mb-2">
          Registration Failed
        </h3>
        <p className="text-gray-500 text-center max-w-[300px] mb-4">
          {(error as any)?.data?.message ||
            "An error occurred during registration. Please try again."}
        </p>
        <button
          onClick={() => {
            hasRun.current = false;
            window.location.reload();
          }} // Simple retry or stick to Step 6
          className="px-6 py-2 bg-brand-dark text-white rounded-full"
        >
          Retry
        </button>
      </div>
    );
  }

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
