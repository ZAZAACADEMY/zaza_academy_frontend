"use client";

import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation"; // Not using next-intl's link for notFound usually, or standard? Standard is fine.
import { PlayCircle, CheckCircle, Clock } from "lucide-react";
import { MOCK_PROGRAMS } from "@/lib/data/programs";
import { Link } from "@/navigation";

// Mock modules data for the detail view
const MOCK_MODULES = [
  { id: 1, title: "Introduction", duration: "5 min", isCompleted: true },
  { id: 2, title: "First Concepts", duration: "12 min", isCompleted: false },
  {
    id: 3,
    title: "Practical Examples",
    duration: "15 min",
    isCompleted: false,
  },
  { id: 4, title: "Activity Time", duration: "20 min", isCompleted: false },
  { id: 5, title: "Final Quiz", duration: "10 min", isCompleted: false },
];

export default function ProgramDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const program = MOCK_PROGRAMS.find((p) => p.id === params.id);

  if (!program) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto mb-20">
      <Link
        href="/dashboard/programs"
        className="text-sm font-bold text-gray-500 hover:text-brand-purple mb-6 inline-block"
      >
        ← Back to Programs
      </Link>

      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src={program.thumbnail}
            alt={program.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent flex flex-col justify-end p-8">
            <div className="flex gap-2 mb-3">
              {program.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              {program.title}
            </h1>
            <p className="text-white/90 max-w-2xl text-lg">
              {program.description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Modules List */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-6">
                Course Modules
              </h2>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 divide-y divide-gray-100">
                {MOCK_MODULES.map((module) => (
                  <div
                    key={module.id}
                    className="p-4 flex items-center justify-between hover:bg-white transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${module.isCompleted ? "bg-green-100 text-green-600" : "bg-brand-purple/10 text-brand-purple"}`}
                      >
                        {module.isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <PlayCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-bold ${module.isCompleted ? "text-gray-500" : "text-brand-dark"}`}
                        >
                          {module.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" /> {module.duration}
                        </div>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-bold ${module.isCompleted ? "text-green-600" : "bg-brand-purple text-white opacity-0 group-hover:opacity-100 transition-opacity"}`}
                    >
                      {module.isCompleted ? "Completed" : "Start"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-[#F8F7FF] rounded-2xl p-6">
              <h3 className="font-bold text-brand-dark mb-4">
                Course Progress
              </h3>
              <div className="mb-2 flex justify-between text-sm font-bold text-brand-purple">
                <span>{program.progress}%</span>
                <span>
                  {program.completedModules}/{program.totalModules}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-3 mb-6">
                <div
                  className="h-3 bg-brand-purple rounded-full"
                  style={{ width: `${program.progress}%` }}
                />
              </div>
              <button className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-opacity-90 transition-opacity">
                Resume Learning
              </button>
            </div>

            <div className="border border-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-brand-dark mb-4">Course Info</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">Age Group</span>
                  <span className="font-bold text-brand-dark">
                    {program.ageGroup}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Modules</span>
                  <span className="font-bold text-brand-dark">
                    {program.totalModules} Lessons
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Certificate</span>
                  <span className="font-bold text-green-600">Yes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
