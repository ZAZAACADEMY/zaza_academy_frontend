"use client";

import React, { useState } from "react";
import {
  Lock,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Pencil,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  usePasswordResetRequestMutation,
  useGetCurrentUserQuery,
} from "@/lib/store/services/authApi";
import { toast } from "sonner";

export const SecurityForm = () => {
  const t = useTranslations("dashboard.settings.security");
  const { data: user } = useGetCurrentUserQuery();
  const [requestReset, { isLoading, isSuccess, isError, error }] =
    usePasswordResetRequestMutation();

  const [isEditing, setIsEditing] = useState(false);
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

  const handleCancel = () => {
    setPasswords({ current: "", new: "", confirm: "" });
    setLocalError("");
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!passwords.current) {
      setLocalError(t("errorCurrentRequired"));
      return;
    }
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
        toast.success(t("toastEmailSent"), { duration: 4000, icon: "✉️" });
      } catch (err) {
        console.error("Password reset request failed:", err);
        toast.error(t("errorGeneric"), { duration: 4000 });
      }
    }
  };

  // ── SUCCESS STATE ─────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-brand-purple" />
          <h2 className="text-lg font-bold text-brand-dark">{t("title")}</h2>
        </div>
        <div className="p-6 bg-green-50 border border-green-100 rounded-2xl text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-green-800 mb-2">
            {t("successTitle")}
          </h3>
          <p className="text-green-700 text-sm">{t("successBody")}</p>
          <button
            onClick={handleCancel}
            className="mt-4 text-green-600 font-bold hover:underline text-sm"
          >
            {t("successCta")}
          </button>
        </div>
      </div>
    );
  }

  // ── VIEW MODE ─────────────────────────────────────────────────────────────
  if (!isEditing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-brand-purple" />
            <h2 className="text-lg font-bold text-brand-dark">{t("title")}</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-semibold text-brand-purple hover:text-purple-700 transition-colors px-4 py-2 rounded-full border border-purple-200 hover:bg-purple-50"
          >
            <Pencil size={14} />
            {t("edit")}
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1">
            <Lock size={11} />
            {t("passwordLabel")}
          </span>
          <span className="font-semibold text-[15px] text-[#1F1235] tracking-[0.2em]">
            ••••••••
          </span>
        </div>
      </div>
    );
  }

  // ── EDIT MODE ─────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-brand-purple" />
          <h2 className="text-lg font-bold text-brand-dark">{t("title")}</h2>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50"
        >
          <X size={14} />
          {t("cancel")}
        </button>
      </div>

      {(isError || localError) && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
          <AlertTriangle size={18} />
          {localError || (error as any)?.data?.detail || t("errorGeneric")}
        </div>
      )}

      <p className="text-sm text-gray-500 italic mb-6">{t("infoNote")}</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-dark">
            {t("currentPassword")}
          </label>
          <input
            type="password"
            name="current"
            value={passwords.current}
            onChange={handleInputChange}
            required
            className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white"
          />
        </div>
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
            className="bg-[#2D1B4E] text-white font-bold py-3 px-10 rounded-full hover:bg-opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            {t("updateButton")}
          </button>
        </div>
      </form>
    </div>
  );
};
