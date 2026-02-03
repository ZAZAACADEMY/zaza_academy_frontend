import React from "react";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";

interface Child {
  name: string;
  avatar: string;
}

interface SessionProps {
  title: string;
  description: string;
  ageRange: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  spotsLeft: number;
  recommendedFor?: Child[];
}

export const SessionCard = ({ session }: { session: SessionProps }) => {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100">
      {/* Header Tags */}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
          Upcoming
        </span>
        <span className="border border-gray-200 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full">
          Age {session.ageRange}
        </span>
      </div>

      {/* Content */}
      <div className="mb-6 flex-1">
        <h3 className="text-xl font-display font-bold text-brand-dark mb-2">
          {session.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {session.description}
        </p>
      </div>

      {/* Recommended For Children */}
      {session.recommendedFor && session.recommendedFor.length > 0 && (
        <div className="mb-6 p-3 bg-brand-cream rounded-2xl flex items-center gap-3">
          <div className="flex -space-x-3">
            {session.recommendedFor.map((child, i) => (
              <div
                key={i}
                className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
              >
                <Image
                  src={child.avatar}
                  alt={child.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-bold text-brand-dark">For: </span>
            {session.recommendedFor.map((c) => c.name).join(", ")}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-purple-500" />
          <span>{session.date}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-purple-500" />
          <span>
            {session.time} • {session.duration}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <User className="w-4 h-4 text-purple-500" />
          <span>{session.instructor}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
        <span className="text-xs font-medium text-gray-400">
          {session.spotsLeft} spots left
        </span>
        <button className="bg-brand-dark text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-opacity-90 transition-colors">
          Join Session
        </button>
      </div>
    </div>
  );
};
