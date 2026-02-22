import React from "react";
import { TrendingUp, Video, Award, Clock } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: string;
}

export const StatsCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
}: StatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-500 text-sm font-medium">{label}</span>
        <div className={`p-2 rounded-xl ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-[#1F1235] mb-1">{value}</h3>
        <p
          className={`text-xs font-medium ${trend ? "text-green-500" : "text-gray-400"}`}
        >
          {trend || subtext}
        </p>
      </div>
    </div>
  );
};
