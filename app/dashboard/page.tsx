"use client";

import { useState } from "react";
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
import {
  MOCK_STUDENT,
  SUBJECT_PROGRESS,
  RECENT_SESSIONS,
  WEAK_AREAS,
  ACHIEVEMENTS,
} from "@/lib/mock-data";
import type { Achievement } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "text-teal-700",
  English: "text-purple-700",
  Science: "text-emerald-700",
  History: "text-amber-700",
};

const SUBJECT_BAR_COLORS: Record<string, string> = {
  Maths: "bg-teal-600",
  English: "bg-purple-600",
  Science: "bg-emerald-600",
  History: "bg-amber-600",
};

const SUBJECT_BG: Record<string, string> = {
  Maths: "bg-teal-50 border-teal-100",
  English: "bg-purple-50 border-purple-100",
  Science: "bg-emerald-50 border-emerald-100",
  History: "bg-amber-50 border-amber-100",
};

export default function DashboardPage() {
  const router = useRouter();
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  function goToTutor(subject: string, topic?: string) {
    const params = new URLSearchParams({ subject });
    if (topic) params.set("topic", topic);
    router.push(`/tutor?${params.toString()}`);
  }

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, {MOCK_STUDENT.name}! 👋
            </h1>
            <p className="text-slate-500 mt-1">Here&apos;s how you&apos;re tracking this week.</p>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-orange-700">7</span>
            <span className="text-sm text-orange-600">day streak</span>
          </div>
        </div>

        {/* Weekly summary */}
        <Card className="bg-gradient-to-r from-teal-600 to-teal-700 border-none">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-teal-100 text-sm font-medium mb-1">Weekly Summary</p>
                <h2 className="text-xl font-bold text-white">
                  Great week, {MOCK_STUDENT.name}! 🎉
                </h2>
                <p className="text-teal-100 mt-1">
                  You studied <span className="text-white font-semibold">4h 23m</span> across{" "}
                  <span className="text-white font-semibold">3 subjects</span> this week.
                </p>
              </div>
              <div className="flex items-center gap-3 text-center">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-2xl font-bold text-white">11</p>
                  <p className="text-xs text-teal-100">Sessions</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-2xl font-bold text-white">8</p>
                  <p className="text-xs text-teal-100">Quizzes</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-2xl font-bold text-white">74%</p>
                  <p className="text-xs text-teal-100">Avg score</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject cards */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Subjects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUBJECT_PROGRESS.map((sp) => (
              <Card
                key={sp.subject}
                className={cn("border cursor-pointer hover:shadow-md transition-shadow", SUBJECT_BG[sp.subject])}
                onClick={() => goToTutor(sp.subject, sp.quickTopic)}
              >
                <CardContent className="pt-5 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={cn("font-semibold", SUBJECT_COLORS[sp.subject])}>
                      {sp.subject}
                    </h3>
                    <span className={cn("text-sm font-bold", SUBJECT_COLORS[sp.subject])}>
                      {sp.percent}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 bg-white/70 rounded-full mb-3 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full progress-fill", SUBJECT_BAR_COLORS[sp.subject])}
                      style={{ width: `${sp.percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Up next: <span className="font-medium text-slate-700">{sp.quickTopic}</span>
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToTutor(sp.subject, sp.quickTopic);
                    }}
                  >
                    Start
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom row: Recent sessions + Weak areas */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent sessions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-teal-600" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECENT_SESSIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goToTutor(s.subject, s.topic)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      className={cn(
                        "text-xs",
                        s.subject === "Maths"
                          ? "bg-teal-100 text-teal-700 border-0"
                          : s.subject === "English"
                          ? "bg-purple-100 text-purple-700 border-0"
                          : s.subject === "Science"
                          ? "bg-emerald-100 text-emerald-700 border-0"
                          : "bg-amber-100 text-amber-700 border-0"
                      )}
                    >
                      {s.subject}
                    </Badge>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-800">{s.topic}</p>
                      <p className="text-xs text-slate-400">{s.date}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-teal-600 transition-colors">
                    {s.duration}
                  </span>
                </button>
              ))}
              <Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700 hover:bg-teal-50" asChild>
                <Link href="/progress">View all activity →</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Areas to strengthen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-orange-500" />
                Areas to Strengthen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {WEAK_AREAS.map((wa) => (
                <div
                  key={wa.topic}
                  className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{wa.topic}</p>
                    <p className="text-xs text-slate-500">{wa.subject} · {wa.score}% correct</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => goToTutor(wa.subject, wa.topic)}
                    className="text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Review
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Achievement badges */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {ACHIEVEMENTS.map((badge) =>
                badge.unlocked ? (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 border border-amber-100 hover:shadow-md transition-shadow min-w-[80px]"
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <span className="text-xs font-medium text-amber-800 text-center">
                      {badge.title}
                    </span>
                  </button>
                ) : (
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
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badge detail modal */}
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
              {selectedBadge.unlockedDate && (
                <Badge variant="secondary">Unlocked {selectedBadge.unlockedDate}</Badge>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
