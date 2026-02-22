import React from "react";
import {
  Award,
  Lock,
  Sparkles,
  TrendingUp,
  Heart,
  Brain,
  Flame,
  Coins,
} from "lucide-react";

interface AchievementProps {
  id: string;
  title: string;
  description: string;
  dateEarned?: string;
  icon: string;
  type: "badge" | "certificate" | "milestone";
  childName: string;
  isLocked: boolean;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "award":
      return Award;
    case "piggy-bank":
      return Coins;
    case "trending-up":
      return TrendingUp;
    case "heart":
      return Heart;
    case "brain":
      return Brain;
    case "fire":
      return Flame;
    default:
      return Award;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case "badge":
      return {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
      };
    case "milestone":
      return {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
      };
    case "certificate":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
      };
  }
};

export const AchievementCard = ({
  achievement,
}: {
  achievement: AchievementProps;
}) => {
  const Icon = getIcon(achievement.icon);
  const colors = getColor(achievement.type);

  if (achievement.isLocked) {
    return (
      <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 opacity-70 flex items-center gap-4 relative overflow-hidden group">
        <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center shrink-0">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-500 mb-1">
            {achievement.title}
          </h3>
          <p className="text-sm text-gray-400">{achievement.description}</p>
        </div>
        {/* Shine effect on hover just for fun */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-3xl p-6 border ${colors.border} shadow-sm flex items-start gap-4 relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-4">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}
        >
          {achievement.type}
        </span>
      </div>

      <div
        className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0 shadow-inner`}
      >
        <Icon className="w-8 h-8" />
      </div>

      <div className="pt-2">
        <h3 className="text-lg font-bold text-brand-dark mb-1">
          {achievement.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 leading-snug">
          {achievement.description}
        </p>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm">
            {achievement.childName.charAt(0)}
          </div>
          <span className="text-xs font-medium text-gray-400">
            Earned {achievement.dateEarned}
          </span>
        </div>
      </div>
    </div>
  );
};
