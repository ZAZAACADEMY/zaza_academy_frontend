import React from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { Clock, Play, Heart } from "lucide-react";
import { useFavorites } from "@/components/dashboard/videos/FavoritesContext";
import { components } from "@/lib/api/v1";

type Video = components["schemas"]["VideoDetail"];

const getCategoryColor = (category: string | null | undefined) => {
  switch (category?.toLowerCase()) {
    case "saving":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "investing":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "basics":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "business":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "spending":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const VideoCard = ({ video }: { video: Video }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(video.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(video.id);
  };

  // Parse duration (e.g., "01:30:00" -> "1h 30m")
  const parseDuration = (durationStr: string | null | undefined) => {
    if (!durationStr) return "N/A";
    const [hours, minutes] = durationStr.split(":").map(Number);
    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim() || "N/A";
  };
  const durationDisplay = parseDuration(video.duration);


  return (
    <Link
      href={`/dashboard/videos/${video.id}`}
      className="block h-full group relative"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full border border-gray-100 transform group-hover:-translate-y-1">
        {/* Thumbnail Container */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          {video.thumbnail_url && (
            <Image
              src={video.thumbnail_url}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

          {/* Favorite Button - More prominent when favorite */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md border transition-all group/btn ${
              favorite
                ? "bg-red-500/90 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-110"
                : "bg-white/20 border-white/30 hover:bg-white/40"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${favorite ? "fill-white text-white drop-shadow-sm" : "text-white group-hover/btn:scale-110"}`}
            />
          </button>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Duration Badge (Moved to image) */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {durationDisplay}
            </div>
          )}

          {/* Progress Bar (Removed as no API field) */}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 relative">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {video.category && (
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${getCategoryColor(video.category)}`}
              >
                {video.category}
              </span>
            )}
            {video.age_group && (
              <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full border border-gray-100">
                {video.age_group}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-brand-dark mb-2 leading-tight group-hover:text-brand-primary transition-colors">
            {video.title}
          </h3>

          <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
            {video.description}
          </p>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
            {/* Rating and progress removed */}
            <div className="ml-auto"></div>
          </div>
        </div>
      </div>
    </Link>
  );
};
