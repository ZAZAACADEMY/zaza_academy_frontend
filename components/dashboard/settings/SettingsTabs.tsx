"use client";

import React from "react";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";

export const SettingsTabs = () => {
  const t = useTranslations("dashboard.settings.tabs");
  // For now, implementing simplistic tab UI. In a real app, these might be actual routes.
  // The screenshot shows "Profile" active while showing Account Info + Security.
  // I'll stick to a visual representation where "Profile" is active.
  const activeTab = "Profile";

  const TABS = [
    { label: t("profile"), href: "/dashboard/settings", id: "Profile" },
    {
      label: t("notifications"),
      href: "/dashboard/settings/notifications",
      id: "Notifications",
    },
    {
      label: t("accounts"),
      href: "/dashboard/settings/accounts",
      id: "Accounts",
    },
    {
      label: t("security"),
      href: "/dashboard/settings/security",
      id: "Security",
    },
  ];

  return (
    <div className="flex items-center gap-4 md:gap-8 border-b border-gray-200 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${
            activeTab === tab.id
              ? "text-brand-purple"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-purple rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
};
