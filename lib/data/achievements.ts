export interface Achievement {
  id: string;
  title: string;
  description: string;
  dateEarned?: string;
  icon: string; // icon name for lookup or url
  type: "badge" | "certificate" | "milestone";
  childName: string;
  isLocked: boolean;
}

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "1",
    title: "Budget Master",
    description: "Completed the Budgeting Basics module with a perfect score.",
    dateEarned: "2 days ago",
    icon: "award",
    type: "badge",
    childName: "Noah",
    isLocked: false,
  },
  {
    id: "2",
    title: "Super Saver",
    description: "Saved $50 in their piggy bank goal.",
    dateEarned: "1 week ago",
    icon: "piggy-bank",
    type: "milestone",
    childName: "Emma",
    isLocked: false,
  },
  {
    id: "3",
    title: "Quiz Whiz",
    description: "Answered 50 quiz questions correctly.",
    dateEarned: "2 weeks ago",
    icon: "brain",
    type: "badge",
    childName: "Emma",
    isLocked: false,
  },
  {
    id: "4",
    title: "Week Streak",
    description: "Logged in for 7 days in a row.",
    dateEarned: "Yesterday",
    icon: "fire",
    type: "badge",
    childName: "Noah",
    isLocked: false,
  },
  {
    id: "5",
    title: "Investor Initiate",
    description: "Complete the Future Investor program.",
    icon: "trending-up",
    type: "certificate",
    childName: "Emma",
    isLocked: true,
  },
  {
    id: "6",
    title: "Charity Champion",
    description: "Donate to a cause for the first time.",
    icon: "heart",
    type: "badge",
    childName: "Any",
    isLocked: true,
  },
];
