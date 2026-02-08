"use client";

import React, { useState } from "react";
import {
  Search,
  BookOpen,
  PiggyBank,
  CreditCard,
  Building2,
  TrendingUp,
  Briefcase,
  LayoutGrid,
  Heart,
} from "lucide-react";
import { VideoCard } from "@/components/dashboard/videos/VideoCard";
import { MOCK_VIDEOS } from "@/lib/data/videos";
import { useFavorites } from "@/components/dashboard/videos/FavoritesContext";
import { useTranslations } from "next-intl";

const AGE_FILTERS = [
  { value: "All Ages", labelKey: "allAges" },
  { value: "Ages 5-7", labelKey: "ages5_7" },
  { value: "Ages 8-11", labelKey: "ages8_11" },
  { value: "Ages 12-16", labelKey: "ages12_16" },
];

const TOPIC_FILTERS = [
  { name: "All Topics", key: "allTopics", icon: LayoutGrid },
  { name: "My Favorites", key: "myFavorites", icon: Heart },
  { name: "Basics", key: "basics", icon: BookOpen },
  { name: "Saving", key: "saving", icon: PiggyBank },
  { name: "Spending", key: "spending", icon: CreditCard },
  { name: "Banking", key: "banking", icon: Building2 },
  { name: "Investing", key: "investing", icon: TrendingUp },
  { name: "Business", key: "business", icon: Briefcase },
];

export default function VideoLibraryPage() {
  const t = useTranslations("dashboard.videos");
  const { isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAge, setSelectedAge] = useState("All Ages");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  const filteredVideos = MOCK_VIDEOS.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesAge =
      selectedAge === "All Ages" || video.ageGroup === selectedAge;

    // Updated Logic for Favorites
    let matchesTopic = true;
    if (selectedTopic === "My Favorites") {
      matchesTopic = isFavorite(video.id);
    } else {
      matchesTopic =
        selectedTopic === "All Topics" || video.category === selectedTopic;
    }

    return matchesSearch && matchesAge && matchesTopic;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-500 max-w-2xl">{t("description")}</p>
      </div>

      {/* Controls Container */}
      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm mb-8 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all bg-gray-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-6">
          {/* Age Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <span className="text-gray-400 font-medium whitespace-nowrap flex items-center gap-2 text-sm">
              <Search className="w-4 h-4" /> {t("filterBy")}
            </span>
            <div className="flex gap-2 overflow-x-auto pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {AGE_FILTERS.map((age) => (
                <button
                  key={age.value}
                  onClick={() => setSelectedAge(age.value)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border flex-shrink-0 ${
                    selectedAge === age.value
                      ? "bg-brand-dark text-white border-brand-dark"
                      : "bg-white text-brand-accent border-brand-accent hover:bg-brand-accent/5"
                  }`}
                >
                  {t(`filters.${age.labelKey}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Filter */}
          <div className="flex gap-2 overflow-x-auto pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {TOPIC_FILTERS.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopic === topic.name;
              const isFavoritesFilter = topic.name === "My Favorites";

              return (
                <button
                  key={topic.name}
                  onClick={() => setSelectedTopic(topic.name)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border flex items-center gap-2 flex-shrink-0 ${
                    isSelected
                      ? isFavoritesFilter
                        ? "bg-red-500 text-white border-red-500 shadow-md transform scale-105"
                        : "bg-brand-dark text-white border-brand-dark shadow-md transform scale-105"
                      : isFavoritesFilter
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-accent hover:text-brand-accent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isSelected ? "text-white" : isFavoritesFilter ? "text-red-500" : "text-gray-400"}`}
                  />
                  {t(`filters.${topic.key}`)}
                </button>
              );
            })}
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
