import React from "react";
import { Award, Video, CheckCircle } from "lucide-react";

type MilestoneType = "goal" | "module" | "badge";

interface Milestone {
  id: string;
  type: MilestoneType;
  title: string;
  childName: string;
  description: string;
  date: string;
}

const MILESTONES: Milestone[] = [
  {
    id: "1",
    type: "goal",
    title: "First Savings Goal Achieved!",
    childName: "Emma",
    description: "Completed her first savings goal of $50",
    date: "2 days ago",
  },
  {
    id: "2",
    type: "module",
    title: "Module Complete",
    childName: "Noah",
    description: "Finished the Budget Basics module with 95% score",
    date: "2 days ago",
  },
  {
    id: "3",
    type: "badge",
    title: "Budget Master Badge",
    childName: "Introduction to Saving Money", // Screenshot has this as 'childName' spot but contextually it might be the course name? The screenshot says "Introduction to Saving Money - Earned the..." which implies context.
    // Actually looking at screenshot:
    // 1. "Emma - Completed..."
    // 2. "Noah - Finished..."
    // 3. "Introduction to Saving Money - Earned..." -> This one is weird. It might be the course name instead of child name. Or maybe it just lists the context.
    // I will use a generic subtitle field.
    description: "Earned the Budget Master achievement",
    date: "2 days ago",
  },
];

const getIcon = (type: MilestoneType) => {
  switch (type) {
    case "goal":
      return { icon: Award, bg: "bg-yellow-100", text: "text-yellow-600" };
    case "module":
      return { icon: Video, bg: "bg-blue-100", text: "text-blue-600" };
    case "badge":
      return { icon: CheckCircle, bg: "bg-pink-100", text: "text-pink-600" };
    default:
      return { icon: Award, bg: "bg-gray-100", text: "text-gray-600" };
  }
};

export const RecentMilestones = () => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-brand-dark mb-6">
        Recent Milestones
      </h2>
      <div className="flex flex-col gap-4">
        {MILESTONES.map((milestone) => {
          const { icon: Icon, bg, text } = getIcon(milestone.type);
          return (
            <div
              key={milestone.id}
              className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mr-4 shrink-0`}
              >
                <Icon className={`w-6 h-6 ${text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-brand-dark truncate">
                  {milestone.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  <span className="font-medium text-gray-700">
                    {milestone.childName}
                  </span>{" "}
                  - {milestone.description}
                </p>
              </div>
              <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-4">
                {milestone.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
