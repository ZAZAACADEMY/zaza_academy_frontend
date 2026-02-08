import React from "react";
import { Calendar, Play } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";
import { MOCK_VIDEOS } from "@/lib/data/videos";
import { useTranslations } from "next-intl";

interface RecordingProps {
  title: string;
  description: string;
  date: string;
  videoId: string;
}

export const RecordingCard = ({ recording }: { recording: RecordingProps }) => {
  const t = useTranslations("dashboard.live");
  const videoDetails = MOCK_VIDEOS.find((v) => v.id === recording.videoId);

  return (
    <Link
      href={`/dashboard/videos/${recording.videoId}`}
      className="group block h-full"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 h-full border border-gray-100 flex flex-col">
        {/* Thumbnail Section */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {videoDetails?.thumbnail ? (
            <Image
              src={videoDetails.thumbnail}
              alt={recording.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-primary/5">
              <span className="text-brand-tertiary font-bold text-xl opacity-20">
                ZAZA
              </span>
            </div>
          )}

          {/* Overlay & Play Button */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
              <Play className="fill-white text-white ml-1" size={20} />
            </div>
          </div>

          {/* Duration Badge */}
          {videoDetails?.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
              {videoDetails.duration}
            </div>
          )}

          {/* Recorded Tag */}
          <div className="absolute top-2 left-2 bg-brand-purple/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
            {t("recordingBadge")}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-display font-bold text-brand-dark mb-2 group-hover:text-brand-purple transition-colors line-clamp-1">
            {recording.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {recording.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{recording.date}</span>
            </div>
            {videoDetails && (
              <div className="flex items-center gap-1 font-medium text-brand-primary">
                {t("watchNow")}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
