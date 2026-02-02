import React from "react";
import { Users } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Emma completed a video",
    subtitle: "Introduction to Saving Money",
    time: "2 hours ago",
    user: "Emma",
  },
  {
    id: 2,
    title: "Noah started a quiz",
    subtitle: "Personal Finance 101",
    time: "4 hours ago",
    user: "Noah",
  },
];

export const RecentActivityCards = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-[#1F1235]">Recent Activity</h3>

      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white p-5 rounded-[24px] shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users size={18} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F1235]">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500">{activity.subtitle}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4 pl-1">{activity.time}</p>

          <button className="w-full py-2 bg-[#311F54] text-white text-xs font-bold rounded-xl hover:bg-opacity-90 transition-opacity">
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};
