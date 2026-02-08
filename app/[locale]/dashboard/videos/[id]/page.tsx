"use client";

import React, { useState } from "react";
import { Link } from "@/navigation";
import {
  ArrowLeft,
  Play,
  Share2,
  CheckCircle,
  Heart,
  Clock,
  Sparkles,
} from "lucide-react";
import { useParams, notFound } from "next/navigation";
import { useRouter } from "@/navigation";
import { MOCK_VIDEOS } from "@/lib/data/videos";
import { AddChildModal } from "@/components/dashboard/children/AddChildModal";
import {
  childrenService,
  CreateChildData,
  UpdateChildData,
} from "@/lib/api/children";
import confetti from "canvas-confetti";
import { useFavorites } from "@/components/dashboard/videos/FavoritesContext";

export default function VideoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();

  const video = MOCK_VIDEOS.find((v) => v.id === id);

  if (!video) {
    notFound();
  }

  const isFavorite = checkIsFavorite(video.id);

  const handleSaveChild = async (data: CreateChildData | UpdateChildData) => {
    try {
      await childrenService.create(data as CreateChildData);
    } catch (err) {
      console.warn("Demo mode: Child created locally");
    } finally {
      setIsAddChildModalOpen(false);
    }
  };

  const handleToggleComplete = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    if (newState) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7F26D9", "#C23CDD", "#DC2663", "#FFD700"],
      });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link
          href="/dashboard/videos"
          className="hover:text-brand-dark flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Video Library
        </Link>
        <span>/</span>
        <span>{video.category}</span>
        <span>/</span>
        <span className="text-brand-dark font-bold">{video.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video Player Placeholder */}
          <div className="aspect-video bg-brand-dark rounded-[32px] flex items-center justify-center relative overflow-hidden group shadow-2xl shadow-brand-purple/20 border-4 border-white ring-1 ring-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#432C7A] to-brand-accent opacity-90" />

            <button className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:bg-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-30"></div>
              <Play className="w-10 h-10 text-white fill-white ml-1.5 drop-shadow-md" />
            </button>
            <div className="absolute bottom-8 text-white/80 text-center w-full font-bold tracking-widest uppercase text-xs">
              Start Learning
            </div>
          </div>

          {/* Video Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                {video.category}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                {video.ageGroup}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Play size={14} /> {video.duration}
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-dark mb-4">
              {video.title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {video.longDescription || video.description}
            </p>

            {/* Action Bar */}
            <div className="flex items-center justify-between border-t border-b border-gray-100 py-6 mt-8">
              <button
                onClick={() => toggleFavorite(video.id)}
                className="group flex items-center gap-3 text-gray-400 hover:text-brand-accent transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${isFavorite ? "bg-brand-accent/10 border-brand-accent/20" : "bg-gray-50 border-gray-100 group-hover:border-brand-accent/20 group-hover:bg-brand-accent/10"}`}
                >
                  <Heart
                    size={22}
                    className={`transition-colors ${isFavorite ? "fill-brand-accent text-brand-accent" : "group-hover:fill-brand-accent text-current"}`}
                  />
                </div>
                <span
                  className={`font-bold text-sm transition-colors ${isFavorite ? "text-brand-accent" : "text-gray-500 group-hover:text-brand-accent"}`}
                >
                  {isFavorite ? "Remove from Favourites" : "Add to Favourites"}
                </span>
              </button>

              <button
                onClick={handleToggleComplete}
                className={`
                    relative overflow-hidden px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-500 flex items-center gap-3 shadow-lg hover:-translate-y-0.5 active:translate-y-0
                    ${
                      isCompleted
                        ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20"
                        : "bg-brand-dark text-white hover:bg-[#432C7A] shadow-brand-purple/20"
                    }
                `}
              >
                {/* Background Animation Flash */}
                <span
                  className={`absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 transition-transform duration-1000 ${isCompleted ? "translate-x-full" : "-translate-x-full"}`}
                />

                {isCompleted ? (
                  <>
                    <CheckCircle size={20} className="text-white" />
                    <span>Completed!</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-brand-accent border-t-transparent animate-[spin_3s_linear_infinite]" />
                    <span>Mark as Complete</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100">
            <h2 className="text-xl font-bold text-brand-dark mb-6">
              What You'll Learn
            </h2>
            <ul className="space-y-4">
              {(video.learningPoints || []).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Progress */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-brand-dark mb-4">Your Progress</h3>
            <div className="mb-2 flex justify-between text-xs font-bold">
              <span className="text-gray-500">{video.category}</span>
              <span className="text-brand-accent">{video.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full w-full mb-2 overflow-hidden">
              <div
                className="h-full bg-brand-accent rounded-full"
                style={{ width: `${video.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mb-6">
              {video.completedLessons} of {video.totalLessons} lessons complete
            </p>
            <button
              onClick={() => setIsAddChildModalOpen(true)}
              className="w-full py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Enroll Another Child
            </button>
          </div>

          {/* Up Next */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-brand-dark mb-4">Up Next</h3>
            <div className="space-y-4">
              {(video.upNext || []).map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const nextVideo = MOCK_VIDEOS.find(
                      (v) => v.title === item.title,
                    );
                    if (nextVideo)
                      router.push(`/dashboard/videos/${nextVideo.id}`);
                  }}
                  className="flex gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 leading-tight mb-1">
                      {video.title}
                    </h4>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} className="inline" /> {video.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/dashboard/videos")}
              className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Browse All Videos <ArrowLeft className="rotate-180" size={16} />
            </button>
          </div>
        </div>
      </div>

      <AddChildModal
        isOpen={isAddChildModalOpen}
        onClose={() => setIsAddChildModalOpen(false)}
        onSave={handleSaveChild}
      />
    </div>
  );
}
