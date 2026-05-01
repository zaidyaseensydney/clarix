import type {
  StudentProfile,
  ParentProfile,
  SubjectProgress,
  Session,
  Achievement,
  Child,
} from "./types";

export const MOCK_STUDENT: StudentProfile = {
  id: "student-1",
  name: "Mia",
  email: "mia@example.com",
  yearLevel: 10,
  state: "NSW",
  subjects: ["Maths", "English", "Science", "History"],
  role: "student",
};

export const MOCK_STUDENT_Y5: StudentProfile = {
  id: "student-2",
  name: "Liam",
  email: "liam@example.com",
  yearLevel: 5,
  state: "VIC",
  subjects: ["Maths", "English", "Science"],
  role: "student",
};

export const MOCK_CHILDREN: Child[] = [
  {
    id: "child-1",
    name: "Mia",
    yearLevel: 10,
    state: "NSW",
    subjects: ["Maths", "English", "Science", "History"],
  },
  {
    id: "child-2",
    name: "Jake",
    yearLevel: 7,
    state: "NSW",
    subjects: ["Maths", "English", "Science"],
  },
];

export const MOCK_PARENT: ParentProfile = {
  id: "parent-1",
  name: "Sarah",
  email: "sarah@example.com",
  children: MOCK_CHILDREN,
  role: "parent",
};

export const SUBJECT_PROGRESS: SubjectProgress[] = [
  {
    subject: "Maths",
    percent: 78,
    color: "#0D9488",
    accentClass: "bg-teal-600",
    bgClass: "bg-teal-50",
    quickTopic: "Linear equations",
  },
  {
    subject: "English",
    percent: 64,
    color: "#7C3AED",
    accentClass: "bg-purple-600",
    bgClass: "bg-purple-50",
    quickTopic: "Persuasive writing",
  },
  {
    subject: "Science",
    percent: 71,
    color: "#059669",
    accentClass: "bg-emerald-600",
    bgClass: "bg-emerald-50",
    quickTopic: "Ecosystems",
  },
  {
    subject: "History",
    percent: 59,
    color: "#D97706",
    accentClass: "bg-amber-600",
    bgClass: "bg-amber-50",
    quickTopic: "Federation",
  },
];

export const RECENT_SESSIONS: Session[] = [
  {
    id: "s1",
    subject: "Maths",
    topic: "Linear equations",
    date: "Today, 5:30 PM",
    duration: "22 min",
  },
  {
    id: "s2",
    subject: "English",
    topic: "Persuasive writing",
    date: "Yesterday, 4:15 PM",
    duration: "35 min",
  },
  {
    id: "s3",
    subject: "Science",
    topic: "Ecosystems",
    date: "Monday, 6:00 PM",
    duration: "28 min",
  },
];

export const WEAK_AREAS = [
  { subject: "Maths", topic: "Fractions", score: 42 },
  { subject: "English", topic: "Grammar", score: 48 },
  { subject: "History", topic: "Colonial Australia", score: 51 },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-session",
    title: "First Session",
    icon: "🎓",
    unlocked: true,
    description: "Completed your very first tutoring session.",
    unlockedDate: "28 Apr 2026",
  },
  {
    id: "seven-day-streak",
    title: "7 Day Streak",
    icon: "🔥",
    unlocked: false,
    description: "Study 7 days in a row to unlock.",
  },
  {
    id: "ten-quizzes",
    title: "10 Quizzes",
    icon: "📝",
    unlocked: false,
    description: "Complete 10 quizzes to unlock.",
  },
  {
    id: "perfect-score",
    title: "Perfect Score",
    icon: "⭐",
    unlocked: false,
    description: "Score 100% on a quiz to unlock.",
  },
];

export const WEEKLY_ACTIVITY = {
  "This Week": [40, 65, 0, 80, 55, 90, 70],
  "This Month": [30, 50, 45, 60, 40, 70, 55],
  "All Time": [55, 72, 60, 68, 58, 75, 65],
};

export const TOPIC_BREAKDOWN = [
  {
    subject: "Maths",
    topic: "Linear equations",
    progress: 82,
    attempted: 15,
    correct: 12,
    lastStudied: "Today",
  },
  {
    subject: "Maths",
    topic: "Fractions",
    progress: 42,
    attempted: 10,
    correct: 4,
    lastStudied: "3 days ago",
  },
  {
    subject: "English",
    topic: "Persuasive writing",
    progress: 71,
    attempted: 12,
    correct: 9,
    lastStudied: "Yesterday",
  },
  {
    subject: "English",
    topic: "Grammar",
    progress: 48,
    attempted: 8,
    correct: 4,
    lastStudied: "4 days ago",
  },
  {
    subject: "Science",
    topic: "Ecosystems",
    progress: 75,
    attempted: 11,
    correct: 8,
    lastStudied: "2 days ago",
  },
  {
    subject: "History",
    topic: "Federation",
    progress: 63,
    attempted: 9,
    correct: 6,
    lastStudied: "5 days ago",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah M.",
    location: "Sydney, NSW",
    quote:
      "Clarix has completely transformed how my daughter approaches her HSC prep. She's more confident and actually enjoys studying now.",
    avatar: "SM",
  },
  {
    name: "David T.",
    location: "Melbourne, VIC",
    quote:
      "As a parent, I love being able to see exactly where my son needs help. The parent dashboard is brilliant — it keeps me involved without hovering.",
    avatar: "DT",
  },
  {
    name: "Priya K.",
    location: "Brisbane, QLD",
    quote:
      "My Year 5 student went from dreading maths to requesting extra sessions. The tutor explains things in a way that actually makes sense to kids.",
    avatar: "PK",
  },
];

export const PARENT_ACTIVITY_FEED = [
  {
    id: "a1",
    child: "Mia",
    text: "completed a Maths quiz — scored 8/10",
    icon: "✅",
    time: "2 hours ago",
    detail: "Mia answered 8 out of 10 questions correctly on Linear equations.",
  },
  {
    id: "a2",
    child: "Mia",
    text: "studied Linear equations for 22 mins",
    icon: "📚",
    time: "2 hours ago",
    detail: "Session covered solving multi-step linear equations.",
  },
  {
    id: "a3",
    child: "Mia",
    text: "unlocked First Session badge",
    icon: "🏆",
    time: "Yesterday",
    detail: "Mia earned the First Session badge for completing her first tutoring session.",
  },
  {
    id: "a4",
    child: "Jake",
    text: "started English for the first time",
    icon: "📖",
    time: "3 days ago",
    detail: "Jake's first English session — covered Persuasive writing basics.",
  },
];

export const AI_INSIGHTS = [
  {
    id: "i1",
    child: "Mia",
    text: "Mia studies best between 5–7pm",
    icon: "📊",
    showEncouragement: false,
  },
  {
    id: "i2",
    child: "Mia",
    text: "Mia improved 23% in Maths this month",
    icon: "📈",
    showEncouragement: false,
  },
  {
    id: "i3",
    child: "Jake",
    text: "Jake hasn't studied in 3 days",
    icon: "💬",
    showEncouragement: true,
  },
];

export const PARENT_CHILD_STATS = {
  "child-1": {
    timeSpent: "4h 23m",
    timeChange: "+18%",
    sessions: 11,
    avgSession: "24 min",
    weakAreas: ["Fractions", "Grammar", "Colonial Australia"],
    subjects: [
      { subject: "Maths", grade: "B", trend: "↑", sessions: 4, progress: 78 },
      { subject: "English", grade: "C", trend: "→", sessions: 3, progress: 64 },
      { subject: "Science", grade: "B", trend: "↑", sessions: 2, progress: 71 },
      { subject: "History", grade: "C", trend: "↓", sessions: 2, progress: 59 },
    ],
  },
  "child-2": {
    timeSpent: "1h 45m",
    timeChange: "+5%",
    sessions: 4,
    avgSession: "26 min",
    weakAreas: ["Grammar", "Ecosystems"],
    subjects: [
      { subject: "Maths", grade: "C", trend: "→", sessions: 2, progress: 55 },
      { subject: "English", grade: "D", trend: "↓", sessions: 1, progress: 38 },
      { subject: "Science", grade: "C", trend: "↑", sessions: 1, progress: 62 },
    ],
  },
};
