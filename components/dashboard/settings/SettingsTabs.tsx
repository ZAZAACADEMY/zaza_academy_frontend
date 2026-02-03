"use client";

import React from "react";
import { Link, usePathname } from "@/navigation";

const TABS = [
  { label: "Profile", href: "/dashboard/settings" },
  { label: "Notifications", href: "/dashboard/settings/notifications" },
  { label: "Accounts", href: "/dashboard/settings/accounts" },
  { label: "Security", href: "/dashboard/settings/security" },
];

export const SettingsTabs = () => {
  // For now, implementing simplistic tab UI. In a real app, these might be actual routes.
  // The screenshot shows "Profile" active while showing Account Info + Security.
  // I'll stick to a visual representation where "Profile" is active.
  const activeTab = "Profile";

  return (
    <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
      {TABS.map((tab) => (
        <button
          key={tab.label}
          className={`pb-4 text-sm font-bold transition-colors relative ${
            activeTab === tab.label
              ? "text-brand-purple"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
          {activeTab === tab.label && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-purple rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
};
