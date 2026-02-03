"use client";

import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { ChevronRight, Settings, Award, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

// Mock data duplicated from page.tsx for simplicity in this context
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
  },
];

export default function ChildDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const child = CHILDREN_DATA.find((c) => c.id === params.id);

  if (!child) {
    notFound(); // Or return a nice UI
    return <div className="p-8">Child not found</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto mb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/children">Children</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-bold text-brand-dark">{child.name}</span>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-purple-50">
            <Image
              src={child.avatar}
              alt={child.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-1">
              {child.name}
            </h1>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Age: {child.age}</span>
              <span>|</span>
              <span>Joined Dec 2025</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
          <Settings className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-purple-50 p-6 rounded-2xl">
          <p className="text-purple-600 text-sm font-bold mb-1">
            Total Progress
          </p>
          <p className="text-3xl font-bold text-brand-dark">
            {child.overallProgress}%
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl">
          <p className="text-blue-600 text-sm font-bold mb-1">Videos</p>
          <p className="text-3xl font-bold text-brand-dark">
            {child.stats.videosWatched}
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-2xl">
          <p className="text-yellow-600 text-sm font-bold mb-1">Badges</p>
          <p className="text-3xl font-bold text-brand-dark">
            {child.stats.badgesEarned}
          </p>
        </div>
        <div className="bg-pink-50 p-6 rounded-2xl">
          <p className="text-pink-600 text-sm font-bold mb-1">Study Time</p>
          <p className="text-3xl font-bold text-brand-dark">
            {child.stats.studyTime}h
          </p>
        </div>
      </div>

      {/* TBD Content */}
      <div className="bg-white rounded-[24px] border border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-400 mb-2">
          Detailed History
        </h3>
        <p className="text-gray-400 max-w-md">
          This section is under construction. It will contain detailed viewing
          history and quiz results.
        </p>
      </div>
    </div>
  );
}
