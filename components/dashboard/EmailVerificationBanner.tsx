"use client";

import React, { useState } from "react";
import { Mail, X, RefreshCw, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetMeQuery } from "@/lib/store/services/usersApi";
import { useResendOtpMutation } from "@/lib/store/services/authApi";

export const EmailVerificationBanner = () => {
  const t = useTranslations("EmailVerificationBanner");
  const { data: user } = useGetMeQuery();
  const [resendOtp, { isLoading, isSuccess }] = useResendOtpMutation();
  const [dismissed, setDismissed] = useState(false);

  const u = user as any;
  const isVerified = !!u?.email_verified_at;

  if (isVerified || dismissed) return null;

  const handleResend = async () => {
    if (u?.email) {
      try {
        await resendOtp({ email: u.email }).unwrap();
      } catch {
        // silently fail — user can retry
      }
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="flex items-start gap-3">
        <Mail size={16} className="text-amber-600 shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          {isSuccess ? (
            <span className="flex items-center gap-1.5 font-medium text-sm text-green-700">
              <CheckCircle size={14} />
              {t("sent")}
            </span>
          ) : (
            <>
              <p className="text-sm text-amber-800 leading-snug">
                <span className="font-semibold">{t("title")}</span>{" "}
                <span className="break-all">{t("body", { email: u?.email ?? "" })}</span>
              </p>
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="mt-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 underline underline-offset-2 flex items-center gap-1 disabled:opacity-50 transition-colors"
              >
                {isLoading && <RefreshCw size={12} className="animate-spin" />}
                {t("resend")}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-amber-500 hover:text-amber-700 transition-colors mt-0.5"
          aria-label={t("dismiss")}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
