"use client";

import React from "react";
import { RecordingCard } from "@/components/dashboard/live/RecordingCard";
import { Link } from "@/navigation";
import { ChevronLeft } from "lucide-react";
import { PAST_SESSIONS } from "@/lib/data/liveSessions";
import { useTranslations } from "next-intl";

export default function ArchivePage() {
  const t = useTranslations("dashboard.live");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 mb-20">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/live"
          className="flex items-center gap-2 text-gray-500 hover:text-brand-purple transition-colors w-fit"
        >
          <ChevronLeft size={20} />
          <span className="font-bold">{t("backToLive")}</span>
        </Link>

        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-4">
            {t("archiveTitle")}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
            {t("archiveDescription")}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PAST_SESSIONS.map((session, index) => (
          <RecordingCard key={index} recording={session} />
        ))}
      </div>
    </div>
  );
}
