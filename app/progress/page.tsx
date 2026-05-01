"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Clock, BookOpen, Trophy, Lock, ChevronDown, ChevronUp } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  ACHIEVEMENTS,
  WEEKLY_ACTIVITY,
  TOPIC_BREAKDOWN,
} from "@/lib/mock-data";
import type { Achievement } from "@/lib/types";
import { cn } from "@/lib/utils";

type SubjectFilter = "All" | "Maths" | "English" | "Science" | "History";
type PeriodFilter = "This Week" | "This Month" | "All Time";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SUBJECT_BADGE_COLORS: Record<string, string> = {
  Maths: "bg-teal-100 text-teal-700",
  English: "bg-purple-100 text-purple-700",
  Science: "bg-emerald-100 text-emerald-700",
  History: "bg-amber-100 text-amber-700",
};

const SUBJECT_PROGRESS_COLORS: Record<string, string> = {
  Maths: "bg-teal-600",
  English: "bg-purple-600",
  Science: "bg-emerald-600",
  History: "bg-amber-600",
};

const STRENGTHS = ["Linear equations", "Ecosystems", "Text analysis", "Federation"];
const WEAK_AREAS = ["Fractions", "Grammar", "Colonial Australia"];

export default function ProgressPage() {
  const router = useRouter();
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("All");
  const [period, setPeriod] = useState<PeriodFilter>("This Week");
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const activityData = WEEKLY_ACTIVITY[period];
  const maxActivity = Math.max(...activityData, 1);

  const filteredTopics =
    subjectFilter === "All"
      ? TOPIC_BREAKDOWN
      : TOPIC_BREAKDOWN.filter((t) => t.subject === subjectFilter);

  function goToTutor(subject: string, topic: string) {
    router.push(`/tutor?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`);
  }

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Progress</h1>
            <p className="text-slate-500 mt-1">Track your learning journey.</p>
          </div>
          {/* Period toggle */}
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

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Study time", value: "4h 23m", icon: Clock, color: "text-teal-600" },
            { label: "Day streak", value: "7 days", icon: Flame, color: "text-orange-500" },
            { label: "Sessions", value: "11", icon: BookOpen, color: "text-purple-600" },
            { label: "Quizzes done", value: "8", icon: Trophy, color: "text-amber-500" },
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

        {/* Weekly activity chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {activityData.map((value, i) => (
                <div key={DAYS[i]} className="flex flex-col items-center flex-1 gap-1">
                  <div className="w-full flex items-end" style={{ height: "128px" }}>
                    <div
                      className="w-full rounded-t-lg bg-teal-500 bar-animate"
                      style={{
                        height: `${(value / maxActivity) * 100}%`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{DAYS[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">Minutes studied per day</p>
          </CardContent>
        </Card>

        {/* Subject filter */}
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {(["All", "Maths", "English", "Science", "History"] as SubjectFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setSubjectFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium border transition-colors",
                  subjectFilter === f
                    ? "bg-teal-600 text-white border-teal-600"
                    : "border-slate-200 text-slate-600 hover:border-teal-300 bg-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Topic breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Topic Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {filteredTopics.map((item) => (
                <div key={item.topic}>
                  <button
                    onClick={() =>
                      setExpandedTopic(expandedTopic === item.topic ? null : item.topic)
                    }
                    className="w-full flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <Badge className={cn("text-xs border-0 shrink-0", SUBJECT_BADGE_COLORS[item.subject])}>
                      {item.subject}
                    </Badge>
                    <span className="text-sm font-medium text-slate-800 flex-1 text-left">
                      {item.topic}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:block w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full progress-fill", SUBJECT_PROGRESS_COLORS[item.subject])}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-8 text-right">
                        {item.progress}%
                      </span>
                      {expandedTopic === item.topic ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {expandedTopic === item.topic && (
                    <div className="mx-2 mb-3 px-4 py-4 bg-slate-50 rounded-xl text-sm space-y-2 fade-in">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-slate-400 text-xs mb-0.5">Questions attempted</p>
                          <p className="font-semibold text-slate-800">{item.attempted}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs mb-0.5">Questions correct</p>
                          <p className="font-semibold text-slate-800">{item.correct}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs mb-0.5">Last studied</p>
                          <p className="font-semibold text-slate-800">{item.lastStudied}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => goToTutor(item.subject, item.topic)}
                      >
                        Practice this topic
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Strengths & weak areas */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-emerald-700">💪 Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {STRENGTHS.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-red-600">📍 Needs Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {WEAK_AREAS.map((w) => (
                  <span key={w} className="px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {w}
                  </span>
                ))}
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
              {ACHIEVEMENTS.map((badge) =>
                badge.unlocked ? (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 border border-amber-100 hover:shadow-md transition-shadow min-w-[80px]"
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <span className="text-xs font-medium text-amber-800 text-center">{badge.title}</span>
                  </button>
                ) : (
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
