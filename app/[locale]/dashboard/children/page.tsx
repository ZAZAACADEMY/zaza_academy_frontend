"use client";

import React, { useState } from "react";
import { UserPlus, Loader2, AlertTriangle, Users } from "lucide-react";
import { ChildOverviewCard } from "@/components/dashboard/children/ChildOverviewCard";
import { RecentMilestones } from "@/components/dashboard/children/RecentMilestones";
import { useListChildrenQuery } from "@/lib/store/services/childrenApi";
import { AddChildModal } from "@/components/dashboard/children/AddChildModal";

export default function ChildrenPage() {
  const { data: children, isLoading, isError } = useListChildrenQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-opacity-90 transition-opacity self-start md:self-auto"
        >
          <UserPlus className="w-5 h-5" />
          Add Children
        </button>
      </div>

      {/* Children Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-10 rounded-[32px] text-center text-red-600 border border-red-100">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Failed to load children</h2>
          <p>Please try again later.</p>
        </div>
      ) : children?.length === 0 ? (
        <div className="bg-gray-50 p-20 rounded-[32px] text-center border-2 border-dashed border-gray-200">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No profiles yet</h2>
          <p className="text-gray-500 mb-8">Add your first child profile to start monitoring their progress.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-purple text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all"
          >
            Add My First Child
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children?.map((child) => (
            <ChildOverviewCard key={child.id} child={child} />
          ))}
        </div>
      )}

      {/* Recent Milestones */}
      <RecentMilestones />

      <AddChildModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
