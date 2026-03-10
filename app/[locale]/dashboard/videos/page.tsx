"use client";

import React, { useState, useMemo } from "react";
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
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useFavorites } from "@/components/dashboard/videos/FavoritesContext";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useGetVideosQuery } from "@/lib/store/services/contentApi";
import { useListChildrenQuery } from "@/lib/store/services/childrenApi";

const VideoCard = dynamic(
  () =>
    import("@/components/dashboard/videos/VideoCard").then((m) => m.VideoCard),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-100 rounded-3xl h-64" />
    ),
    ssr: false,
  },
);

const AGE_FILTERS_UI = [
  { value: "All Ages", labelKey: "allAges", apiValue: "" },
  { value: "Ages 5-7", labelKey: "ages5_7", apiValue: "5-8" },
  { value: "Ages 8-11", labelKey: "ages8_11", apiValue: "9-12" },
  { value: "Ages 12-16", labelKey: "ages12_16", apiValue: "13-16" },
];

const TOPIC_FILTERS = [
  { name: "All Topics", key: "allTopics", icon: LayoutGrid, apiValue: "" },
  { name: "My Favorites", key: "myFavorites", icon: Heart, apiValue: null }, // Client-side filter
  { name: "Basics", key: "basics", icon: BookOpen, apiValue: "Basics" },
  { name: "Saving", key: "saving", icon: PiggyBank, apiValue: "Saving" },
  { name: "Spending", key: "spending", icon: CreditCard, apiValue: "Spending" },
  { name: "Banking", key: "banking", icon: Building2, apiValue: "Banking" },
  {
    name: "Investing",
    key: "investing",
    icon: TrendingUp,
    apiValue: "Investing",
  },
  { name: "Business", key: "business", icon: Briefcase, apiValue: "Business" },
];

export default function VideoLibraryPage() {
  const t = useTranslations("dashboard.videos");
  const { isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAge, setSelectedAge] = useState("All Ages");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  // Derive which age filters to show from children's age groups
  const { data: children } = useListChildrenQuery();
  const childAgeGroups = useMemo(() => {
    const groups = new Set((children ?? []).map((c) => c.age_group));
    return groups;
  }, [children]);

  // Only show age filter row when children have more than 1 distinct age group
  const showAgeFilter = childAgeGroups.size > 1;

  // Build the visible age filter options based on children's actual groups
  const visibleAgeFilters = useMemo(() => {
    const childFilters = AGE_FILTERS_UI.filter(
      (f) => !f.apiValue || childAgeGroups.has(f.apiValue as any),
    );
    return childFilters;
  }, [childAgeGroups]);

  // Map UI age filter to API age_group value
  const apiAgeGroup =
    AGE_FILTERS_UI.find((f) => f.value === selectedAge)?.apiValue || "";
  // Map UI topic filter to API category value (if not "My Favorites")
  const apiCategory =
    selectedTopic !== "My Favorites"
      ? TOPIC_FILTERS.find((f) => f.name === selectedTopic)?.apiValue || ""
      : "";

  // Fetch videos from API with dynamic filters
  const {
    data: videosData,
    isLoading,
    isError,
    error: fetchError,
  } = useGetVideosQuery(
    {
      search: searchQuery || undefined,
      age_group: apiAgeGroup || undefined,
      category: apiCategory || undefined,
    } as any, // Cast to any because generated types are strict and might not include all optional query params
    {
      pollingInterval: 3 * 60 * 1000, // refresh every 3 minutes
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Client-side filtering for "My Favorites"
  const filteredVideos = useMemo(() => {
    let videos = videosData?.results || [];

    // Apply client-side search if API doesn't fully support it (or for refinement)
    // Currently, API does support search on title, description, tags, so this might be redundant
    // if API handles it comprehensively. But leaving it for robustness.
    if (!apiCategory && searchQuery) {
      // Only filter client-side if API didn't handle the search for specific categories
      videos = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (video.tags &&
            (video.tags as any[]).some((tag: string) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase()),
            )),
      );
    }

    if (selectedTopic === "My Favorites") {
      videos = videos.filter((video) => isFavorite(video.id));
    }

    return videos;
  }, [videosData, selectedTopic, isFavorite, searchQuery, apiCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-brand-purple" size={48} />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching videos:", fetchError);
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-700 p-8 rounded-2xl">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-bold mb-2">{t("errorLoadingVideos")}</h3>
        <p className="text-center text-sm">{t("errorTryAgain")}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-dark mb-2">
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
          {/* Age Filter — only shown when children span multiple age groups */}
          {showAgeFilter && (
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <span className="text-gray-400 font-medium whitespace-nowrap flex items-center gap-2 text-sm">
                <Search className="w-4 h-4" /> {t("filterBy")}
              </span>
              <div className="flex gap-2 overflow-x-auto pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                {visibleAgeFilters.map((age) => (
                  <button
                    key={age.value}
                    onClick={() => setSelectedAge(age.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex-shrink-0 ${
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
          )}

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
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 flex-shrink-0 ${
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
                    className={`w-3.5 h-3.5 ${isSelected ? "text-white" : isFavoritesFilter ? "text-red-500" : "text-gray-400"}`}
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
