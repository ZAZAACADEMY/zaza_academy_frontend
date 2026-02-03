"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { VideoCard } from "@/components/dashboard/videos/VideoCard";
import { MOCK_VIDEOS } from "@/lib/data/videos";

const AGE_FILTERS = ["All Ages", "Ages 5-7", "Ages 8-11", "Ages 12-16"];
const TOPIC_FILTERS = [
  "All Topics",
  "Basics",
  "Saving",
  "Spending",
  "Banking",
  "Investing",
  "Business",
];

export default function VideoLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAge, setSelectedAge] = useState("All Ages");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  const filteredVideos = MOCK_VIDEOS.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesAge =
      selectedAge === "All Ages" || video.ageGroup === selectedAge;
    const matchesTopic =
      selectedTopic === "All Topics" || video.category === selectedTopic;

    return matchesSearch && matchesAge && matchesTopic;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">
          Video Library
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Explore our comprehensive collection of financial education videos
          designed for children aged 5-16
        </p>
      </div>

      {/* Controls Container */}
      <div className="bg-white p-6 rounded-3xl shadow-sm mb-8 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all bg-gray-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          {/* Age Filter */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-gray-400 font-medium whitespace-nowrap flex items-center gap-2">
              <Search className="w-4 h-4" /> Filter by :
            </span>
            <div className="flex gap-2">
              {AGE_FILTERS.map((age) => (
                <button
                  key={age}
                  onClick={() => setSelectedAge(age)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                    selectedAge === age
                      ? "bg-brand-dark text-white border-brand-dark"
                      : "bg-white text-brand-accent border-brand-accent hover:bg-brand-accent/5"
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TOPIC_FILTERS.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                  selectedTopic === topic
                    ? "bg-brand-dark text-white border-brand-dark"
                    : "bg-white text-brand-accent border-brand-accent hover:bg-brand-accent/5"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="h-full">
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-dashed border-2 border-gray-200">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No videos found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}
    </div>
  );
}
