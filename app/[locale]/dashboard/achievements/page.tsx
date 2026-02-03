import React from "react";
import { Award, Trophy } from "lucide-react";
import { MOCK_ACHIEVEMENTS } from "@/lib/data/achievements";
import { AchievementCard } from "@/components/dashboard/achievements/AchievementCard";

export default function AchievementsPage() {
  const unlockedCount = MOCK_ACHIEVEMENTS.filter((a) => !a.isLocked).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 mb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">
            Achievements
          </h1>
          <p className="text-gray-500">
            Celebrating success and milestones in your financial journey.
          </p>
        </div>

        <div className="bg-yellow-50 text-yellow-700 px-6 py-3 rounded-full font-bold flex items-center gap-3 border border-yellow-100 shadow-sm">
          <Trophy className="w-5 h-5" />
          <span>
            {unlockedCount} / {MOCK_ACHIEVEMENTS.length} Earned
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ACHIEVEMENTS.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}
