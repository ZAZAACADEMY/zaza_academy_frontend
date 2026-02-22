export interface Program {
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

export const MOCK_PROGRAMS: Program[] = [
  {
    id: "1",
    title: "Money Master Junior",
    description:
      "The complete guide to understanding coins, bills, and basic counting for young beginners.",
    ageGroup: "5-7 Years",
    thumbnail:
      "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=400&auto=format&fit=crop",
    progress: 45,
    totalModules: 8,
    completedModules: 3,
    tags: ["Basics", "Counting"],
  },
  {
    id: "2",
    title: "Savings & Goals",
    description:
      "Learn why saving matters and how to set fun goals to buy the things you want.",
    ageGroup: "8-11 Years",
    thumbnail:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=400&auto=format&fit=crop",
    progress: 10,
    totalModules: 12,
    completedModules: 1,
    tags: ["Saving", "Planning"],
  },
  {
    id: "3",
    title: "Little Entrepeneur",
    description:
      "Discover how businesses work, how to earn money, and start your own lemonade stand!",
    ageGroup: "8-11 Years",
    thumbnail:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&auto=format&fit=crop",
    progress: 0,
    totalModules: 10,
    completedModules: 0,
    tags: ["Business", "Earning"],
  },
  {
    id: "4",
    title: "Smart Spender",
    description:
      "Understand needs vs wants and how to make smart choices at the store.",
    ageGroup: "5-7 Years",
    thumbnail:
      "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?q=80&w=400&auto=format&fit=crop",
    progress: 100,
    totalModules: 5,
    completedModules: 5,
    tags: ["Spending", "Choices"],
  },
  {
    id: "5",
    title: "Future Investor",
    description:
      "A fun introduction to stocks, bonds, and how money can grow over time.",
    ageGroup: "12+ Years",
    thumbnail:
      "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=400&auto=format&fit=crop",
    progress: 5,
    totalModules: 15,
    completedModules: 1,
    tags: ["Investing", "Advanced"],
  },
];
