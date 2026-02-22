import React from "react";
import { Video, Award, Users } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "video",
    icon: Video,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    title: "Emma completed a video",
    subtitle: "Introduction to Saving Money",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "badge",
    icon: Award,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-50",
    title: "Noah earned a badge",
    subtitle: "Budget Master Achievement",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "session",
    icon: Users,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    title: "Emma joined a live session",
    subtitle: "Understanding Money Value",
    time: "Yesterday",
  },
];

export const RecentActivityList = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm h-full">
      <h3 className="text-xl font-bold text-[#1F1235] mb-6">Recent Activity</h3>

      <div className="flex flex-col gap-4">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#FAFAFA] transition-colors"
          >
            <div className={`p-3 rounded-xl ${item.iconBg} shrink-0`}>
              <item.icon size={20} className={item.iconColor} />
            </div>

            <div>
              <h4 className="font-bold text-[#1F1235] text-sm">{item.title}</h4>
              <p className="text-gray-500 text-xs mb-1">{item.subtitle}</p>
              <p className="text-gray-400 text-[10px]">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
