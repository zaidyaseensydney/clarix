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

export interface Child {
  id: string;
  name: string;
  yearLevel: number;
  state: AustralianState;
  subjects: Subject[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  yearLevel: number;
  state: AustralianState;
  subjects: Subject[];
  role: "student";
}

export interface ParentProfile {
  id: string;
  name: string;
  email: string;
  children: Child[];
  role: "parent";
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

export type PersonaType =
  | "student-y10-nsw"
  | "parent-2-children"
  | "student-y5-vic";

export interface Persona {
  id: PersonaType;
  label: string;
  icon: string;
  route: string;
  role: UserRole;
}

export interface SubjectProgress {
  subject: Subject;
  percent: number;
  color: string;
  accentClass: string;
  bgClass: string;
  quickTopic: string;
}

export interface Session {
  id: string;
  subject: Subject;
  topic: string;
  date: string;
  duration: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  description: string;
  unlockedDate?: string;
}
