import React from "react";
import { Calendar, Video } from "lucide-react";
import { Link } from "@/navigation";

interface RecordingProps {
  title: string;
  description: string;
  date: string;
  videoId: string;
}

export const RecordingCard = ({ recording }: { recording: RecordingProps }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100">
      {/* Header Tags */}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full">
          Recording Available
        </span>
      </div>

      {/* Content */}
      <div className="mb-6 flex-1">
        <h3 className="text-lg font-display font-bold text-brand-dark mb-2">
          {recording.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
          {recording.description}
        </p>
      </div>

      {/* Metadata */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-purple-500" />
          <span>{recording.date}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Link
          href={`/dashboard/videos/${recording.videoId}`}
          className="w-full border border-brand-dark text-brand-dark text-sm font-bold px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Video className="w-4 h-4" /> Watch Recording
        </Link>
      </div>
    </div>
  );
};
