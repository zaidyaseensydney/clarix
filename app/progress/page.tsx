"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flame, Clock, BookOpen, Trophy, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import type { Achievement } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PeriodFilter = "This Week" | "This Month" | "All Time";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EMPTY_ACTIVITY = [0, 0, 0, 0, 0, 0, 0];

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

export default function ProgressPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<PeriodFilter>("This Week");
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();
      if (data) setUserName(data.full_name?.split(" ")[0] ?? "");
    });
  }, []);

  function goToTutor(subject: string, topic?: string) {
    const params = new URLSearchParams({ subject });
    if (topic) params.set("topic", topic);
    router.push(`/tutor?${params.toString()}`);
  }

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Progress</h1>
            <p className="text-slate-500 mt-1">
              {userName ? `Track ${userName}'s learning journey.` : "Track your learning journey."}
            </p>
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {(["This Week", "This Month", "All Time"] as PeriodFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  period === p ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row — empty state */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Study time", value: "—", icon: Clock, color: "text-teal-600" },
            { label: "Day streak", value: "0", icon: Flame, color: "text-orange-500" },
            { label: "Sessions", value: "0", icon: BookOpen, color: "text-purple-600" },
            { label: "Quizzes done", value: "0", icon: Trophy, color: "text-amber-500" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-4 flex flex-col items-center gap-1 text-center">
                <stat.icon className={cn("h-5 w-5 mb-1", stat.color)} />
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly activity chart — empty */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {EMPTY_ACTIVITY.map((_, i) => (
                <div key={DAYS[i]} className="flex flex-col items-center flex-1 gap-1">
                  <div className="w-full flex items-end" style={{ height: "128px" }}>
                    <div
                      className="w-full rounded-t-lg bg-slate-100"
                      style={{ height: "4px" }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{DAYS[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
              Start learning sessions to see your activity here.
            </p>
          </CardContent>
        </Card>

        {/* Topic breakdown — empty state */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Topic Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <BookOpen className="h-12 w-12 text-slate-200" />
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">No activity yet</p>
                <p className="text-sm text-slate-500 max-w-xs">
                  Your topic progress will appear here after you complete tutor sessions and quizzes.
                </p>
              </div>
              <div className="flex gap-3">
                <Button size="sm" onClick={() => goToTutor("Maths")}>
                  Start with Maths
                </Button>
                <Button size="sm" variant="outline" onClick={() => goToTutor("English")}>
                  Try English
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strengths & weak areas — empty state */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-emerald-700">💪 Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 text-center py-4">
                Complete quizzes to discover your strengths.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-red-600">📍 Needs Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 text-center py-4">
                Areas for improvement will show here after quizzes.
              </p>
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
                      <span className="text-xs font-medium text-slate-400 text-center">{badge.title}</span>
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
