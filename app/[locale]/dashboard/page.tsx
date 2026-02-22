import React from "react";
import { useTranslations } from "next-intl";
// import { TrendingUp, Video, Award, Clock } from "lucide-react";
// import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChildrenList } from "@/components/dashboard/ChildrenList";
// import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
// import { RecentActivityCards } from "@/components/dashboard/RecentActivityCards";
// import { RecentAchievements } from "@/components/dashboard/RecentAchievements";

export default function DashboardPage() {
  const t = useTranslations("DashboardHome");

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#1F1235] mb-2">
          {t("welcomeTitle", { name: "Sarah" })}
        </h1>
        <p className="text-gray-500">{t("welcomeSubtitle")}</p>
      </div>

      {/* WhatsApp Community Invite */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-[32px] p-8 md:p-10 mb-8 shadow-xl shadow-green-900/10 group">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/10 rounded-full blur-xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30 hidden md:flex">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 fill-white"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                {t("whatsappTitle")}
              </h2>
              <p className="text-white/90 text-lg font-medium">
                {t("whatsappSubtitle")}
              </p>
            </div>
          </div>

          <a
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#128C7E] font-bold py-4 px-8 rounded-full flex items-center gap-3 hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            {t("whatsappButton")}
          </a>
        </div>
      </div>

      {/* Main Content Sections */}
      <ChildrenList />
    </div>
  );
}
