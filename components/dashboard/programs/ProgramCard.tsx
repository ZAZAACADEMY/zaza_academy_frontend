import React from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { PlayCircle, Award, BookOpen } from "lucide-react";

interface ProgramProps {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  thumbnail: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  tags: string[];
}

export const ProgramCard = ({ program }: { program: ProgramProps }) => {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100">
      {/* Thumbnail */}
      <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-5 bg-gray-100">
        <Image
          src={program.thumbnail}
          alt={program.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-dark">
          {program.ageGroup}
        </div>
        {program.progress === 100 && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Award className="w-3 h-3" /> Completed
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-2">
        <div className="flex gap-2 mb-3 flex-wrap">
          {program.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wider rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-display font-bold text-brand-dark mb-2">
          {program.title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2">
          {program.description}
        </p>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
            <span>{program.progress}% Complete</span>
            <span>
              {program.completedModules}/{program.totalModules} Modules
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                program.progress === 100 ? "bg-green-500" : "bg-brand-purple"
              }`}
              style={{ width: `${program.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-2 pb-2">
        <Link
          href={`/dashboard/programs/${program.id}`}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
            program.progress === 100
              ? "bg-[#F3F0FF] text-brand-purple hover:bg-[#EBE5FF]"
              : "bg-brand-dark text-white hover:bg-opacity-90"
          }`}
        >
          {program.progress === 0 ? (
            <>
              <PlayCircle className="w-5 h-5" /> Start Learning
            </>
          ) : program.progress === 100 ? (
            <>
              <BookOpen className="w-5 h-5" /> Review Course
            </>
          ) : (
            <>
              <PlayCircle className="w-5 h-5" /> Continue
            </>
          )}
        </Link>
      </div>
    </div>
  );
};
