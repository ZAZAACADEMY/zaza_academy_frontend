"use client";

import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { ChevronRight, Settings, Award, Clock, Loader2, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useGetChildByIdQuery } from "@/lib/store/services/childrenApi";
import { getAvatarPath } from "@/lib/api/avatarUtils";

export default function ChildDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: child, isLoading, isError } = useGetChildByIdQuery(params.id);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
      </div>
    );
  }

  if (isError || !child) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 p-10 rounded-[32px] text-center text-red-600 border border-red-100">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Child not found</h2>
          <p className="mb-6">The profile you are looking for might have been removed.</p>
          <Link href="/dashboard/children" className="bg-red-600 text-white px-6 py-2 rounded-full font-bold">
            Back to Children
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto mb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/children">Children</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-bold text-brand-dark">{(child as any).pseudo || child.name}</span>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-purple-50 bg-gray-50">
            <Image
              src={getAvatarPath(child.avatar)}
              alt={(child as any).pseudo || child.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-1">
              {(child as any).pseudo || child.name}
            </h1>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Age: {child.age}</span>
              <span>|</span>
              <span>{child.age_group} Group</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
          <Settings className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      {/* Stats Cards (Currently Mock as API doesn't provide detailed stats yet) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-purple-50 p-6 rounded-2xl">
          <p className="text-purple-600 text-sm font-bold mb-1">
            Total Progress
          </p>
          <p className="text-3xl font-bold text-brand-dark">
            0%
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl">
          <p className="text-blue-600 text-sm font-bold mb-1">Videos</p>
          <p className="text-3xl font-bold text-brand-dark">
            0
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-2xl">
          <p className="text-yellow-600 text-sm font-bold mb-1">Badges</p>
          <p className="text-3xl font-bold text-brand-dark">
            0
          </p>
        </div>
        <div className="bg-pink-50 p-6 rounded-2xl">
          <p className="text-pink-600 text-sm font-bold mb-1">Study Time</p>
          <p className="text-3xl font-bold text-brand-dark">
            0h
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
          history and quiz results for {(child as any).pseudo || child.name}.
        </p>
      </div>
    </div>
  );
}
