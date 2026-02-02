"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "@/navigation";
import { useSignup } from "./SignupContext";
import { COUNTRY_CODES } from "./constants";
import { z } from "zod";
import { getStep1Schema } from "./validation";
import { useTranslations, useLocale } from "next-intl";

export const Step1Account = () => {
  const t = useTranslations("Signup.step1");
  const tErrors = useTranslations("Signup.errors");
  const {
    setStep,
    country,
    setCountry,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const locale = useLocale();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState(country);
  const countryWrapperRef = useRef<HTMLDivElement>(null);

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" });
    } catch (e) {
      return new Intl.DisplayNames(["en"], { type: "region" });
    }
  }, [locale]);

  const countryOptions = useMemo(
    () =>
      COUNTRY_CODES.map((code) => ({
        code,
        name: displayNames.of(code) ?? code,
      })),
    [displayNames],
  );

  // Close country dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryWrapperRef.current &&
        !countryWrapperRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update local search if context country changes (e.g. going back)
  useEffect(() => {
    const found = countryOptions.find((c) => c.code === country);
    setCountrySearch(found?.name ?? country);
  }, [country, countryOptions]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = getStep1Schema(tErrors);
    const result = schema.safeParse({
      firstName,
      lastName,
      email,
      country,
      password,
      confirmPassword,
    });

    if (result.success) {
      setErrors({});
      setStep(2);
    } else {
      // Use flatten() to organize errors by field
      const formattedErrors = result.error.flatten();
      const fieldErrors: { [key: string]: string } = {};

      // Map array of error messages to a single string per field
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

  return (
    <form className="flex flex-col gap-6" onSubmit={handleNext}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="firstName"
            className="font-bold text-brand-black text-[14px]"
          >
            {t("firstNameLabel")}
          </label>
          <input
            id="firstName"
            type="text"
            placeholder={t("firstNamePlaceholder")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className={`w-full px-6 py-4 rounded-[50px] border ${
              errors.firstName ? "border-red-500" : "border-gray-200"
            } focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all`}
          />
          {errors.firstName && (
            <p
              id="firstName-error"
              role="alert"
              className="text-red-500 text-xs ml-4"
            >
              {errors.firstName}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="lastName"
            className="font-bold text-brand-black text-[14px]"
          >
            {t("lastNameLabel")}
          </label>
          <input
            id="lastName"
            type="text"
            placeholder={t("lastNamePlaceholder")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className={`w-full px-6 py-4 rounded-[50px] border ${
              errors.lastName ? "border-red-500" : "border-gray-200"
            } focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all`}
          />
          {errors.lastName && (
            <p
              id="lastName-error"
              role="alert"
              className="text-red-500 text-xs ml-4"
            >
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-2 w-full">
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
        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="country"
            className="font-bold text-brand-black text-[14px]"
          >
            {t("countryLabel")}
          </label>
          <div className="relative" ref={countryWrapperRef}>
            <input
              id="country"
              type="text"
              value={countrySearch}
              onChange={(e) => {
                setCountrySearch(e.target.value);
                setIsCountryOpen(true);
              }}
              onFocus={() => setIsCountryOpen(true)}
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? "country-error" : undefined}
              aria-expanded={isCountryOpen}
              aria-haspopup="listbox"
              placeholder={t("countryPlaceholder")}
              className={`w-full px-6 py-4 rounded-[50px] border ${
                errors.country ? "border-red-500" : "border-gray-200"
              } focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all bg-white`}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="rotate-90 text-gray-400" size={20} />
            </div>

            {isCountryOpen && (
              <div
                role="listbox"
                className="absolute top-[calc(100%+8px)] left-0 right-0 max-h-[250px] overflow-y-auto bg-white border border-gray-100 rounded-[24px] shadow-[0px_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
              >
                {countryOptions.filter((c) =>
                  c.name.toLowerCase().includes(countrySearch.toLowerCase()),
                ).length > 0 ? (
                  countryOptions
                    .filter((c) =>
                      c.name
                        .toLowerCase()
                        .includes(countrySearch.toLowerCase()),
                    )
                    .map((c) => (
                      <div
                        key={c.code}
                        role="option"
                        aria-selected={country === c.code}
                        className={`px-4 py-2.5 rounded-[12px] cursor-pointer text-sm font-medium transition-colors ${country === c.code ? "bg-[#F3F0FF] text-[#A655F7]" : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"}`}
                        onClick={() => {
                          setCountry(c.code);
                          setCountrySearch(c.name);
                          setIsCountryOpen(false);
                        }}
                      >
                        {c.name}
                      </div>
                    ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    {t("countryEmpty")}
                  </div>
                )}
              </div>
            )}
          </div>
          {errors.country && (
            <p
              id="country-error"
              role="alert"
              className="text-red-500 text-xs ml-4"
            >
              {errors.country}
            </p>
          )}
        </div>
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
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full px-6 py-4 rounded-[50px] border ${
              errors.password ? "border-red-500" : "border-gray-200"
            } focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
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

      <div className="flex flex-col gap-2">
        <label
          htmlFor="confirmPassword"
          className="font-bold text-brand-black text-[14px]"
        >
          {t("confirmPasswordLabel")}
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            className={`w-full px-6 py-4 rounded-[50px] border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-200"
            } focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={
              showConfirmPassword ? t("hidePassword") : t("showPassword")
            }
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            role="alert"
            className="text-red-500 text-xs ml-4"
          >
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        {t("next")} <ArrowLeft className="rotate-180" size={20} />
      </button>

      <div className="text-center mt-4">
        <span className="text-[#6B7280]">{t("haveAccount")}</span>
        <Link
          href="/login"
          className="text-[#A655F7] font-bold hover:underline"
        >
          {t("loginLink")}
        </Link>
      </div>
    </form>
  );
};
