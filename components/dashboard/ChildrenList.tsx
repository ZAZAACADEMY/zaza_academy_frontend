import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const childrenData = [
  {
    id: 1,
    name: "Emma",
    age: 12,
    progress: 75,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop", // Placeholder
    barColor: "bg-purple-500",
    bgBarColor: "bg-purple-100",
  },
  {
    id: 2,
    name: "Noah",
    age: 8,
    progress: 55,
    avatar:
      "https://images.unsplash.com/photo-1595152452543-e5cca283f58c?q=80&w=200&auto=format&fit=crop", // Placeholder
    barColor: "bg-blue-500",
    bgBarColor: "bg-blue-100",
  },
];

export const ChildrenList = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#1F1235]">Your Children</h3>
        <button className="text-[#A655F7] text-sm font-bold hover:underline">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {childrenData.map((child) => (
          <div
            key={child.id}
            className="flex items-center p-4 bg-[#FAFAFA] rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            {/* Avatar */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white shadow-sm">
              <Image
                src={child.avatar}
                alt={child.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <h4 className="font-bold text-[#1F1235]">{child.name}</h4>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Age {child.age} • {child.progress}% Complete
              </p>

              {/* Progress Bar */}
              <div
                className={`h-2 w-full ${child.bgBarColor} rounded-full overflow-hidden`}
              >
                <div
                  className={`h-full ${child.barColor} rounded-full`}
                  style={{ width: `${child.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Arrow */}
            <div className="ml-4 text-gray-400 group-hover:text-[#A655F7] transition-colors">
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
