import { Video } from "@/components/dashboard/videos/VideoCard";

export interface VideoDetail extends Video {
  id: string;
  longDescription: string;
  learningPoints: string[];
  progress: number;
  completedLessons: number;
  totalLessons: number;
  upNext: { title: string; duration: string }[];
}

export const MOCK_VIDEOS = [
  {
    id: "1",
    title: "What Is Money?",
    description:
      "A simple and fun introduction to how money works in everyday life.",
    thumbnail: "/images/GetStarted1.png",
    duration: "15:00",
    rating: 4.9,
    category: "Basics",
    ageGroup: "Ages 5-7",
    longDescription:
      "In this exciting lesson, we explore the origins of money, from bartering cows for wheat to the coins and digital currency we use today. Kids will learn why money has value and how it acts as a medium of exchange.",
    learningPoints: [
      "Understand the history of money",
      "Identify different forms of currency",
      "Learn why we use money instead of bartering",
      "Recognize coins and bills",
    ],
    progress: 0,
    completedLessons: 0,
    totalLessons: 5,
    upNext: [
      { title: "Needs vs Wants", duration: "11 min" },
      { title: "Earning Your Allowance", duration: "12 min" },
    ],
  },
  {
    id: "2",
    title: "Needs vs Wants",
    description:
      "Learn how to tell the difference between needs and wants through real-life examples.",
    thumbnail: "/images/NeedsWants.png",
    duration: "11:00",
    rating: 4.9,
    category: "Spending",
    ageGroup: "Ages 5-7",
    longDescription:
      "Is a new video game a need or a want? What about food and water? This lesson helps children distinguish between essential items for survival and things that are nice to have, forming the foundation of budgeting.",
    learningPoints: [
      "Define needs and wants",
      "Categorize everyday items",
      "Understand priorities in spending",
      "Practice making choices",
    ],
    progress: 10,
    completedLessons: 1,
    totalLessons: 5,
    upNext: [
      { title: "Smart Shopping Tips", duration: "11 min" },
      { title: "The Piggy Bank Challenge", duration: "16 min" },
    ],
  },
  {
    id: "3",
    title: "The Piggy Bank Challenge",
    description:
      "Build smart saving habits with fun challenges and easy goals.",
    thumbnail: "/images/Saving.png",
    duration: "16:00",
    rating: 4.9,
    category: "Saving",
    ageGroup: "Ages 5-7",
    longDescription:
      "Meet Penny the Pig! She shows us how setting small goals can lead to big rewards. We'll learn how to start a piggy bank and watch our savings grow coin by coin.",
    learningPoints: [
      "Start a saving habit",
      "Set simple savings goals",
      "Track progress visually",
      "Feel the reward of patience",
    ],
    progress: 0,
    completedLessons: 0,
    totalLessons: 4,
    upNext: [
      { title: "Introduction to Banking", duration: "8 min" },
      { title: "Budgeting Basics", duration: "14 min" },
    ],
  },
  {
    id: "4",
    title: "Introduction to Banking",
    description:
      "Understand how banks work and why they play an important role in managing money.",
    thumbnail: "/images/GetStarted2.png",
    duration: "08:00",
    rating: 4.9,
    category: "Banking",
    ageGroup: "Ages 8-11", // Updated to match screenshot slightly better
    longDescription:
      "Learn the basics of saving money and why it's important to save for the future. This lesson introduces fundamental concepts like delayed gratification, setting savings goals, and understanding the difference between needs and wants.",
    learningPoints: [
      "Understand what saving means and why it's important",
      "Learn the difference between short-term and long-term savings",
      "Discover various ways to save money (piggy bank, savings account, etc.)",
      "Identify the difference between needs and wants",
      "Set your first savings goal",
    ],
    progress: 75,
    completedLessons: 4,
    totalLessons: 6,
    upNext: [
      { title: "How Banks Work", duration: "15 min" },
      { title: "The Piggy Bank Challenge", duration: "16 min" },
      { title: "Budgeting Basics", duration: "14 min" },
    ],
  },
  {
    id: "5",
    title: "Smart Shopping Tips",
    description:
      "Discover how to make smart buying decisions and spend money wisely.",
    thumbnail: "/images/GetStarted3.png",
    duration: "11:00",
    rating: 4.9,
    category: "Spending",
    ageGroup: "Ages 5-7",
    longDescription:
      "Shopping can be tricky! We learn about comparing prices, looking for sales, and asking 'do I really need this?' before buying. Be a smart shopper like Zaza!",
    learningPoints: [
      "Compare prices",
      "Wait before buying",
      "Look for quality",
      "Avoid impulse buys",
    ],
    progress: 0,
    completedLessons: 0,
    totalLessons: 3,
    upNext: [
      { title: "Needs vs Wants", duration: "11 min" },
      { title: "Budgeting Basics", duration: "14 min" },
    ],
  },
  {
    id: "6",
    title: "Introduction to Investing",
    description:
      "Learn the basics of investing and how money can grow over time.",
    thumbnail: "/images/GetStarted4.png",
    duration: "16:00",
    rating: 4.9,
    category: "Investing",
    ageGroup: "Ages 5-7",
    longDescription:
      "Money can grow like a tree! We introduce the concept of investing in simple terms, explaining how planting a seed (money) today can provide fruit in the future.",
    learningPoints: [
      "What is investing?",
      "Risk vs Reward basics",
      "Compound interest magic",
      "Long term thinking",
    ],
    progress: 0,
    completedLessons: 0,
    totalLessons: 5,
    upNext: [
      { title: "Credit Card Basics for Teens", duration: "18 min" },
      { title: "Earning Your Allowance", duration: "12 min" },
    ],
  },
  {
    id: "7",
    title: "Budgeting Basics",
    description: "How to create and stick to your first budget.",
    thumbnail: "/images/GetStarted1.png",
    duration: "14:00",
    rating: 4.8,
    category: "Basics",
    ageGroup: "Ages 8-11",
    longDescription:
      "Budgeting is the roadmap to financial success! Learn how to categorize income and expenses, and why planning ahead makes money management easier and more fun.",
    learningPoints: [
      "What is a budget?",
      "Income vs Expenses",
      "Tracking spending",
      "Saving for goals",
    ],
    progress: 0,
    completedLessons: 0,
    totalLessons: 4,
    upNext: [
      { title: "Smart Shopping Tips", duration: "11 min" },
      { title: "The Piggy Bank Challenge", duration: "16 min" },
    ],
  },
  {
    id: "8",
    title: "Earning Your Allowance",
    description: "Making the most of your allowance and chore money.",
    thumbnail: "/images/GetStarted2.png",
    duration: "12:00",
    rating: 4.7,
    category: "Earning",
    ageGroup: "Ages 5-7",
    longDescription:
      "Money doesn't grow on trees! This video explores how we earn money through work and chores, and how to manage that hard-earned cash responsibly.",
    learningPoints: [
      "Value of work",
      "Chores and rewards",
      "Managing an allowance",
      "Saving vs Spending earnings",
    ],
    progress: 0,
    completedLessons: 0,
    totalLessons: 3,
    upNext: [
      { title: "The Piggy Bank Challenge", duration: "16 min" },
      { title: "Needs vs Wants", duration: "11 min" },
    ],
  },
  {
    id: "9",
    title: "Credit Card Basics for Teens",
    description: "Understanding credit before you get your first card.",
    thumbnail: "/images/GetStarted3.png",
    duration: "18:00",
    rating: 4.9,
    category: "Banking",
    ageGroup: "Ages 12-16",
    longDescription:
      "Credit cards are powerful tools but need to be used wisely. We explain interest rates, credit scores, and the importance of paying off balances in full.",
    learningPoints: [
      "How credit cards work",
      "Interest and fees",
      "Building credit",
      "Avoiding debt",
    ],
    progress: 0,
    completedLessons: 0,
    totalLessons: 5,
    upNext: [
      { title: "Introduction to Investing", duration: "16 min" },
      { title: "How Banks Work", duration: "15 min" },
    ],
  },
  {
    id: "10",
    title: "How Banks Work",
    description: "A tour of what happens behind the scenes at a bank.",
    thumbnail: "/images/GetStarted4.png",
    duration: "15:00",
    rating: 4.8,
    category: "Banking",
    ageGroup: "Ages 8-11",
    longDescription:
      "Ever wonder where your money goes after you deposit it? Take a virtual tour inside a bank to see how they keep money safe and help the economy grow.",
    learningPoints: [
      "Deposits and Withdrawals",
      "Safety of banks",
      "Lending and Interest",
      "Digital banking",
    ],
    progress: 0,
    completedLessons: 0,
    totalLessons: 4,
    upNext: [
      { title: "Introduction to Banking", duration: "8 min" },
      { title: "Introduction to Investing", duration: "16 min" },
    ],
  },
];
