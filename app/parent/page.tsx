"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  BookOpen,
  Plus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { AustralianState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ParentChild {
  id: string;
  child_name: string;
  year_level: number;
  state: string;
  parent_id: string;
}

const STATES: AustralianState[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export default function ParentPage() {
  const router = useRouter();
  const [parentId, setParentId] = useState<string | null>(null);
  const [parentName, setParentName] = useState("");
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [activeChild, setActiveChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildYear, setNewChildYear] = useState(8);
  const [newChildState, setNewChildState] = useState<AustralianState | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setParentId(profile.id);
        setParentName(profile.full_name?.split(" ")[0] ?? "");

        const { data: childRows } = await supabase
          .from("parent_children")
          .select("*")
          .eq("parent_id", profile.id)
          .order("created_at");

        const childList = childRows ?? [];
        setChildren(childList);
        if (childList.length > 0) setActiveChild(childList[0].id);
      }
      setLoading(false);
    }

    load();
  }, []);

  function goToAdvisor(childId?: string, question?: string) {
    const params = new URLSearchParams();
    if (childId) params.set("child", childId);
    if (question) params.set("q", encodeURIComponent(question));
    router.push(`/parent/tutor?${params.toString()}`);
  }

  async function handleAddChild() {
    if (!newChildName.trim() || !newChildState || !parentId) return;
    setSaving(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("parent_children")
      .insert({
        parent_id: parentId,
        child_name: newChildName.trim(),
        year_level: newChildYear,
        state: newChildState,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      toast.error("Could not add child. Please try again.");
      return;
    }

    const updated = [...children, data as ParentChild];
    setChildren(updated);
    setActiveChild(data.id);
    setAddChildOpen(false);
    setNewChildName("");
    setNewChildState("");
    toast.success(`${newChildName} added successfully!`);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {parentName ? `${parentName}'s Dashboard` : "Parent Dashboard"}
            </h1>
            <p className="text-slate-500 mt-1">Monitor your children&apos;s learning journey.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAddChildOpen(true)}>
              <Plus className="h-4 w-4" />
              Add child
            </Button>
            <Button onClick={() => goToAdvisor(activeChild ?? undefined)}>
              Ask Parent Advisor
            </Button>
          </div>
        </div>

        {children.length === 0 ? (
          /* Empty state */
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-teal-50 flex items-center justify-center">
                  <Users className="h-8 w-8 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">No children added yet</h2>
                  <p className="text-slate-500 text-sm max-w-sm">
                    Add your child&apos;s details to get started. You can track their learning progress and get personalised advice from the Parent Advisor.
                  </p>
                </div>
                <Button onClick={() => setAddChildOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add your first child
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Children tabs */
          <Tabs value={activeChild ?? ""} onValueChange={setActiveChild}>
            <TabsList>
              {children.map((c) => (
                <TabsTrigger key={c.id} value={c.id}>
                  {c.child_name} (Y{c.year_level})
                </TabsTrigger>
              ))}
            </TabsList>

            {children.map((child) => (
              <TabsContent key={child.id} value={child.id} className="space-y-6">
                {/* Child profile header */}
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                          {child.child_name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">{child.child_name}</h3>
                          <p className="text-sm text-slate-500">Year {child.year_level} · {child.state}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToAdvisor(child.id)}
                      >
                        Ask about {child.child_name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats row — empty state */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Time spent learning</p>
                          <p className="text-2xl font-bold text-slate-900">—</p>
                          <p className="text-xs text-slate-400 mt-0.5">No sessions yet</p>
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
                          <p className="text-2xl font-bold text-slate-900">0</p>
                          <p className="text-xs text-slate-400 mt-0.5">—</p>
                        </div>
                        <BookOpen className="h-5 w-5 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-xs text-slate-400 mb-2">Areas needing attention</p>
                      <p className="text-sm text-slate-400 py-1">
                        Will appear after quizzes are completed.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Activity + Insights — empty states */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                        <BookOpen className="h-10 w-10 text-slate-200" />
                        <p className="text-sm text-slate-500">
                          {child.child_name}&apos;s activity will appear here once they start using Clarix.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">AI Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                        <div className="text-3xl">💡</div>
                        <p className="text-sm text-slate-500">
                          Insights will appear as {child.child_name} completes sessions.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => goToAdvisor(child.id, `What advice do you have for supporting ${child.child_name} in Year ${child.year_level}?`)}
                        >
                          Ask the Advisor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Add child modal */}
      <Dialog open={addChildOpen} onOpenChange={setAddChildOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add a Child</DialogTitle>
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
            <div>
              <Label>State</Label>
              <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                {STATES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setNewChildState(s)}
                    className={cn(
                      "h-10 rounded-lg text-xs font-medium border transition-colors",
                      newChildState === s
                        ? "border-teal-500 bg-teal-600 text-white"
                        : "border-slate-200 text-slate-600 hover:border-teal-300"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleAddChild}
              disabled={!newChildName.trim() || !newChildState || saving}
            >
              {saving ? "Adding…" : "Add child"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
