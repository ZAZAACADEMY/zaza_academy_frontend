import React from "react";
import { SettingsTabs } from "@/components/dashboard/settings/SettingsTabs";
import { AccountInfoForm } from "@/components/dashboard/settings/AccountInfoForm";
import { SecurityForm } from "@/components/dashboard/settings/SecurityForm";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("dashboard.settings");

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto mb-20">
      <h1 className="text-2xl font-display font-bold text-brand-dark mb-6">
        {t("title")}
      </h1>

      <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
        <SettingsTabs />

        <div className="space-y-8">
          <AccountInfoForm />
          <SecurityForm />
        </div>
      </div>
    </div>
  );
}
