import React from "react";
import Image, { StaticImageData } from "next/image";
import { Link } from "@/navigation";
import { Clock, Star, PlayCircle } from "lucide-react";

export interface VideoProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string | StaticImageData;
  duration: string;
  rating: number;
  category: string;
  ageGroup: string;
}

export const VideoCard = ({ video }: { video: VideoProps }) => {
  return (
    <Link href={`/dashboard/videos/${video.id}`} className="block h-full">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full border border-gray-100">
        {/* Thumbnail Container */}
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
          />
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <PlayCircle className="w-8 h-8 text-brand-accent fill-brand-accent/20" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Tags */}
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
              {video.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
              {video.ageGroup}
            </span>
          </div>

          {/* Title & Desc */}
          <h3 className="font-display font-bold text-lg text-brand-dark mb-2">
            {video.title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
            {video.description}
          </p>

          {/* Footer Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{video.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{video.rating} rating</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
