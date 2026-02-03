"use client";

import React from "react";
import { Link } from "@/navigation";
import {
  ArrowLeft,
  Play,
  Download,
  Share2,
  CheckCircle,
  Heart,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useParams, notFound } from "next/navigation";
import { MOCK_VIDEOS } from "@/lib/data/videos";

export default function VideoDetailPage() {
  const params = useParams();
  const id = params.id;

  const video = MOCK_VIDEOS.find((v) => v.id === id);

  if (!video) {
    notFound();
  }

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
          <div className="aspect-video bg-gray-900 rounded-3xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/80 to-brand-accent/80 mix-blend-multiply" />
            <button className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-brand-accent ml-1" />
            </button>
            <div className="absolute bottom-4 text-white text-center w-full font-medium">
              Click to play video
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
            <div className="flex items-center justify-between border-t border-b border-gray-100 py-4">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart size={20} />{" "}
                  <span className="text-sm font-bold">245</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageSquare size={20} />{" "}
                  <span className="text-sm font-bold">3 Comments</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-brand-dark transition-colors">
                  <Share2 size={20} />{" "}
                  <span className="text-sm font-bold">Share</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-brand-dark transition-colors">
                  <Download size={20} />{" "}
                  <span className="text-sm font-bold">Resources</span>
                </button>
              </div>
              <button className="bg-brand-dark text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-opacity-90 transition-colors flex items-center gap-2">
                <CheckCircle size={16} /> Mark Complete
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
            <button className="w-full py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
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
            <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              Browse All Videos <ArrowLeft className="rotate-180" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
