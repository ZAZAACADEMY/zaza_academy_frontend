"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useRouter, Link } from "@/navigation";
import {
  usePasswordResetRequestMutation,
  usePasswordResetVerifyOtpMutation,
  usePasswordResetConfirmMutation,
} from "@/lib/store/services/authApi";
import { useTranslations } from "next-intl";
import ImageLogin from "../../public/images/ImageLogin.png";

type Step = "email" | "otp" | "newPassword" | "success";

const OTP_LENGTH = 6;

export const ForgotPassword = ({
  initialStep,
  initialEmail,
}: {
  initialStep?: string;
  initialEmail?: string;
} = {}) => {
  const t = useTranslations("ForgotPassword");
  const router = useRouter();

  const [step, setStep] = useState<Step>(
    (["email", "otp", "newPassword", "success"].includes(initialStep ?? "")
      ? initialStep
      : "email") as Step,
  );
  const [email, setEmail] = useState(initialEmail ?? "");
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill(""),
  );
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otp = otpDigits.join("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [requestReset, { isLoading: isRequestLoading }] =
    usePasswordResetRequestMutation();
  const [verifyOtp, { isLoading: isVerifyLoading }] =
    usePasswordResetVerifyOtpMutation();
  const [confirmReset, { isLoading: isConfirmLoading }] =
    usePasswordResetConfirmMutation();

  // Auto-focus first OTP box when step changes to "otp"
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        const next = [...otpDigits];
        next[index] = "";
        setOtpDigits(next);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtpDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError(t("errors.emailRequired"));
      return;
    }
    try {
      await requestReset({ email }).unwrap();
      setStep("otp");
    } catch (err: any) {
      setError(
        err.data?.detail || err.data?.message || t("errors.requestFailed"),
      );
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError(t("errors.otpLength"));
      return;
    }
    try {
      const response = await verifyOtp({ email, otp }).unwrap();
      setResetToken(response.token);
      setStep("newPassword");
    } catch (err: any) {
      setError(err.data?.detail || err.data?.message || t("errors.otpInvalid"));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError(t("errors.passwordLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }
    try {
      await confirmReset({
        reset_token: resetToken,
        password: newPassword,
        password_confirm: confirmPassword,
      }).unwrap();
      setStep("success");
    } catch (err: any) {
      setError(
        err.data?.detail || err.data?.message || t("errors.resetFailed"),
      );
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "email") {
      router.push("/login");
    } else if (step === "otp") {
      setStep("email");
    } else if (step === "newPassword") {
      setStep("otp");
    }
  };

  const isLoading = isRequestLoading || isVerifyLoading || isConfirmLoading;

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto bg-[#FAFAFA]">
        <div className="w-full max-w-[560px] bg-[#FFFFFF] border border-[#E6E6E6] rounded-[24px] p-6 md:p-12">
          {step !== "success" && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-[#6B7280] font-medium mb-8 hover:text-brand-dark transition-colors"
            >
              <ArrowLeft size={20} />
              {step === "email" ? t("backToLogin") : t("back")}
            </button>
          )}

          {/* Steps */}
          {step === "email" && (
            <div className="w-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-purple/10 mb-6">
                <Mail size={28} className="text-brand-purple" />
              </div>
              <h1 className="font-display font-bold text-[32px] md:text-[36px] text-brand-black mb-2">
                {t("emailStep.title")}
              </h1>
              <p className="text-[#6B7280] text-[16px] mb-8">
                {t("emailStep.subtitle")}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              )}

              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="font-bold text-brand-black text-[14px]"
                  >
                    {t("emailStep.emailLabel")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t("emailStep.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    t("emailStep.submit")
                  )}
                </button>
              </form>
            </div>
          )}

          {step === "otp" && (
            <div className="w-full">
              {/* Icon with glow */}
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute w-28 h-28 rounded-full bg-linear-to-br from-brand-purple/20 to-[#F46AA3]/20 blur-2xl" />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-brand-purple/15 to-[#F46AA3]/15 border-2 border-brand-purple/20">
                  <ShieldCheck size={38} className="text-brand-purple" />
                </div>
              </div>

              <h1 className="font-display font-bold text-[32px] md:text-[36px] text-brand-black mb-2 text-center">
                {t("otpStep.title")}
              </h1>
              <p className="text-[#6B7280] text-[15px] mb-5 text-center">
                {t("otpStep.subtitle")}
              </p>

              {/* Email badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 bg-brand-purple/8 border border-brand-purple/20 text-brand-purple font-semibold text-[14px] px-4 py-2 rounded-full max-w-full overflow-hidden">
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <AlertTriangle size={18} className="shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {t("otpStep.otpLabel")}
                </p>

                {/* 6 individual digit boxes */}
                <div
                  className="flex gap-2 sm:gap-3 justify-center"
                  role="group"
                  aria-label={t("otpStep.otpLabel")}
                >
                  {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      id={i === 0 ? "otp-0" : undefined}
                      type="text"
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={otpDigits[i]}
                      onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      onFocus={(e) => e.target.select()}
                      className={[
                        "w-12 h-16 sm:w-14 sm:h-18 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all duration-200 select-none",
                        otpDigits[i]
                          ? "border-brand-purple bg-linear-to-b from-brand-purple/10 to-brand-purple/5 text-brand-purple shadow-md shadow-brand-purple/20"
                          : "border-gray-200 bg-white text-brand-black hover:border-brand-purple/40",
                        "focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/15 focus:bg-white",
                      ].join(" ")}
                      aria-label={`Digit ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== OTP_LENGTH}
                  className="w-full bg-linear-to-r from-[#2D1B4E] to-[#7F26D9] text-white font-bold text-[16px] py-4 rounded-[50px] hover:opacity-90 transition-all shadow-lg shadow-brand-purple/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    t("otpStep.submit")
                  )}
                </button>

                <div className="text-center text-sm text-[#6B7280]">
                  {t("otpStep.noCode")}{" "}
                  <button
                    type="button"
                    onClick={handleEmailSubmit as any}
                    disabled={isLoading}
                    className="text-[#A655F7] font-bold hover:underline disabled:opacity-50"
                  >
                    {t("otpStep.resend")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "newPassword" && (
            <div className="w-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-purple/10 mb-6">
                <Lock size={28} className="text-brand-purple" />
              </div>
              <h1 className="font-display font-bold text-[32px] md:text-[36px] text-brand-black mb-2">
                {t("newPasswordStep.title")}
              </h1>
              <p className="text-[#6B7280] text-[16px] mb-8">
                {t("newPasswordStep.subtitle")}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              )}

              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="new-password"
                    className="font-bold text-brand-black text-[14px]"
                  >
                    {t("newPasswordStep.newPasswordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="confirm-password"
                    className="font-bold text-brand-black text-[14px]"
                  >
                    {t("newPasswordStep.confirmPasswordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    t("newPasswordStep.submit")
                  )}
                </button>
              </form>
            </div>
          )}

          {step === "success" && (
            <div className="w-full flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle size={44} className="text-green-500" />
              </div>
              <h1 className="font-display font-bold text-[32px] md:text-[36px] text-brand-black mb-3">
                {t("successStep.title")}
              </h1>
              <p className="text-[#6B7280] text-[16px] mb-10">
                {t("successStep.subtitle")}
              </p>
              <Link
                href="/login"
                className="w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all shadow-lg text-center"
              >
                {t("successStep.loginButton")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7E2EE8] via-[#A63BDC] to-[#F668A3]" />
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7) 0, rgba(255,255,255,0) 30%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.6) 0, rgba(255,255,255,0) 30%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.4) 0, rgba(255,255,255,0) 25%)",
          }}
        />
        <div className="relative z-10 w-full max-w-[540px] drop-shadow-2xl">
          <Image
            src={ImageLogin}
            alt={t("illustrationAlt")}
            width={600}
            height={600}
            className="w-full h-auto object-contain [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]"
            priority
          />
        </div>
      </div>
    </div>
  );
};
