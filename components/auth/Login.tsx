"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  Star,
  BookOpen,
  Coins,
} from "lucide-react";
import { useRouter, Link } from "@/navigation";
import { z } from "zod";
import { getLoginSchema } from "./loginValidation";
import { authService } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useLocale, useTranslations } from "next-intl";

export const Login = () => {
  const t = useTranslations("Login");
  const router = useRouter();
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bypassLogin = process.env.NEXT_PUBLIC_BYPASS_LOGIN === "true";
  const forceRedirect = process.env.NEXT_PUBLIC_FORCE_LOGIN_REDIRECT === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    const schema = getLoginSchema(t);
    const result = schema.safeParse({ email, password });

    if (result.success) {
      setErrors({});
      setIsLoading(true);

      try {
        if (bypassLogin) {
          router.push("/dashboard", { locale });
          return;
        }

        const response = await authService.login({ email, password });

        if (response.access_token) {
          localStorage.setItem("accessToken", response.access_token);
          if (response.refresh_token)
            localStorage.setItem("refreshToken", response.refresh_token);
        }

        router.push("/dashboard", { locale });
      } catch (err) {
        if (forceRedirect) {
          router.push("/dashboard", { locale });
          return;
        }
        if (err instanceof ApiError) {
          setGeneralError(err.message || "Invalid credentials");
        } else {
          setGeneralError("An error occurred during login");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
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
    generalError && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        {generalError}
      </div>
    );
  };

  {
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto bg-[#FAFAFA]">
        <div className="w-full max-w-[560px] bg-[#FFFFFF] border border-[#E6E6E6] rounded-[24px] p-6 md:p-12">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#6B7280] font-medium mb-8 hover:text-brand-dark transition-colors"
          >
            <ArrowLeft size={20} />
            {t("back")}
          </Link>

          <div className="w-full">
            <h1 className="font-display font-bold text-[32px] md:text-[40px] text-brand-black mb-2">
              {t("title")}
            </h1>
            <p className="text-[#6B7280] text-[16px] mb-10">{t("subtitle")}</p>

            {/* Form */}
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
                disabled={isLoading}
                className="mt-4 w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("submitting") : t("submit")}
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
          </div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-[#A655F7] to-[#F46AA3] relative overflow-hidden items-center justify-center p-12">
        {/* Background Particles */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#FFF 2px, transparent 2px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="relative z-10 w-full max-w-[600px] aspect-square flex items-center justify-center">
          {/* Main Image */}
          <div className="relative w-[90%] h-[90%]">
            {/* Glow effect behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/30 blur-[80px] rounded-full"></div>

            <div className="relative w-full h-full z-10 drop-shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1628260412297-a3377e45006f?q=80&w=1000&auto=format&fit=crop"
                alt="Girl using app"
                fill
                className="object-contain"
              />
            </div>

            {/* Floating UI Elements (Forms) */}
            {/* Card 1: Top Left - Profile/Progress */}
            <div className="absolute top-[15%] left-[5%] animate-[bounce_4s_infinite] bg-white p-4 rounded-[20px] shadow-xl z-20 w-[160px] rotate-[-6deg]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <span role="img" aria-label="avatar">
                    👦
                  </span>
                </div>
                <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                <div className="h-2 w-3/4 bg-gray-50 rounded-full"></div>
              </div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#86EFAC] rounded-lg flex items-center justify-center shadow-lg transform rotate-12 border-2 border-white">
                <Check size={16} className="text-white stroke-[4px]" />
              </div>
            </div>

            {/* Card 2: Center Right - Achievement */}
            <div className="absolute top-[40%] right-[5%] animate-[bounce_5s_infinite] bg-white p-4 rounded-[20px] shadow-xl z-20 w-[150px] rotate-[8deg]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                <div className="h-2 w-1/2 bg-gray-50 rounded-full"></div>
              </div>
              <div className="absolute -left-3 bottom-2 w-8 h-8 bg-[#86EFAC] rounded-lg flex items-center justify-center shadow-lg transform -rotate-12 border-2 border-white">
                <Check size={16} className="text-white stroke-[4px]" />
              </div>
            </div>

            {/* Element 3: Bottom Left - Money Bag */}
            <div className="absolute bottom-[20%] left-[10%] animate-[bounce_6s_infinite] bg-gradient-to-br from-yellow-300 to-yellow-500 p-3 rounded-[24px] shadow-xl z-20 flex items-center justify-center w-14 h-14 rotate-[-12deg]">
              <span className="text-2xl font-bold text-yellow-900">$</span>
            </div>

            {/* Element 4: Bottom Right - Books */}
            <div className="absolute bottom-[15%] right-[20%] animate-[bounce_5.5s_infinite] bg-white p-3 rounded-[16px] shadow-xl z-20 rotate-[12deg]">
              <BookOpen size={24} className="text-[#A655F7]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
