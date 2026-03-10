"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Globe, Pencil } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useGetMeQuery } from "@/lib/store/services/usersApi";
import { getAvatarPath } from "@/lib/api/avatarUtils";

export const UserProfileCard = () => {
  const t = useTranslations("DashboardHome.profile");
  const locale = useLocale();
  const { data: user, isLoading } = useGetMeQuery();

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      return new Intl.DisplayNames(["en"], { type: "region" });
    }
  }, [locale]);

  const u = user as any;
  const fullName = [u?.first_name, u?.last_name].filter(Boolean).join(" ");
  const countryCode: string | undefined = u?.country?.code ?? u?.country;
  const countryName = countryCode
    ? (displayNames.of(countryCode) ?? countryCode)
    : null;
  const avatarSrc = getAvatarPath(u?.avatar);

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8 w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl text-[#1F1235]">
          {t("title")}
        </h2>
        <Link
          href={`/${locale}/dashboard/settings`}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-purple hover:underline"
        >
          <Pencil size={14} />
          {t("editLink")}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 bg-gray-200 rounded-full w-1/3" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative w-16 h-16 shrink-0">
            <Image
              src={avatarSrc}
              alt={fullName || "avatar"}
              fill
              className="rounded-full object-cover border-2 border-[#EDE9FE]"
            />
          </div>

          {/* Info grid */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 w-full">
            {/* Full name */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {t("name")}
              </span>
              <span className="font-semibold text-[#1F1235] text-[15px]">
                {fullName || t("noName")}
              </span>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                <Mail size={11} />
                {t("email")}
              </span>
              <span className="font-semibold text-[#1F1235] text-[15px] break-all">
                {u?.email || "—"}
              </span>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                <Globe size={11} />
                {t("country")}
              </span>
              <span className="font-semibold text-[#1F1235] text-[15px]">
                {countryName || t("noCountry")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
