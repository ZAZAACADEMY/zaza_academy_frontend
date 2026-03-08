"use client";

import React, { useState } from "react";
import { Lock, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePasswordResetRequestMutation, useGetCurrentUserQuery } from "@/lib/store/services/authApi";

export const SecurityForm = () => {
  const t = useTranslations("dashboard.settings.security");
  const { data: user } = useGetCurrentUserQuery();
  const [requestReset, { isLoading, isSuccess, isError, error }] = usePasswordResetRequestMutation();

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [localError, setLocalError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setLocalError("");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      setLocalError(t("errorMatch"));
      return;
    }

    if (passwords.new.length < 8) {
      setLocalError(t("errorLength"));
      return;
    }

    if (user?.email) {
      try {
        await requestReset({ email: user.email }).unwrap();
        setPasswords({ current: "", new: "", confirm: "" });
      } catch (err) {
        console.error("Password reset request failed:", err);
      }
    }
  };

  return (
    <div className="bg-[#F8F7FF] rounded-[24px] p-8">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-brand-purple" />
        <h2 className="text-lg font-bold text-brand-dark">{t("title")}</h2>
      </div>

      {(isError || localError) && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
          <AlertTriangle size={18} />
          {localError || (error as any)?.data?.detail || t("errorGeneric")}
        </div>
      )}

      {isSuccess ? (
        <div className="p-6 bg-green-50 border border-green-100 rounded-2xl text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-green-800 mb-2">{t("successTitle")}</h3>
          <p className="text-green-700 text-sm">
            {t("successBody")}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-green-600 font-bold hover:underline text-sm"
          >
            {t("successCta")}
          </button>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleUpdatePassword}>
          {/* Note: Current backend architecture uses OTP for password changes */}
          <p className="text-sm text-gray-500 mb-4 italic">
            {t("infoNote")}
          </p>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              {t("newPassword")}
            </label>
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={handleInputChange}
              required
              className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              {t("confirmNewPassword")}
            </label>
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handleInputChange}
              required
              className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-transparent border border-[#2D1B4E] text-[#2D1B4E] font-bold py-3 px-8 rounded-full hover:bg-[#2D1B4E] hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              {t("updateButton")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
