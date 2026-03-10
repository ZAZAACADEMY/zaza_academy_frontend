"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Calendar, CreditCard, Users, Globe, Mail, User } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useGetMeQuery } from "@/lib/store/services/usersApi";
import { useGetMyActiveSubscriptionsQuery } from "@/lib/store/services/subscriptionsApi";
import { useListChildrenQuery } from "@/lib/store/services/childrenApi";
import { getAvatarPath } from "@/lib/api/avatarUtils";

// Determine max children from plan name
function getMaxChildren(planName?: string): number {
  if (!planName) return 1;
  const lower = planName.toLowerCase();
  if (lower.includes("famille") || lower.includes("family")) return 3;
  return 1;
}

// Get the next payment date from the installment payments list
function getNextPaymentDate(payments: any[]): string | null {
  if (!payments?.length) return null;

  // Only 1_MONTH payments are installments
  const installments = payments.filter(
    (p: any) => p.duration === "1_MONTH" && p.status === "SUCCESSFUL",
  );
  if (!installments.length) return null;

  // Sort by coverage_end_date ascending
  const sorted = [...installments].sort(
    (a, b) =>
      new Date(a.coverage_end_date).getTime() -
      new Date(b.coverage_end_date).getTime(),
  );

  const latest = sorted[sorted.length - 1];
  const latestEnd = new Date(latest.coverage_end_date);
  const now = new Date();

  // If 3 payments already made, the full quarter is done — no next payment
  if (installments.length >= 3) return null;

  // If the latest coverage hasn't ended yet, next payment is at coverage_end_date
  if (latestEnd > now) return latestEnd.toISOString();

  return null;
}

export const ProfileSummaryCard = () => {
  const t = useTranslations("dashboard.settings.summary");
  const locale = useLocale();

  const { data: userData, isLoading: userLoading } = useGetMeQuery();
  const { data: activeSubs, isLoading: subsLoading } =
    useGetMyActiveSubscriptionsQuery();
  const { data: children, isLoading: childrenLoading } = useListChildrenQuery();

  const u = userData as any;
  const fullName = [u?.first_name, u?.last_name].filter(Boolean).join(" ");
  const initials =
    [u?.first_name?.[0], u?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() ||
    u?.email?.[0]?.toUpperCase() ||
    "?";
  const avatarSrc = u?.avatar ? getAvatarPath(u.avatar) : null;

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      return new Intl.DisplayNames(["en"], { type: "region" });
    }
  }, [locale]);

  const countryCode: string | undefined = u?.country?.code ?? u?.country;
  const countryName = countryCode
    ? (displayNames.of(countryCode) ?? countryCode)
    : null;

  // Active subscription (first one)
  const sub = activeSubs?.[0] as any;
  const payments: any[] = sub?.payments ?? [];
  const planName: string = sub?.plan_name ?? payments[0]?.plan_name ?? "";
  const isQuarterly = payments.some((p: any) => p.duration === "3_MONTHS");
  const maxChildren = getMaxChildren(planName);
  const nextPaymentDate = isQuarterly ? null : getNextPaymentDate(payments);

  const childCount = children?.length ?? 0;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const isLoading = userLoading || subsLoading || childrenLoading;

  if (isLoading) {
    return (
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 md:p-8 animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded-full w-40" />
            <div className="h-3 bg-gray-100 rounded-full w-56" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden mb-8">
      {/* Purple header with avatar */}
      <div
        className="px-6 pt-8 pb-14 relative"
        style={{
          background: "linear-gradient(135deg, #2D1B4E 0%, #7F26D9 100%)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={fullName || "avatar"}
                fill
                className="rounded-full object-cover border-4 border-white/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A655F7] to-[#F46AA3] flex items-center justify-center text-white font-bold text-xl border-4 border-white/30">
                {initials}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-white font-display font-bold text-xl leading-tight">
              {fullName || t("notSet")}
            </h2>
            <p className="text-white/70 text-sm mt-0.5">{u?.email}</p>
          </div>
        </div>
      </div>

      {/* Cards overlapping the header */}
      <div className="px-6  pb-8 space-y-6">
        {/* ─── Personal information ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-[13px] uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <User size={13} className="text-brand-purple" />
            {t("sectionIdentity")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow
              label={t("firstName")}
              value={u?.first_name}
              fallback={t("notSet")}
            />
            <InfoRow
              label={t("lastName")}
              value={u?.last_name}
              fallback={t("notSet")}
            />
            <InfoRow
              label={t("email")}
              value={u?.email}
              icon={<Mail size={13} className="text-gray-400" />}
            />
            <InfoRow
              label={t("country")}
              value={countryName}
              fallback={t("notSet")}
              icon={<Globe size={13} className="text-gray-400" />}
            />
          </div>
        </div>

        {/* ─── Subscription ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-[13px] uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <CreditCard size={13} className="text-brand-purple" />
            {t("sectionSubscription")}
          </h3>
          {!sub ? (
            <p className="text-gray-400 text-sm">{t("noSubscription")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow
                label={t("plan")}
                value={planName || sub?.plan_details}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Statut
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                    sub?.status === "ACTIVE" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      sub?.status === "ACTIVE" ? "bg-green-500" : "bg-red-400"
                    }`}
                  />
                  {sub?.status === "ACTIVE"
                    ? t("statusActive")
                    : t("statusExpired")}
                </span>
              </div>
              <InfoRow
                label="Type"
                value={isQuarterly ? t("typeQuarterly") : t("typeMonthly")}
              />
              {nextPaymentDate && (
                <InfoRow
                  label={t("nextPayment")}
                  value={formatDate(nextPaymentDate)}
                  icon={<Calendar size={13} className="text-gray-400" />}
                />
              )}
              {sub?.active_until && (
                <InfoRow
                  label={t("activeUntil")}
                  value={formatDate(sub.active_until)}
                  icon={<Calendar size={13} className="text-gray-400" />}
                />
              )}
            </div>
          )}
        </div>

        {/* ─── Children ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-[13px] uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <Users size={13} className="text-brand-purple" />
            {t("sectionChildren")}
          </h3>
          {sub && (
            <p className="text-xs text-gray-500 mb-4">
              {maxChildren <= 1
                ? t("childrenCount", { count: childCount, max: maxChildren })
                : t("childrenCountPlural", {
                    count: childCount,
                    max: maxChildren,
                  })}
            </p>
          )}
          {!children?.length ? (
            <p className="text-gray-400 text-sm">{t("noChildren")}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {children.map((child: any) => (
                <div
                  key={child.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#A655F7]/20 to-[#F46AA3]/20 flex items-center justify-center shrink-0">
                    {child.avatar ? (
                      <Image
                        src={getAvatarPath(child.avatar)}
                        alt={
                          (child as any).pseudo || child.name || "child avatar"
                        }
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-brand-purple font-bold text-sm">
                        {((child as any).pseudo || child.name)?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[#1F1235]">
                      {(child as any).pseudo || child.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {t("childAge", { age: child.age })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Reusable info row ───────────────────────────────────────────────────────
const InfoRow = ({
  label,
  value,
  fallback,
  icon,
}: {
  label: string;
  value?: string | null;
  fallback?: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1">
      {icon}
      {label}
    </span>
    <span className="font-semibold text-[15px] text-[#1F1235] break-all">
      {value || fallback || "—"}
    </span>
  </div>
);
