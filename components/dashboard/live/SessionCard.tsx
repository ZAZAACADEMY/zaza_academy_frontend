import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Users,
  CalendarPlus,
  ChevronRight,
  Check,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import { components } from "@/lib/api/v1";

type Live = components["schemas"]["LiveDetail"];

export const SessionCard = ({ session }: { session: Live }) => {
  const t = useTranslations("dashboard.live.session");
  const [isReserved, setIsReserved] = useState(false); // UI-only for now

  // Parse datetime for display
  const startDate = new Date(session.start_datetime);
  const month = startDate
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const day = startDate.getDate().toString();
  const time = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Parse duration (e.g., "01:30:00" -> "1h 30m")
  const parseDuration = (durationStr: string | null | undefined) => {
    if (!durationStr) return "N/A";
    const [hours, minutes] = durationStr.split(":").map(Number);
    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim() || "N/A";
  };
  const durationDisplay = parseDuration(session.estimated_duration);

  // Assuming max_participants exists, spotsLeft is a UI-side concept without current_participants from API
  const spotsLeft = session.max_participants || 0; // Or a placeholder if not directly relevant
  const isLowSpots = spotsLeft > 0 && spotsLeft < 5;
  const isSoldOut = spotsLeft === 0;

  const handleReserve = () => {
    if (isSoldOut) return;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6C5CE7", "#a29bfe", "#fdcb6e", "#00b894"],
    });
    setIsReserved(true);
    // TODO: Integrate with actual API to reserve a spot
  };

  const handleAddToCalendar = () => {
    try {
      const durationMinutes =
        parseInt(session.estimated_duration?.split(":")[0] || "0") * 60 +
        parseInt(session.estimated_duration?.split(":")[1] || "0");
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

      const startISO = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endISO = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

      const url = new URL("https://calendar.google.com/calendar/render");
      url.searchParams.append("action", "TEMPLATE");
      url.searchParams.append("text", `Zaza Session: ${session.title}`);
      url.searchParams.append(
        "details",
        `${session.description}\n\nInstructor: ${session.instructor_name}`,
      );
      url.searchParams.append("dates", `${startISO}/${endISO}`);
      url.searchParams.append("location", session.meeting_link || "Online");

      window.open(url.toString(), "_blank");
    } catch (e) {
      console.error("Error creating calendar event", e);
      alert(t("calendarError"));
    }
  };

  return (
    <div className="bg-white rounded-4xl md:rounded-4xl p-1.5 md:p-2 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group border border-gray-100/80 flex flex-col">
      <div className="bg-linear-to-b from-brand-cream/30 via-white to-white rounded-3xl md:rounded-4xl p-4 md:p-6 flex flex-col h-full relative overflow-hidden z-10">
        {/* Top Section: Date & Tags */}
        <div className="flex justify-between items-start mb-6 relative z-20">
          <div className="flex items-start gap-3">
            {/* Calendar Widget */}
            <div className="flex flex-col items-center justify-center bg-white shadow-md shadow-brand-purple/5 border border-brand-purple/5 rounded-2xl w-16 h-16 group-hover:scale-105 transition-transform duration-300">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-purple/60">
                {month}
              </span>
              <span className="text-2xl font-display font-black text-brand-purple">
                {day}
              </span>
            </div>

            {/* Add to Calendar Button */}
            <button
              onClick={handleAddToCalendar}
              className="mt-1 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white border border-brand-purple/10 hover:border-brand-purple/30 text-brand-purple/40 hover:text-brand-purple rounded-full transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm"
              title={t("addCalendar")}
            >
              <CalendarPlus size={18} />
            </button>
          </div>

          {/* Tags Stack */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {session.meeting_platform && ( // Using meeting_platform as a category proxy
                <span className="bg-brand-primary/5 text-brand-primary text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {session.meeting_platform}
                </span>
              )}
              <span className="border border-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-full bg-white">
                {t("age")} {session.age_group}
              </span>
            </div>
            {isLowSpots && (
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                {t("spotsLeft", { count: spotsLeft })}
              </span>
            )}
            {isSoldOut && (
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <AlertCircle size={12} className="text-gray-400" />
                {t("sessionFull")}
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-4 md:mb-6 z-10">
          <h3 className="text-xl md:text-2xl font-display font-bold text-brand-dark mb-2 md:mb-3 leading-tight group-hover:text-brand-primary transition-colors">
            {session.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {session.description}
          </p>
        </div>

        {/* Recommended Badge (removed - not in API) */}

        {/* Footer Info */}
        <div className="mt-auto space-y-5">
          {/* Instructor & Time Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-gray-200 pt-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border border-white shadow-sm bg-blue-100 text-blue-600">
                <User size={18} /> {/* Generic User icon */}
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400">
                  {t("instructor")}
                </div>
                <div className="text-xs font-bold text-gray-700">
                  {session.instructor_name}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400">
                {t("time")}
              </div>
              <div className="text-xs font-bold text-brand-dark flex items-center justify-end gap-1">
                {time}
                <span className="font-normal text-gray-400">
                  ({durationDisplay})
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 text-center">
            <button
              onClick={handleReserve}
              disabled={isReserved || isSoldOut}
              className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-wide ${
                isReserved
                  ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                  : isSoldOut
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100"
                    : "bg-brand-dark text-white hover:bg-brand-primary shadow-lg shadow-brand-dark/20 hover:shadow-brand-primary/30 hover:-translate-y-0.5"
              }`}
            >
              {isReserved ? (
                <>
                  <span className="font-extrabold">{t("spotReserved")}</span>
                  <div className="bg-green-200 rounded-full p-0.5">
                    <Check
                      size={14}
                      className="text-green-700"
                      strokeWidth={3}
                    />
                  </div>
                </>
              ) : isSoldOut ? (
                <>
                  <span className="font-extrabold uppercase">
                    {t("sessionFull")}
                  </span>
                </>
              ) : (
                <>
                  <span>{t("reserveSpot")}</span>
                  <ChevronRight
                    size={16}
                    className="opacity-60 group-hover:translate-x-1 transition-transform"
                    strokeWidth={3}
                  />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-brand-primary/10 transition-colors" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
      </div>
    </div>
  );
};
