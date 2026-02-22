import React from "react";
import { Award } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "First Savings Goal",
    subtitle: "Emma",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    id: 2,
    title: "Budget Master",
    subtitle: "Noah",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    id: 3,
    title: "10 Videos Complete",
    subtitle: "Emma",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
];

export const RecentAchievements = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#1F1235]">
          Recent Achievements
        </h3>
        <button className="text-[#A655F7] text-xs font-bold hover:underline">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {achievements.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-2">
            <div className={`p-3 rounded-xl ${item.iconBg}`}>
              <Award size={20} className={item.iconColor} />
            </div>
            <div>
              <h4 className="font-bold text-[#1F1235] text-sm">{item.title}</h4>
              <p className="text-gray-500 text-xs">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
