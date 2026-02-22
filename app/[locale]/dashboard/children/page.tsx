import React from "react";
import { UserPlus } from "lucide-react";
import { ChildOverviewCard } from "@/components/dashboard/children/ChildOverviewCard";
import { RecentMilestones } from "@/components/dashboard/children/RecentMilestones";

const CHILDREN_DATA = [
  {
    id: "emma",
    name: "Emma",
    age: 12,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    overallProgress: 75,
    stats: {
      videosWatched: 18,
      badgesEarned: 7,
      studyTime: 6.8,
      weeklyProgress: 8,
    },
    currentActivity: {
      title: "Understanding Savings",
      type: "video" as const,
    },
  },
  {
    id: "noah",
    name: "Noah",
    age: 8,
    avatar:
      "https://images.unsplash.com/photo-1595152452543-e5cca283f58c?q=80&w=200&auto=format&fit=crop",
    overallProgress: 55,
    stats: {
      videosWatched: 13,
      badgesEarned: 1,
      studyTime: 3.1,
      weeklyProgress: 4,
    },
    currentActivity: {
      title: "Budget Basics",
      type: "video" as const,
    },
  },
];

export default function ChildrenPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 mb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">
            Children
          </h1>
          <p className="text-gray-500">
            Monitor your children's learning progress
          </p>
        </div>
        <button className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-opacity-90 transition-opacity self-start md:self-auto">
          <UserPlus className="w-5 h-5" />
          Add Children
        </button>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CHILDREN_DATA.map((child) => (
          <ChildOverviewCard key={child.id} child={child} />
        ))}
      </div>

      {/* Recent Milestones */}
      <RecentMilestones />
    </div>
  );
}
