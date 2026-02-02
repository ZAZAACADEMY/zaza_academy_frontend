import React from "react";
import { TrendingUp, Video, Award, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChildrenList } from "@/components/dashboard/ChildrenList";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { RecentActivityCards } from "@/components/dashboard/RecentActivityCards";
import { RecentAchievements } from "@/components/dashboard/RecentAchievements";

export default function DashboardPage() {
  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#1F1235] mb-2">
          Welcome back, Sarah! 👋
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your children's learning
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          label="Total Progress"
          value="73%"
          subtext="+12% this week"
          trend="+12% this week"
          icon={TrendingUp}
          iconBg="bg-green-50"
          iconColor="text-green-500"
        />
        <StatsCard
          label="Videos Watched"
          value="24"
          subtext="This month"
          icon={Video}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
        />
        <StatsCard
          label="Achievements"
          value="12"
          subtext="This month"
          icon={Award}
          iconBg="bg-yellow-50"
          iconColor="text-yellow-500"
        />
        <StatsCard
          label="Study Time"
          value="8.5h"
          subtext="This week"
          icon={Clock}
          iconBg="bg-pink-50"
          iconColor="text-pink-500"
        />
      </div>

      {/* Main Content Sections */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column (Wider) */}
        <div className="w-full xl:w-2/3 flex flex-col gap-6">
          <ChildrenList />
          <RecentActivityList />
        </div>

        {/* Right Column (Narrower) */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6">
          <RecentActivityCards />
          <RecentAchievements />
        </div>
      </div>
    </div>
  );
}
