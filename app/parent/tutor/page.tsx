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
import { Badge } from "@/components/ui/badge";
import { MOCK_CHILDREN, PARENT_CHILD_STATS } from "@/lib/mock-data";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUGGESTION_CHIPS = [
  "How is my child doing overall?",
  "What can I do to help at home?",
  "Explain linear equations to me",
  "What should we focus on this week?",
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

function ParentTutorChat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get("child") ?? MOCK_CHILDREN[0].id;
  const initialQ = searchParams.get("q");

  const child = MOCK_CHILDREN.find((c) => c.id === childId) ?? MOCK_CHILDREN[0];
  const stats = PARENT_CHILD_STATS[childId as keyof typeof PARENT_CHILD_STATS] ?? PARENT_CHILD_STATS["child-1"];

  const strongSubject = stats.subjects.reduce((a, b) => a.progress > b.progress ? a : b);
  const weakSubject = stats.subjects.reduce((a, b) => a.progress < b.progress ? a : b);

  const systemContext = {
    childName: child.name,
    yearLevel: child.yearLevel,
    state: child.state,
    strongSubject: strongSubject.subject,
    strongPct: strongSubject.progress,
    weakSubject: weakSubject.subject,
    weakPct: weakSubject.progress,
    recentTopics: "Linear equations, Ecosystems",
    weakAreas: stats.weakAreas.join(", "),
    streak: 7,
    weeklyHours: stats.timeSpent,
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "assistant",
      content: `Hi! I'm your Clarix Parent Advisor. I'm here to help you support **${child.name}** (Year ${child.yearLevel}, ${child.state}) at home.\n\nWhat would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [contextOpen, setContextOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitial = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (initialQ && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage(initialQ);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage(text?: string) {
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
          parentContext: systemContext,
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
            <p className="text-xs text-teal-300">Supporting {child.name}&apos;s learning</p>
          </div>

          {/* Mobile context toggle */}
          <button
            className="ml-auto lg:hidden flex items-center gap-1 text-xs text-teal-200 bg-teal-700 rounded-lg px-3 py-1.5"
            onClick={() => setContextOpen(!contextOpen)}
          >
            {child.name} {contextOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Mobile collapsible context */}
        {contextOpen && (
          <div className="lg:hidden bg-teal-50 border-b border-teal-200 px-4 py-3 space-y-2 fade-in">
            <p className="text-xs font-semibold text-teal-700">{child.name} — Year {child.yearLevel}, {child.state}</p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="success" className="text-xs">✅ {strongSubject.subject} {strongSubject.progress}%</Badge>
              <Badge variant="warning" className="text-xs">📍 {weakSubject.subject} {weakSubject.progress}%</Badge>
            </div>
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

          {/* Suggestion chips */}
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Child Context</p>
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
              <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                {child.name[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{child.name}</p>
                <p className="text-xs text-slate-500">Year {child.yearLevel} · {child.state}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">This Week</p>
            {[
              { label: "Time studied", value: stats.timeSpent },
              { label: "Sessions", value: String(stats.sessions) },
            ].map((s) => (
              <div key={s.label} className="flex justify-between text-sm">
                <span className="text-slate-500">{s.label}</span>
                <span className="font-medium text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Subject Performance</p>
            {stats.subjects.map((sub) => (
              <div key={sub.subject} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{sub.subject}</span>
                  <span className="font-medium text-slate-800">{sub.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      sub.progress >= 75 ? "bg-emerald-500" : sub.progress >= 50 ? "bg-amber-500" : "bg-red-400"
                    )}
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Needs Attention</p>
            <div className="flex flex-wrap gap-1.5">
              {stats.weakAreas.map((wa) => (
                <Badge key={wa} variant="warning" className="text-xs">
                  {wa}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParentTutorPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Loading advisor…</div>}>
      <ParentTutorChat />
    </Suspense>
  );
}
