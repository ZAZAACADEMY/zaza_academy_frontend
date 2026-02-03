"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { Video, Award, Clock, TrendingUp, ChevronRight } from "lucide-react";

interface ChildStats {
  videosWatched: number;
  badgesEarned: number;
  studyTime: number; // in hours
  weeklyProgress: number; // percentage
}

interface CurrentActivity {
  title: string;
  type: "video" | "quiz" | "game";
}

interface ChildProps {
  id: string;
  name: string;
  age: number;
  avatar: string;
  overallProgress: number;
  stats: ChildStats;
  currentActivity: CurrentActivity;
}

export const ChildOverviewCard = ({ child }: { child: ChildProps }) => {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <Image
              src={child.avatar}
              alt={child.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-dark">{child.name}</h3>
            <p className="text-gray-500 text-sm">Age {child.age}</p>
          </div>
        </div>
        <Link
          href={`/dashboard/children/${child.id}`}
          className="flex items-center gap-1 text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors"
        >
          View Profile <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span className="text-gray-600">Overall Progress</span>
          <span className="text-purple-600 font-bold">
            {child.overallProgress}%
          </span>
        </div>
        <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full"
            style={{ width: `${child.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Videos */}
        <div className="bg-[#EFEEFF] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Videos</span>
          </div>
          <p className="text-2xl font-bold text-brand-dark">
            {child.stats.videosWatched}
          </p>
        </div>

        {/* Badges */}
        <div className="bg-[#FFF8E6] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">Badges</span>
          </div>
          <p className="text-2xl font-bold text-brand-dark">
            {child.stats.badgesEarned}
          </p>
        </div>

        {/* Study Time */}
        <div className="bg-[#FFF0F4] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-gray-600">
              Study Time
            </span>
          </div>
          <p className="text-2xl font-bold text-brand-dark">
            {child.stats.studyTime}h
          </p>
        </div>

        {/* This Week */}
        <div className="bg-[#F0FFF4] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">This Week</span>
          </div>
          <p className="text-2xl font-bold text-brand-dark">
            +{child.stats.weeklyProgress}%
          </p>
        </div>
      </div>

      {/* Current Activity - Pushed to bottom if space allows, but in this layout it's part of flow */}
      <div className="mt-auto border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500 mb-3 block">Current Activity</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Video className="w-4 h-4 text-purple-600" />
          </div>
          <span className="font-semibold text-brand-dark">
            {child.currentActivity.title}
          </span>
        </div>
      </div>
    </div>
  );
};
