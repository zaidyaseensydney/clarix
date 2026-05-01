"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MOCK_CHILDREN,
  PARENT_ACTIVITY_FEED,
  AI_INSIGHTS,
  PARENT_CHILD_STATS,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-teal-500",
  English: "bg-purple-500",
  Science: "bg-emerald-500",
  History: "bg-amber-500",
};

const GRADE_COLORS: Record<string, string> = {
  A: "text-emerald-600",
  B: "text-teal-600",
  C: "text-amber-600",
  D: "text-red-600",
};

function AnimatedBar({ progress }: { progress: number }) {
  const [width, setWidth] = useState(0);
  const barClass =
    progress >= 75
      ? "bg-emerald-500"
      : progress >= 50
      ? "bg-amber-500"
      : "bg-red-400";

  useEffect(() => {
    const t = setTimeout(() => setWidth(progress), 100);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex-1">
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", barClass)}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export default function ParentPage() {
  const router = useRouter();
  const [activeChild, setActiveChild] = useState(MOCK_CHILDREN[0].id);
  const [activityDetail, setActivityDetail] = useState<(typeof PARENT_ACTIVITY_FEED)[0] | null>(null);
  const [encourageInsight, setEncourageInsight] = useState<(typeof AI_INSIGHTS)[0] | null>(null);
  const [encourageMessage, setEncourageMessage] = useState("Hey Jake! I noticed you haven't studied recently. How about a quick Clarix session today? I'm proud of how hard you've been working! 💪");
  const [addChildOpen, setAddChildOpen] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildYear, setNewChildYear] = useState(8);

  const child = MOCK_CHILDREN.find((c) => c.id === activeChild) ?? MOCK_CHILDREN[0];

  function goToParentTutor(question?: string) {
    if (question) {
      router.push(`/parent/tutor?q=${encodeURIComponent(question)}&child=${child.id}`);
    } else {
      router.push(`/parent/tutor?child=${child.id}`);
    }
  }

  function handleAddChild() {
    toast.success(`${newChildName || "Child"} added successfully!`);
    setAddChildOpen(false);
    setNewChildName("");
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Parent Dashboard</h1>
            <p className="text-slate-500 mt-1">Monitor your children&apos;s learning progress.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAddChildOpen(true)}>
              <Plus className="h-4 w-4" />
              Add child
            </Button>
            <Button onClick={() => goToParentTutor()}>
              Ask Parent Tutor
            </Button>
          </div>
        </div>

        {/* Child tabs */}
        <Tabs value={activeChild} onValueChange={setActiveChild}>
          <TabsList>
            {MOCK_CHILDREN.map((c) => (
              <TabsTrigger key={c.id} value={c.id}>
                {c.name} (Y{c.yearLevel})
              </TabsTrigger>
            ))}
          </TabsList>

          {MOCK_CHILDREN.map((c) => {
            const cStats = PARENT_CHILD_STATS[c.id as keyof typeof PARENT_CHILD_STATS];
            if (!cStats) return null;
            return (
              <TabsContent key={c.id} value={c.id} className="space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Time spent learning</p>
                          <p className="text-2xl font-bold text-slate-900">{cStats.timeSpent}</p>
                          <p className="text-xs text-emerald-600 font-medium mt-0.5">{cStats.timeChange} vs last week</p>
                        </div>
                        <Clock className="h-5 w-5 text-teal-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Sessions completed</p>
                          <p className="text-2xl font-bold text-slate-900">{cStats.sessions}</p>
                          <p className="text-xs text-slate-400 mt-0.5">avg {cStats.avgSession} each</p>
                        </div>
                        <BookOpen className="h-5 w-5 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-xs text-slate-400 mb-2">Areas needing attention</p>
                      <div className="space-y-1">
                        {cStats.weakAreas.map((wa) => (
                          <Badge key={wa} variant="warning" className="mr-1 mb-1 text-xs">
                            {wa}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Weekly report card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Weekly Report — {c.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cStats.subjects.map((sub) => (
                      <button
                        key={sub.subject}
                        className="w-full"
                        onClick={() => goToParentTutor(`How is ${c.name} doing in ${sub.subject}?`)}
                      >
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", SUBJECT_COLORS[sub.subject])} />
                          <span className="text-sm font-medium text-slate-800 w-16 text-left shrink-0">
                            {sub.subject}
                          </span>
                          <span className={cn("text-lg font-bold w-8 text-left shrink-0", GRADE_COLORS[sub.grade])}>
                            {sub.grade}
                          </span>
                          <span className="text-slate-400 shrink-0">
                            {sub.trend === "↑" ? (
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                            ) : sub.trend === "↓" ? (
                              <TrendingDown className="h-4 w-4 text-red-400" />
                            ) : (
                              <Minus className="h-4 w-4 text-slate-400" />
                            )}
                          </span>
                          <AnimatedBar progress={sub.progress} />
                          <span className="text-sm font-medium text-slate-600 w-8 text-right shrink-0">
                            {sub.progress}%
                          </span>
                          <span className="text-xs text-slate-400 shrink-0 hidden sm:block">
                            {sub.sessions} sessions
                          </span>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Activity feed + AI insights */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Activity feed */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      {PARENT_ACTIVITY_FEED.filter((a) => a.child === c.name).map((activity) => (
                        <button
                          key={activity.id}
                          onClick={() => setActivityDetail(activity)}
                          className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                        >
                          <span className="text-lg shrink-0">{activity.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-800">
                              <span className="font-medium">{activity.child}</span> {activity.text}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* AI insights */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">AI Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {AI_INSIGHTS.filter((ins) => ins.child === c.name).map((insight) => (
                        <div key={insight.id} className="flex flex-col gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{insight.icon}</span>
                            <p className="text-sm text-slate-700">{insight.text}</p>
                          </div>
                          {insight.showEncouragement && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="self-start text-xs"
                              onClick={() => setEncourageInsight(insight)}
                            >
                              Send encouragement
                            </Button>
                          )}
                        </div>
                      ))}
                      {AI_INSIGHTS.filter((ins) => ins.child === c.name).length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-4">No insights yet — check back after more sessions.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      {/* Activity detail modal */}
      <Dialog open={!!activityDetail} onOpenChange={(o) => !o && setActivityDetail(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Session Detail</DialogTitle>
          </DialogHeader>
          {activityDetail && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="text-2xl">{activityDetail.icon}</span>
                <div>
                  <p className="font-medium text-slate-800">
                    {activityDetail.child} {activityDetail.text}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{activityDetail.time}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">{activityDetail.detail}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Encouragement modal */}
      <Dialog open={!!encourageInsight} onOpenChange={(o) => !o && setEncourageInsight(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Send Encouragement</DialogTitle>
            <DialogDescription>
              Send a message to motivate {encourageInsight?.child}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={encourageMessage}
              onChange={(e) => setEncourageMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              className="w-full"
              onClick={() => {
                setEncourageInsight(null);
                toast.success("Message sent!");
              }}
            >
              Send message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add child modal */}
      <Dialog open={addChildOpen} onOpenChange={setAddChildOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Another Child</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Child&apos;s name</Label>
              <Input
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Name"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Year level</Label>
              <div className="grid grid-cols-6 gap-1.5 mt-1.5">
                {[7, 8, 9, 10, 11, 12].map((y) => (
                  <button
                    key={y}
                    onClick={() => setNewChildYear(y)}
                    className={cn(
                      "h-10 rounded-lg text-sm font-medium border transition-colors",
                      newChildYear === y
                        ? "border-teal-500 bg-teal-600 text-white"
                        : "border-slate-200 text-slate-600 hover:border-teal-300"
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={handleAddChild} disabled={!newChildName.trim()}>
              Add child
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
