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
import { useLoginMutation } from "@/lib/store/services/authApi";
import { Step2Plans } from "./signup/Step2Plans";
import ImageLogin from "../../public/images/ImageLogin.png";
import { useTranslations, useLocale } from "next-intl";

export const Login = () => {
  const t = useTranslations("Login");
  const router = useRouter();
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  // Redirect if already logged in (session is validated by middleware,
  // but we also check via API to auto-redirect from login page)
  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) router.replace("/dashboard", { locale });
      })
      .catch(() => {
        /* not logged in */
      });
  }, [router, locale]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    const schema = getLoginSchema(t);
    const result = schema.safeParse({ email, password });

    if (result.success) {
      setErrors({});

      try {
        const response = await login({ email, password }).unwrap();

        if (response.access_token) {
          // Success! Cookies are set by the API route.
          // We can optionally store user info if needed, but NOT the token.
          // localStorage.setItem("user", JSON.stringify(response.user));
        }

        router.push("/dashboard", { locale });
      } catch (err: any) {
        if (err.status === 401 || err.data?.detail === "Invalid credentials") {
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
