"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useGetCurrentUserQuery } from "@/lib/store/services/authApi";
import { Loader2 } from "lucide-react";

const SettingsSkeleton = () => (
  <div className="animate-pulse space-y-6 p-4 md:p-8">
    <div className="h-8 w-48 bg-gray-200 rounded-full" />
    <div className="flex gap-1 bg-white rounded-2xl p-1.5">
      <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
      <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
    </div>
    <div className="bg-white rounded-[32px] p-6 h-64" />
  </div>
);

const AccountInfoForm = dynamic(
  () =>
    import("@/components/dashboard/settings/AccountInfoForm").then(
      (m) => m.AccountInfoForm,
    ),
  {
    loading: () => (
      <div className="animate-pulse h-64 bg-gray-50 rounded-2xl" />
    ),
    ssr: false,
  },
);
const SecurityForm = dynamic(
  () =>
    import("@/components/dashboard/settings/SecurityForm").then(
      (m) => m.SecurityForm,
    ),
  {
    loading: () => (
      <div className="animate-pulse h-48 bg-gray-50 rounded-2xl" />
    ),
    ssr: false,
  },
);
const ProfileSummaryCard = dynamic(
  () =>
    import("@/components/dashboard/settings/ProfileSummaryCard").then(
      (m) => m.ProfileSummaryCard,
    ),
  {
    loading: () => (
      <div className="animate-pulse h-48 bg-gray-50 rounded-2xl" />
    ),
    ssr: false,
  },
);

type MobileTab = "profile" | "security";

export default function SettingsPage() {
  const t = useTranslations("dashboard.settings");
  const { isLoading } = useGetCurrentUserQuery();
  const [mobileTab, setMobileTab] = useState<MobileTab>("profile");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
        <p className="text-gray-500 font-medium">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto mb-20">
      <h1 className="text-2xl font-display font-bold text-brand-dark mb-6">
        {t("title")}
      </h1>

      {/* Mobile-only tab bar */}
      <div className="flex lg:hidden bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6 gap-1">
        {(["profile", "security"] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              mobileTab === tab
                ? "bg-brand-purple text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      {/* Desktop: 2-column layout — always show both sections */}
      <div className="hidden lg:grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        <ProfileSummaryCard />
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-display font-bold text-lg text-brand-dark mb-6">
              {t("form.sectionTitle")}
            </h2>
            <AccountInfoForm />
          </div>
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
            <SecurityForm />
          </div>
        </div>
      </div>

      {/* Mobile: single panel based on active tab */}
      <div className="lg:hidden space-y-6">
        {mobileTab === "profile" && (
          <>
            <ProfileSummaryCard />
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
              <h2 className="font-display font-bold text-lg text-brand-dark mb-6">
                {t("form.sectionTitle")}
              </h2>
              <AccountInfoForm />
            </div>
          </>
        )}
        {mobileTab === "security" && (
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <SecurityForm />
          </div>
        )}
      </div>
    </div>
  );
}
