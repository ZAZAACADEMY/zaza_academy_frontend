export const KIDS = {
  emma: {
    name: "Emma",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
  },
  noah: {
    name: "Noah",
    avatar:
      "https://images.unsplash.com/photo-1595152452543-e5cca283f58c?q=80&w=200&auto=format&fit=crop",
  },
};

export const UPCOMING_SESSIONS = [
  {
    title: "Saving Strategies for Kids",
    description:
      "Learn practical saving techniques that work for any age. We'll cover piggy banks, savings goals, and how to resist impulse buying.",
    ageRange: "7-12",
    date: "Tomorrow, January 18, 2026",
    time: "4:00 PM EST",
    duration: "45 minutes",
    instructor: "Dr. Sarah Martinez",
    spotsLeft: 8,
    recommendedFor: [KIDS.emma, KIDS.noah],
    category: "Saving",
  },
  {
    title: "Understanding Money Value",
    description:
      "Interactive session about coins, bills, and understanding what different amounts can buy. Great for beginners!",
    ageRange: "5-8",
    date: "Friday, January 19, 2026",
    time: "3:30 PM EST",
    duration: "40 minutes",
    instructor: "Michael Chen",
    spotsLeft: 12,
    recommendedFor: [KIDS.noah],
    category: "Basics",
  },
  {
    title: "Teen Investing Basics",
    description:
      "Introduction to stocks, bonds, and compound interest. Learn how teens can start building wealth early.",
    ageRange: "13-16",
    date: "Saturday, January 20, 2026",
    time: "11:00 AM EST",
    duration: "60 minutes",
    instructor: "Emma Rodriguez, CFA",
    spotsLeft: 3, // Low spots for demo
    category: "Investing",
  },
  {
    title: "Starting Your First Business",
    description:
      "For young entrepreneurs! Learn how to turn your ideas into a real business, from planning to first sales.",
    ageRange: "9-14",
    date: "Sunday, January 21, 2026",
    time: "2:00 PM EST",
    duration: "50 minutes",
    instructor: "David Park",
    spotsLeft: 15,
    recommendedFor: [KIDS.emma],
    category: "Business",
  },
];

export const PAST_SESSIONS = [
  {
    title: "What is Money?",
    description:
      "Introduction to the concept of money and its role in society.",
    date: "January 15, 2026",
    videoId: "1",
  },
  {
    title: "Budgeting Basics",
    description: "How to create and stick to your first budget.",
    date: "January 12, 2026",
    videoId: "7",
  },
  {
    title: "Needs vs. Wants",
    description: "Understanding the difference and making smart choices.",
    date: "January 10, 2026",
    videoId: "3",
  },
  {
    title: "How Banks Work",
    description: "A tour of what happens behind the scenes at a bank.",
    date: "January 20, 2026",
    videoId: "10",
  },
  {
    title: "Earning Your Allowance",
    description: "Making the most of your allowance and chore money.",
    date: "January 18, 2026",
    videoId: "8",
  },
  {
    title: "Credit Card Basics for Teens",
    description: "Understanding credit before you get your first card.",
    date: "January 16, 2026",
    videoId: "9",
  },
];
