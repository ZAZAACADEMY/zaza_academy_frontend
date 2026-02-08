import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  Users,
  CalendarPlus,
  ChevronRight,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";

interface Child {
  name: string;
  avatar: string;
}

interface SessionProps {
  title: string;
  description: string;
  ageRange: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  spotsLeft: number;
  recommendedFor?: Child[];
  category?: string;
}

export const SessionCard = ({ session }: { session: SessionProps }) => {
  const t = useTranslations("dashboard.live.session");
  const [isReserved, setIsReserved] = useState(false);
  const isLowSpots = session.spotsLeft < 5;
  const isSoldOut = session.spotsLeft === 0;

  // Safe date parsing
  let month = "JAN";
  let day = "01";
  try {
    const dateParts = session.date.split(", ");
    const monthDay = dateParts.length > 2 ? dateParts[1] : dateParts[0];
    const parts = monthDay.split(" ");
    if (parts.length >= 2) {
      month = parts[0];
      day = parts[1];
    }
  } catch (e) {
    // Fallback if parsing fails
  }

  // Generate consistent pastel color from name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-purple-100 text-purple-600",
      "bg-blue-100 text-blue-600",
      "bg-teal-100 text-teal-600",
      "bg-rose-100 text-rose-600",
      "bg-indigo-100 text-indigo-600",
      "bg-orange-100 text-orange-600",
    ];
    return colors[name.length % colors.length];
  };

  const handleReserve = () => {
    if (isSoldOut) return;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6C5CE7", "#a29bfe", "#fdcb6e", "#00b894"],
    });
    setIsReserved(true);
  };

  const handleAddToCalendar = () => {
    try {
      // Clean date string: remove "Tomorrow, " etc.
      // Expected input: "Tomorrow, January 18, 2026" -> "January 18, 2026"
      const dateStringClean = session.date
        .split(",")
        .slice(-2)
        .join(",")
        .trim();

      // Clean time string: remove timezone for parsing
      const timeStringClean = session.time.replace(/ EST| EDT/g, "");
      const startDate = new Date(`${dateStringClean} ${timeStringClean}`);

      const durationMinutes = parseInt(session.duration) || 60;
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

      const startISO = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endISO = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

      const url = new URL("https://calendar.google.com/calendar/render");
      url.searchParams.append("action", "TEMPLATE");
      url.searchParams.append("text", `Zaza Session: ${session.title}`);
      url.searchParams.append(
        "details",
        `${session.description}\n\nInstructor: ${session.instructor}`,
      );
      url.searchParams.append("dates", `${startISO}/${endISO}`);
      url.searchParams.append("location", "Zaza Online Classroom");

      window.open(url.toString(), "_blank");
    } catch (e) {
      console.error("Error creating calendar event", e);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-2 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group border border-gray-100/80 flex flex-col">
      <div className="bg-gradient-to-b from-brand-cream/30 via-white to-white rounded-[2rem] p-6 flex flex-col h-full relative overflow-hidden z-10">
        {/* Top Section: Date & Tags */}
        <div className="flex justify-between items-start mb-6 relative z-20">
          <div className="flex items-start gap-3">
            {/* Calendar Widget */}
            <div className="flex flex-col items-center justify-center bg-white shadow-md shadow-brand-purple/5 border border-brand-purple/5 rounded-2xl w-16 h-16 group-hover:scale-105 transition-transform duration-300">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-purple/60">
                {month?.substring(0, 3)}
              </span>
              <span className="text-2xl font-display font-black text-brand-purple">
                {day}
              </span>
            </div>

            {/* Add to Calendar Button - Now next to date */}
            <button
              onClick={handleAddToCalendar}
              className="mt-1 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white border border-brand-purple/10 hover:border-brand-purple/30 text-brand-purple/40 hover:text-brand-purple rounded-full transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm"
              title="Add to Google Calendar"
            >
              <CalendarPlus size={18} />
            </button>
          </div>

          {/* Tags Stack */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {session.category && (
                <span className="bg-brand-primary/5 text-brand-primary text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {session.category}
                </span>
              )}
              <span className="border border-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-full bg-white">
                {t("age")} {session.ageRange}
              </span>
            </div>
            {isLowSpots && (
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                {t("spotsLeft", { count: session.spotsLeft })}
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-6 z-10">
          <h3 className="text-2xl font-display font-bold text-brand-dark mb-3 leading-tight group-hover:text-brand-primary transition-colors">
            {session.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {session.description}
          </p>
        </div>

        {/* Recommended Badge (if any) */}
        {session.recommendedFor && session.recommendedFor.length > 0 && (
          <div className="mb-6 inline-flex items-center gap-2 bg-brand-cream/30 border border-brand-cream/50 rounded-xl p-2 pr-4 self-start">
            <div className="flex -space-x-2">
              {session.recommendedFor.map((child, i) => (
                <div
                  key={i}
                  className="relative w-6 h-6 rounded-full border border-white overflow-hidden bg-white"
                >
                  <Image
                    src={child.avatar}
                    alt={child.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-brand-tertiary uppercase tracking-wide">
              {t("recommended")}
            </span>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-auto space-y-5">
          {/* Instructor & Time Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-gray-200 pt-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border border-white shadow-sm ${getAvatarColor(
                  session.instructor,
                )}`}
              >
                {session.instructor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400">
                  {t("instructor")}
                </div>
                <div className="text-xs font-bold text-gray-700">
                  {session.instructor}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400">
                {t("time")}
              </div>
              <div className="text-xs font-bold text-brand-dark flex items-center justify-end gap-1">
                {session.time}
                <span className="font-normal text-gray-400">
                  ({session.duration})
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
