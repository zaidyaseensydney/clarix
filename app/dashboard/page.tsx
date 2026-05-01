"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Clock, BookOpen, Trophy, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import type { StudentProfile, Achievement } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "text-teal-700",
  English: "text-purple-700",
  Science: "text-emerald-700",
  History: "text-amber-700",
};

const SUBJECT_BG: Record<string, string> = {
  Maths: "bg-teal-50 border-teal-100",
  English: "bg-purple-50 border-purple-100",
  Science: "bg-emerald-50 border-emerald-100",
  History: "bg-amber-50 border-amber-100",
};

const SUBJECT_ICONS: Record<string, string> = {
  Maths: "📐",
  English: "📖",
  Science: "🔬",
  History: "🏛️",
};

const ALL_SUBJECTS = ["Maths", "English", "Science", "History"];

const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: "first-session",
    title: "First Session",
    icon: "🎓",
    unlocked: false,
    description: "Complete your very first tutoring session.",
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

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setLoading(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (data) setProfile(data as StudentProfile);
      setLoading(false);
    });
  }, []);

  function goToTutor(subject: string, topic?: string) {
    const params = new URLSearchParams({ subject });
    if (topic) params.set("topic", topic);
    router.push(`/tutor?${params.toString()}`);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  const displayName = profile?.full_name?.split(" ")[0] ?? "there";
  const displaySubjects = profile?.subjects?.length ? profile.subjects : ALL_SUBJECTS;

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-slate-500 mt-1">
              {profile
                ? `Year ${profile.year_level} · ${profile.state}`
                : "Ready to start learning?"}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <Flame className="h-5 w-5 text-slate-400" />
            <span className="text-sm text-slate-500">Start your streak today</span>
          </div>
        </div>

        {/* Welcome banner */}
        <Card className="bg-gradient-to-r from-teal-600 to-teal-700 border-none">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-teal-100 text-sm font-medium mb-1">Your Learning Journey</p>
                <h2 className="text-xl font-bold text-white">
                  Let&apos;s get started, {displayName}! 🚀
                </h2>
                <p className="text-teal-100 mt-1">
                  Pick a subject below and begin your first session with your AI tutor.
                </p>
              </div>
              <Button
                className="bg-white text-teal-700 hover:bg-white/90 shrink-0"
                onClick={() => goToTutor("Maths")}
              >
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subject cards */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Subjects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displaySubjects.map((subject) => (
              <Card
                key={subject}
                className={cn("border cursor-pointer hover:shadow-md transition-shadow", SUBJECT_BG[subject])}
                onClick={() => goToTutor(subject)}
              >
                <CardContent className="pt-5 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={cn("font-semibold", SUBJECT_COLORS[subject])}>
                      {subject}
                    </h3>
                    <span className="text-xl">{SUBJECT_ICONS[subject]}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">No sessions yet</p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToTutor(subject);
                    }}
                  >
                    Start
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom row: Recent sessions + Explore */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent sessions — empty state */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-teal-600" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <BookOpen className="h-10 w-10 text-slate-200" />
                <p className="text-sm text-slate-500">
                  Your sessions will appear here once you start learning.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/tutor">Start your first session</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Areas to strengthen — empty state */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-orange-500" />
                Areas to Strengthen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <Trophy className="h-10 w-10 text-slate-200" />
                <p className="text-sm text-slate-500">
                  Complete quizzes to identify areas for improvement.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/progress">View Progress</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {ACHIEVEMENT_DEFINITIONS.map((badge) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100 opacity-60 min-w-[80px] cursor-default">
                      <div className="relative">
                        <span className="text-3xl grayscale opacity-40">{badge.icon}</span>
                        <Lock className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <span className="text-xs font-medium text-slate-400 text-center">
                        {badge.title}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedBadge} onOpenChange={(o) => !o && setSelectedBadge(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-center">Achievement Unlocked!</DialogTitle>
            <DialogDescription className="text-center">
              You&apos;ve earned this badge.
            </DialogDescription>
          </DialogHeader>
          {selectedBadge && (
            <div className="flex flex-col items-center gap-4 py-4">
              <span className="text-6xl">{selectedBadge.icon}</span>
              <h3 className="text-xl font-bold text-slate-900">{selectedBadge.title}</h3>
              <p className="text-slate-500 text-sm">{selectedBadge.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
