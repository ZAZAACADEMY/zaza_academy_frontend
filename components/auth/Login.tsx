"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  Star,
  BookOpen,
  Coins,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useRouter, Link } from "@/navigation";
import { z } from "zod";
import { getLoginSchema } from "./loginValidation";
import { 
  useLoginMutation, 
  useVerify2FAMutation, 
  useResend2FACodeMutation 
} from "@/lib/store/services/authApi";
import { tokenStore } from "@/lib/api/tokenStore";
import ImageLogin from "../../public/images/ImageLogin.png";
import { useTranslations, useLocale } from "next-intl";

export const Login = () => {
  const t = useTranslations("Login");
  const router = useRouter();
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [verify2FA, { isLoading: is2FAVerifyLoading }] = useVerify2FAMutation();
  const [resend2FA, { isLoading: isResendLoading }] = useResend2FACodeMutation();

  // Redirect if a token is already present
  useEffect(() => {
    if (tokenStore.getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    const schema = getLoginSchema(t);
    const result = schema.safeParse({ email, password });

    if (result.success) {
      setErrors({});

      try {
        const response = await login({ email, password }).unwrap();

        if (response.requires_2fa) {
          setRequires2FA(true);
          setTempToken(response.token || "");
          setGeneralError(""); // Clear any previous error
        } else if (response.access) {
          tokenStore.setToken(response.access);
          if (response.refresh) {
            tokenStore.setRefreshToken(response.refresh);
          }
          
          // Check if user was in the middle of signup
          const savedSignup = localStorage.getItem("zaza_signup_state");
          let targetPath = "/dashboard";
          
          if (savedSignup) {
            try {
              const signupData = JSON.parse(savedSignup);
              // Only resume if it's the same user and they were in an active signup flow (Steps 2-7)
              if (signupData.email === email && signupData.step > 1 && signupData.step < 8) {
                targetPath = "/signup";
              } else {
                // Clear stale or irrelevant signup data
                localStorage.removeItem("zaza_signup_state");
              }
            } catch (e) {
              localStorage.removeItem("zaza_signup_state");
            }
          }
          
          router.push(targetPath as any);
        }
      } catch (err: any) {
        console.log("Login error:", err);
        if (err.status === 401 || err.data?.detail) {
          setGeneralError(t("errors.invalidCredentials"));
        } else {
          setGeneralError(
            err.data?.message ||
              err.data?.detail ||
              "An error occurred during login",
          );
        }
      }
    } else {
      // ... field errors logic ...
      const formattedErrors = result.error.flatten();
      const fieldErrors: { [key: string]: string } = {};

      Object.keys(formattedErrors.fieldErrors).forEach((key) => {
        const messages =
          formattedErrors.fieldErrors[
            key as keyof typeof formattedErrors.fieldErrors
          ];
        if (messages && messages.length > 0) {
          fieldErrors[key] = messages[0];
        }
      });

      setErrors(fieldErrors);
    }
  };

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    
    if (otpCode.length !== 6) {
      setGeneralError(t("errors.otpLength"));
      return;
    }

    try {
      const response = await verify2FA({ token: tempToken, otp: otpCode }).unwrap();
      if (response.access) {
        tokenStore.setToken(response.access);
        if (response.refresh) {
          tokenStore.setRefreshToken(response.refresh);
        }
        
        // Check if user was in the middle of signup
        const savedSignup = localStorage.getItem("zaza_signup_state");
        let targetPath = "/dashboard";
        
        if (savedSignup) {
          try {
            const signupData = JSON.parse(savedSignup);
            // Only resume if it's the same user and they were in an active signup flow (Steps 2-7)
            if (signupData.email === email && signupData.step > 1 && signupData.step < 8) {
              targetPath = "/signup";
            } else {
              // Clear stale or irrelevant signup data
              localStorage.removeItem("zaza_signup_state");
            }
          } catch (e) {
            localStorage.removeItem("zaza_signup_state");
          }
        }
        
        router.push(targetPath as any);
      }
    } catch (err: any) {
      setGeneralError(err.data?.detail || err.data?.message || "2FA Verification failed");
    }
  };

  const handleResend2FA = async () => {
    setResendMessage("");
    setGeneralError("");
    try {
      const response = await resend2FA({ token: tempToken }).unwrap();
      setResendMessage(response.detail || "New code sent!");
    } catch (err: any) {
      setGeneralError(err.data?.detail || "Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto bg-[#FAFAFA]">
        <div className="w-full max-w-[560px] bg-[#FFFFFF] border border-[#E6E6E6] rounded-[24px] p-6 md:p-12">
          {/* Back Button */}
          <button
            onClick={() => requires2FA ? setRequires2FA(false) : router.push("/")}
            className="inline-flex items-center gap-2 text-[#6B7280] font-medium mb-8 hover:text-brand-dark transition-colors"
          >
            <ArrowLeft size={20} />
            {requires2FA ? t("backToLogin") : t("back")}
          </button>

          <div className="w-full">
            <h1 className="font-display font-bold text-[32px] md:text-[40px] text-brand-black mb-2">
              {requires2FA ? t("twoFactorTitle") : t("title")}
            </h1>
            <p className="text-[#6B7280] text-[16px] mb-10">
              {requires2FA ? t("twoFactorSubtitle") : t("subtitle")}
            </p>

            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <AlertTriangle size={18} />
                {generalError}
              </div>
            )}

            {resendMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm flex items-center gap-2">
                <Check size={18} />
                {resendMessage}
              </div>
            )}

            {!requires2FA ? (
              /* Standard Login Form */
              <form
                className="flex flex-col gap-6"
                onSubmit={handleLogin}
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="font-bold text-brand-black text-[14px]"
                  >
                    {t("emailLabel")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full px-6 py-4 rounded-[50px] border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all`}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="text-red-500 text-xs ml-4"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="font-bold text-brand-black text-[14px]"
                  >
                    {t("passwordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      className={`w-full px-6 py-4 rounded-[50px] border ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      } focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? t("hidePassword") : t("showPassword")
                      }
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      role="alert"
                      className="text-red-500 text-xs ml-4"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoginLoading}
                  className="mt-4 w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoginLoading ? <Loader2 className="animate-spin" size={20} /> : t("submit")}
                </button>

                <div className="text-center mt-4">
                  <span className="text-[#6B7280]">{t("noAccount")}</span>
                  <Link
                    href="/signup"
                    className="text-[#A655F7] font-bold hover:underline"
                  >
                    {t("signupLink")}
                  </Link>
                </div>
              </form>
            ) : (
              /* 2FA Form */
              <form
                className="flex flex-col gap-6"
                onSubmit={handle2FAVerify}
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="otp"
                    className="font-bold text-brand-black text-[14px]"
                  >
                    {t("otpLabel")}
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all text-center text-2xl tracking-[0.5em] font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={is2FAVerifyLoading || otpCode.length !== 6}
                  className="mt-4 w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {is2FAVerifyLoading ? <Loader2 className="animate-spin" size={20} /> : t("verifyButton")}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend2FA}
                    disabled={isResendLoading}
                    className="text-[#A655F7] font-bold hover:underline disabled:opacity-50"
                  >
                    {isResendLoading ? t("resending") : t("resendCode")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Image/Illustration (Adapted from Signup style) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-6">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7E2EE8] via-[#A63BDC] to-[#F668A3]" />

        {/* Sparkle/Glow Overlay */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7) 0, rgba(255,255,255,0) 30%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.6) 0, rgba(255,255,255,0) 30%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.4) 0, rgba(255,255,255,0) 25%)",
          }}
        ></div>

        <div className="relative z-10 w-full max-w-[540px] drop-shadow-2xl">
          <Image
            src={ImageLogin}
            alt={t("illustrationAlt", { default: "Welcome Back" })}
            width={600}
            height={600}
            className="w-full h-auto object-contain [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]
      [-webkit-mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)"
            priority
          />
        </div>
      </div>
    </div>
  );
};
