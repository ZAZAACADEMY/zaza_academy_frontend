"use client";

import React from "react";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

export const SecurityForm = () => {
  const t = useTranslations("dashboard.settings.security");

  return (
    <div className="bg-[#F8F7FF] rounded-[24px] p-8">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-brand-purple" />
        <h2 className="text-lg font-bold text-brand-dark">{t("title")}</h2>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-dark">
            {t("currentPassword")}
          </label>
          <input
            type="password"
            className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-dark">
            {t("newPassword")}
          </label>
          <input
            type="password"
            className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-dark">
            {t("confirmNewPassword")}
          </label>
          <input
            type="password"
            className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white"
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="bg-transparent border border-[#2D1B4E] text-[#2D1B4E] font-bold py-3 px-8 rounded-full hover:bg-gray-50 transition-colors"
          >
            {t("updateButton")}
          </button>
        </div>
      </form>
    </div>
  );
};
