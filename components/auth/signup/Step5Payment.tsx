"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { CreditCard, Smartphone, ChevronRight, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useSignup } from "./SignupContext";
import { PaymentGateway } from "./types";
import { MOBILE_MONEY_CONFIG } from "./constants";
import { useGetPlanByIdQuery } from "@/lib/store/services/plansApi";
import { useCreateSubscriptionMutation, useGetMySubscriptionsQuery } from "@/lib/store/services/subscriptionsApi";
import { useInitiatePaymentMutation } from "@/lib/store/services/paymentsApi";

export const Step5Payment = () => {
  const t = useTranslations("Signup.step5");
  const locale = useLocale();
  const {
    setStep,
    paymentGateway,
    setPaymentGateway,
    country,
    setCountry,
    mobileProvider,
    setMobileProvider,
    phoneNumber,
    setPhoneNumber,
    cardHolder,
    setCardHolder,
    cardNumber,
    setCardNumber,
    expiryDate,
    setExpiryDate,
    cvv,
    setCvv,
    selectedPlan,
    paymentFrequency,
  } = useSignup();

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState(country);
  const countryWrapperRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: plan, isLoading: isLoadingPlan, isError: isErrorPlan } = useGetPlanByIdQuery(selectedPlan, {
    skip: !selectedPlan,
  });

  const { data: subscriptionsData, isLoading: isLoadingSubs } = useGetMySubscriptionsQuery();
  const [createSubscription, { isLoading: isCreatingSubscription }] = useCreateSubscriptionMutation();
  const [initiatePayment, { isLoading: isInitiatingPayment }] = useInitiatePaymentMutation();

  // Button spinner only when performing an action
  const isActionLoading = isCreatingSubscription || isInitiatingPayment;
  // Disable button if data is missing or action is in progress
  const isDataLoading = isLoadingPlan || isLoadingSubs;
  const isButtonDisabled = isActionLoading || !plan;

  console.log("Loading States -> Plan:", isLoadingPlan, "Subs:", isLoadingSubs, "Action:", isActionLoading);

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" });
    } catch (e) {
      return new Intl.DisplayNames(["en"], { type: "region" });
    }
  }, [locale]);

  const mobileCountryOptions = useMemo(
    () =>
      MOBILE_MONEY_CONFIG.map((entry) => ({
        ...entry,
        name: displayNames.of(entry.code) ?? entry.code,
      })),
    [displayNames],
  );

  const selectedMobileCountry = useMemo(
    () => mobileCountryOptions.find((c) => c.code === country),
    [mobileCountryOptions, country],
  );

  const applyDialCode = (dialCode: string, value: string) => {
    if (!value || !value.trim()) return "";
    if (value.startsWith(dialCode)) return value;
    const stripped = value.replace(/^\+?\d+\s*/, "");
    return `${dialCode} ${stripped}`;
  };

  useEffect(() => {
    if (paymentGateway !== "Mobile Money") return;
    const current = mobileCountryOptions.find((c) => c.code === country);
    const target = current ?? mobileCountryOptions[0]; // Default to first available
    if (!target) return; // No mobile money countries available

    if (!current) { // If current country isn't in mobile options, set to default
      setCountry(target.code);
    }
    setCountrySearch(target.name);
    // Ensure phone number has the correct dial code if it's already being entered
    if (phoneNumber.trim() && !phoneNumber.startsWith(target.dialCode)) {
      setPhoneNumber((prev) => applyDialCode(target.dialCode, prev));
    }
    const firstProvider = target.providers[0];
    if (firstProvider && !target.providers.includes(mobileProvider)) {
      setMobileProvider(firstProvider);
    }
  }, [paymentGateway, mobileCountryOptions, country, mobileProvider, phoneNumber, setCountry, setMobileProvider, setPhoneNumber]);

  // Keep provider aligned to selected country when switching countries within mobile money
  useEffect(() => {
    if (paymentGateway !== "Mobile Money") return;
    const firstProvider = selectedMobileCountry?.providers[0];
    if (
      firstProvider &&
      !selectedMobileCountry?.providers.includes(mobileProvider)
    ) {
      setMobileProvider(firstProvider);
    }
  }, [
    paymentGateway,
    selectedMobileCountry,
    mobileProvider,
    setMobileProvider,
  ]);

  // Close dropdown when clicking outside
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

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!plan) {
      setError(t("errorPlanDetails"));
      return;
    }

    try {
      // 1. Check if user already has a subscription for this plan (to handle retries)
      let subscriptionId = "";
      const existingSub = subscriptionsData?.results?.find(
        (sub) => sub.plan === plan.id && sub.status === "ACTIVE"
      );

      if (existingSub) {
        subscriptionId = existingSub.id;
      } else {
        // 2. Create the subscription if it doesn't exist
        const newSubscription = await createSubscription({ plan: plan.id }).unwrap();
        subscriptionId = newSubscription.id;
      }

      // 3. Initiate the payment
      const durationApi = paymentFrequency === "Monthly" ? "1_MONTH" : "3_MONTHS";
      const amount = durationApi === "1_MONTH" ? plan.price_one_month : plan.price_three_months;
      
      let methodApi: "STRIPE" | "PAYPAL" | "TARAMONEY";
      if (paymentGateway === "Card") {
        methodApi = "STRIPE";
      } else if (paymentGateway === "Mobile Money") {
        methodApi = "TARAMONEY";
      } else {
        setError(t("errorInvalidGateway"));
        return;
      }

      const paymentPayload = {
        subscription: subscriptionId,
        duration: durationApi,
        amount: parseFloat(amount).toFixed(2),
        method: methodApi,
      };

      const paymentResult = await initiatePayment(paymentPayload).unwrap();

      // 4. Redirect to payment provider
      const checkoutUrl = paymentResult.payment_data?.checkout_url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError(t("errorPaymentUrl"));
      }

    } catch (err: any) {
      console.error("Payment process failed:", err);
      // Attempt to extract meaningful error message
      const apiErrorMessage = err.data?.non_field_errors?.[0] || err.data?.detail || err.data?.message || err.error;
      setError(apiErrorMessage || t("errorGenericPayment"));
    }
  };

  if (isLoadingPlan && !plan) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand-purple" size={40} />
          <p className="text-gray-500 font-medium">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (isErrorPlan || (!isLoadingPlan && !plan)) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-red-50 text-red-700 rounded-2xl p-4">
        <AlertTriangle className="w-10 h-10 mb-4" />
        <h3 className="text-lg font-bold mb-2 text-center">{t("errorLoadingPlan")}</h3>
        <p className="text-center text-sm">{t("errorTryAgain")}</p>
        <button 
          type="button"
          onClick={() => setStep(3)} 
          className="mt-4 text-brand-purple font-bold hover:underline"
        >
          Go back to plans
        </button>
      </div>
    );
  }

  const gateways: { id: PaymentGateway; label: string; icon: any }[] = [
    { id: "Card", label: t("cardGateway"), icon: CreditCard },
    { id: "Mobile Money", label: t("mobileGateway"), icon: Smartphone },
  ];

  return (
    <form className="flex flex-col gap-6" onSubmit={handlePay}>
      {error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Gateway Selection */}
      <div className="grid grid-cols-2 gap-4">
        {gateways.map((gw) => {
          const isSelected = paymentGateway === gw.id;
          return (
            <div
              key={gw.id}
              onClick={() => setPaymentGateway(gw.id)}
              className={`cursor-pointer rounded-[20px] p-4 border-2 flex flex-col items-center gap-3 text-center transition-all
                ${isSelected ? "border-[#A655F7] bg-[#F3F0FF]/30" : "border-gray-100 bg-white hover:border-gray-200"}
              `}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center
                ${isSelected ? "bg-[#A655F7] text-white" : "bg-gray-100 text-gray-500"}
              `}
              >
                <gw.icon size={24} />
              </div>
              <span
                className={`text-sm font-bold ${isSelected ? "text-[#A655F7]" : "text-gray-500"}`}
              >
                {gw.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Forms */}
      <div className="bg-[#FAFAFA] rounded-[24px] p-6 border border-gray-100">
        {paymentGateway === "Mobile Money" ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-brand-black text-[14px]">
                {t("countryLabel")}
              </label>
              <div className="relative" ref={countryWrapperRef}>
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setIsCountryOpen(true);
                  }}
                  onFocus={() => setIsCountryOpen(true)}
                  placeholder={t("countryPlaceholder")}
                  className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all bg-white"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="rotate-90 text-gray-400" size={20} />
                </div>

                {isCountryOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 max-h-[200px] overflow-y-auto bg-white border border-gray-100 rounded-[24px] shadow-xl z-50 p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {mobileCountryOptions.filter((c) =>
                      c.name
                        .toLowerCase()
                        .includes(countrySearch.toLowerCase()),
                    ).length > 0 ? (
                      mobileCountryOptions
                        .filter((c) =>
                          c.name
                            .toLowerCase()
                            .includes(countrySearch.toLowerCase()),
                        )
                        .map((c) => (
                          <div
                            key={c.code}
                            className={`px-4 py-2.5 rounded-[12px] cursor-pointer text-sm font-medium transition-colors ${country === c.code ? "bg-[#F3F0FF] text-[#A655F7]" : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"}`}
                            onClick={() => {
                              setCountry(c.code);
                              setCountrySearch(c.name);
                              if (phoneNumber.trim()) {
                                setPhoneNumber((prev) =>
                                  applyDialCode(c.dialCode, prev),
                                );
                              }
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
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <label className="font-bold text-brand-black text-[14px]">
                  {t("networkProvider")}
                </label>
                {selectedMobileCountry && (
                  <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
                    {selectedMobileCountry.name}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedMobileCountry?.providers.map((provider) => {
                  const isActive = provider === mobileProvider;
                  return (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => setMobileProvider(provider)}
                      className={`flex items-center gap-2 rounded-[14px] px-4 py-3 border text-sm font-semibold transition-all shadow-sm ${
                        isActive
                          ? "bg-[#A655F7] text-white border-transparent shadow-[0_10px_30px_-12px_rgba(166,85,247,0.6)]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#A655F7] hover:text-[#A655F7]"
                      }`}
                    >
                      <span
                        className="inline-flex h-2 w-2 rounded-full bg-current"
                        aria-hidden
                      />
                      {provider}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-brand-black text-[14px]">
                {t("phoneLabel")}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (
                    paymentGateway === "Mobile Money" &&
                    selectedMobileCountry
                  ) {
                    setPhoneNumber(
                      applyDialCode(selectedMobileCountry.dialCode, val),
                    );
                  } else {
                    setPhoneNumber(val);
                  }
                }}
                placeholder={
                  paymentGateway === "Mobile Money" && selectedMobileCountry
                    ? `${selectedMobileCountry.dialCode} ${selectedMobileCountry.example}`
                    : t("phonePlaceholder")
                }
                className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-brand-black text-[14px]">
                {t("cardHolder")}
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder={t("cardHolderPlaceholder")}
                className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-brand-black text-[14px]">
                {t("cardNumber")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder={t("cardNumberPlaceholder")}
                  className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all pl-12"
                />
                <CreditCard
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-bold text-brand-black text-[14px]">
                  {t("expiry")}
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder={t("expiryPlaceholder")}
                  className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-bold text-brand-black text-[14px]">
                  {t("cvv")}
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder={t("cvvPlaceholder")}
                  className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-2">
        <button
          type="button"
          onClick={() => setStep(5)}
          disabled={isActionLoading}
          className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="flex-1 bg-brand-dark text-white font-bold text-[16px] rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isActionLoading ? <Loader2 className="animate-spin" /> : t("payNow")}
          {!isActionLoading && <ArrowLeft className="rotate-180" size={20} />}
        </button>
      </div>
    </form>
  );
};
