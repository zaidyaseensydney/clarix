export type UserRole = "student" | "parent";

export type AustralianState =
  | "NSW"
  | "VIC"
  | "QLD"
  | "WA"
  | "SA"
  | "TAS"
  | "ACT"
  | "NT";

export type Subject = "Maths" | "English" | "Science" | "History";

export type QuestionType = "multiple_choice" | "short_answer" | "long_answer";

export interface StudentProfile {
  id: string;
  role: "student";
  full_name: string;
  year_level: number;
  state: AustralianState;
  subjects: Subject[];
  created_at: string;
}

export interface ParentProfile {
  id: string;
  role: "parent";
  full_name: string;
  created_at: string;
}

export type UserProfile = StudentProfile | ParentProfile;

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface QuizQuestion {
  type: QuestionType;
  question: string;
  options?: string[];
  correct?: string;
  hint: string;
  explanation: string;
}

export interface QuizState {
  question: QuizQuestion | null;
  answered: boolean;
  selectedOption?: string;
  userAnswer?: string;
  evaluation?: { correct: boolean; feedback: string };
  showHint: boolean;
  previousQuestions: string[];
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  description: string;
  unlockedDate?: string;
}
