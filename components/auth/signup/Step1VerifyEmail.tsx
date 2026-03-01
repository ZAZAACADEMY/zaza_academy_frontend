"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useSignup } from "./SignupContext";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/navigation";
import { useVerifyEmailMutation, useResendOtpMutation, useLoginMutation } from "@/lib/store/services/authApi";
import { tokenStore } from "@/lib/api/tokenStore";

export const Step1VerifyEmail = () => {
  const t = useTranslations("Signup.verifyEmail");
  const { setStep, email, password } = useSignup();
  const locale = useLocale();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendMessage(null);

    if (otp.length !== 6) {
      setError(t("errorInvalidOtp"));
      return;
    }

    try {
      // 1. Verify Email
      await verifyEmail({ email, otp }).unwrap();

      // IMPORTANT: Mark step 2 as complete before attempting login
      // This ensures that if auto-login fails, the user resumes at step 3
      setStep(3);

      // 2. Auto-login to get the token
      try {
        const loginResponse = await login({ email, password }).unwrap();
        
        if (loginResponse.access) {
          tokenStore.setToken(loginResponse.access);
          if (loginResponse.refresh) {
            tokenStore.setRefreshToken(loginResponse.refresh);
          }
          // Already set step to 3 above
        } else {
          // If no token but no error thrown, redirect to login
          router.push("/login", { locale });
        }
      } catch (loginErr) {
        console.error("Auto-login failed after verification:", loginErr);
        // Redirect to login page on failure
        router.push("/login", { locale });
      }
    } catch (err: any) {
      console.error("Verification failed:", err);
      setError(err.data?.detail || err.data?.otp?.[0] || t("errorGeneric"));
    }
  };

  const handleResend = async () => {
    setError(null);
    setResendMessage(null);
    try {
      const response = await resendOtp({ email }).unwrap();
      setResendMessage(response?.detail || (response as any)?.message || t("otpResent"));
    } catch (err: any) {
      setError(err.data?.detail || t("errorResendFailed"));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <p className="text-gray-600">
          {t("instruction", { email })}
        </p>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="otp" className="font-bold text-brand-black text-[14px]">
            {t("otpLabel")}
          </label>
          <input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all text-center text-2xl tracking-[0.5em] font-bold"
          />
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl">
            <AlertTriangle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {resendMessage && (
          <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl">
            <CheckCircle2 size={20} />
            <p className="text-sm font-medium">{resendMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isVerifying || isLoggingIn || otp.length !== 6}
          className="w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isVerifying || isLoggingIn ? <Loader2 className="animate-spin" /> : t("verifyButton")}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-[#A655F7] font-bold hover:underline disabled:opacity-50"
          >
            {isResending ? t("resending") : t("resendLink")}
          </button>
        </div>
      </form>

      <button
        onClick={() => setStep(1)}
        className="flex items-center justify-center gap-2 text-gray-500 font-medium hover:text-brand-dark transition-colors"
      >
        <ArrowLeft size={18} />
        {t("backToSignup")}
      </button>
    </div>
  );
};
