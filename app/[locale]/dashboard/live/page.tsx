"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  useGetUpcomingLivesQuery,
  useGetPastLivesQuery,
} from "@/lib/store/services/contentApi";
import { Loader2, AlertTriangle } from "lucide-react";

const SessionCard = dynamic(
  () =>
    import("@/components/dashboard/live/SessionCard").then(
      (m) => m.SessionCard,
    ),
  {
    loading: () => (
      <div className="animate-pulse bg-white rounded-3xl h-56 shadow-sm" />
    ),
    ssr: false,
  },
);
const RecordingCard = dynamic(
  () =>
    import("@/components/dashboard/live/RecordingCard").then(
      (m) => m.RecordingCard,
    ),
  {
    loading: () => (
      <div className="animate-pulse bg-white rounded-3xl h-40 shadow-sm" />
    ),
    ssr: false,
  },
);

export default function LiveSessionsPage() {
  const t = useTranslations("dashboard.live");

  const {
    data: upcomingLivesData,
    isLoading: isLoadingUpcoming,
    isError: isErrorUpcoming,
  } = useGetUpcomingLivesQuery(undefined, {
    pollingInterval: 90 * 1000, // refresh every 90 seconds
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const {
    data: pastLivesData,
    isLoading: isLoadingPast,
    isError: isErrorPast,
  } = useGetPastLivesQuery(undefined, {
    pollingInterval: 5 * 60 * 1000, // refresh every 5 minutes
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const isLoading = isLoadingUpcoming || isLoadingPast;
  const isError = isErrorUpcoming || isErrorPast;

  const upcomingSessions = upcomingLivesData?.results || [];
  const pastSessions = pastLivesData?.results || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-brand-purple" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-700 p-8 rounded-2xl">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-bold mb-2">{t("errorLoadingSessions")}</h3>
        <p className="text-center text-sm">{t("errorTryAgain")}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12 mb-20">
      {/* Header */}
      <div className="relative">
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-display font-bold text-brand-dark mb-2 md:mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-500 text-sm md:text-lg leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -z-10 opacity-50 hidden md:block">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="100"
              fill="url(#paint0_radial)"
              fillOpacity="0.2"
            />
            <defs>
              <radialGradient
                id="paint0_radial"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(100 100) rotate(90) scale(100)"
              >
                <stop stopColor="#6C5CE7" />
                <stop offset="1" stopColor="#6C5CE7" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <section>
        <div className="flex items-center gap-3 mb-5 md:mb-8">
          <div className="w-2 h-6 md:h-8 bg-brand-primary rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
            {t("upcomingTitle")}
          </h2>
        </div>

        {upcomingSessions.length === 0 ? (
          <p className="text-gray-500">{t("noUpcomingSessions")}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {upcomingSessions.map((session) => (
              <SessionCard key={session.id} session={session as any} />
            ))}
          </div>
        )}
      </section>

      {/* Past Sessions */}
      <section className="bg-gray-50 -mx-4 md:-mx-8 p-4 md:p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-5 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 md:h-8 bg-brand-purple rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
              {t("recordingsTitle")}
            </h2>
          </div>
          <Link
            href="/dashboard/live/archive" // This might need a separate page for full archive
            className="text-brand-purple font-bold text-sm hover:underline"
          >
            {t("viewArchive")}
          </Link>
        </div>

        {pastSessions.length === 0 ? (
          <p className="text-gray-500">{t("noPastSessions")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastSessions.slice(0, 3).map((session) => (
              <RecordingCard key={session.id} recording={session as any} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
