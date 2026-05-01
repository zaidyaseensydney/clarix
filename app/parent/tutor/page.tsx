"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ParentChild {
  id: string;
  child_name: string;
  year_level: number;
  state: string;
}

const SUGGESTION_CHIPS = [
  "How can I support my child at home?",
  "What study habits help most at this year level?",
  "How do I keep my child motivated?",
  "What should we focus on this term?",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 fade-in">
      <div className="h-8 w-8 rounded-full bg-teal-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
        C
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1">
          <div className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
          <div className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
          <div className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  );
}

function ParentAdvisorChat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childIdParam = searchParams.get("child");
  const initialQ = searchParams.get("q");

  const [child, setChild] = useState<ParentChild | null>(null);
  const [allChildren, setAllChildren] = useState<ParentChild[]>([]);
  const [loadingChild, setLoadingChild] = useState(true);
  const [contextOpen, setContextOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitial = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadChildren() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoadingChild(false); return; }

      const { data: rows } = await supabase
        .from("parent_children")
        .select("*")
        .eq("parent_id", session.user.id)
        .order("created_at");

      const list = (rows ?? []) as ParentChild[];
      setAllChildren(list);

      const selected = childIdParam
        ? list.find((c) => c.id === childIdParam) ?? list[0]
        : list[0];

      setChild(selected ?? null);
      setLoadingChild(false);
    }

    loadChildren();
  }, [childIdParam]);

  useEffect(() => {
    if (!child) return;

    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: `Hi! I'm your Clarix Parent Advisor. I'm here to help you support **${child.child_name}** (Year ${child.year_level}, ${child.state}) at home.\n\nWhat would you like to know?`,
        timestamp: new Date(),
      },
    ]);
  }, [child]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (initialQ && child && !hasSentInitial.current && messages.length > 0) {
      hasSentInitial.current = true;
      sendMessage(initialQ);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child, messages.length]);

  async function sendMessage(text?: string) {
    if (!child) return;
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setChipsVisible(false);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const parentContext = {
      childName: child.child_name,
      yearLevel: child.year_level,
      state: child.state,
      strongSubject: "Not yet determined",
      strongPct: 0,
      weakSubject: "Not yet determined",
      weakPct: 0,
      recentTopics: "No sessions completed yet",
      weakAreas: "No data yet",
      streak: 0,
      weeklyHours: "0h",
    };

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          mode: "parent",
          parentContext,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      toast.error("Couldn't reach the advisor. Please try again.");
    }
    setLoading(false);
  }

  if (loadingChild) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-4xl">👨‍👩‍👧</div>
        <h2 className="text-xl font-semibold text-slate-900">No children added yet</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Add a child on the parent dashboard before using the advisor.
        </p>
        <Button onClick={() => router.push("/parent")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
      {/* LEFT: Chat */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-teal-800 border-b border-teal-700">
          <button
            onClick={() => router.push("/parent")}
            className="p-2 rounded-lg text-teal-100 hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-semibold text-white">Parent Advisor</h1>
            <p className="text-xs text-teal-300">Supporting {child.child_name}&apos;s learning</p>
          </div>

          <button
            className="ml-auto lg:hidden flex items-center gap-1 text-xs text-teal-200 bg-teal-700 rounded-lg px-3 py-1.5"
            onClick={() => setContextOpen(!contextOpen)}
          >
            {child.child_name} {contextOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Mobile collapsible context */}
        {contextOpen && (
          <div className="lg:hidden bg-teal-50 border-b border-teal-200 px-4 py-3 fade-in">
            <p className="text-xs font-semibold text-teal-700">
              {child.child_name} — Year {child.year_level}, {child.state}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex items-end gap-2 fade-in", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-teal-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  C
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-teal-700 text-white rounded-br-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                )}
              >
                {msg.role === "assistant" ? (
                  <div className="prose-chat">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {chipsVisible && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 fade-in mt-2">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-sm hover:bg-teal-100 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-slate-200">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about your child's progress…"
              className="flex-1 min-h-[48px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="h-12 w-12 shrink-0 bg-teal-800 hover:bg-teal-900"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT: Child context sidebar (desktop) */}
      <div className="hidden lg:flex w-72 xl:w-80 flex-col border-l border-slate-200 bg-white overflow-y-auto">
        <div className="p-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Child Profile</p>
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
              <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                {child.child_name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{child.child_name}</p>
                <p className="text-xs text-slate-500">Year {child.year_level} · {child.state}</p>
              </div>
            </div>
          </div>

          {allChildren.length > 1 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Switch Child</p>
                <div className="space-y-1">
                  {allChildren.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => router.push(`/parent/tutor?child=${c.id}`)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        c.id === child.id
                          ? "bg-teal-50 text-teal-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold shrink-0">
                        {c.child_name[0]?.toUpperCase()}
                      </div>
                      {c.child_name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Session Stats</p>
            <p className="text-sm text-slate-400">
              Activity data will appear here as {child.child_name} uses Clarix.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParentTutorPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Loading advisor…</div>}>
      <ParentAdvisorChat />
    </Suspense>
  );
}
