import React from "react";
import { MOCK_PROGRAMS } from "@/lib/data/programs";
import { ProgramCard } from "@/components/dashboard/programs/ProgramCard";

export default function ProgramsPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 mb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-dark mb-2">
          Learning Programs
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Structured courses designed to take your child from financial curious
          to financial genius.
        </p>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROGRAMS.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
}
