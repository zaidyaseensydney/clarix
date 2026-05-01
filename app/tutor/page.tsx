"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Trash2, Lightbulb, BookOpen, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { TOPICS, SYLLABUS_OUTCOMES } from "@/lib/subject-topics";
import { buildTutorGreeting } from "@/lib/groq-prompts";
import type { Subject, Message, QuizState, QuestionType } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUBJECTS: Subject[] = ["Maths", "English", "Science", "History"];

function pickQuestionType(subject: Subject): QuestionType {
  if (subject === "Maths") {
    return Math.random() < 0.5 ? "multiple_choice" : "short_answer";
  }
  const types: QuestionType[] = ["multiple_choice", "short_answer", "long_answer"];
  return types[Math.floor(Math.random() * 3)];
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 fade-in">
      <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
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

function QuizCard({
  quiz,
  subject,
  topic,
  onNext,
}: {
  quiz: QuizState;
  subject: Subject;
  topic: string;
  onNext: () => void;
}) {
  const [shortAnswer, setShortAnswer] = useState("");
  const [longAnswer, setLongAnswer] = useState("");
  const [localQuiz, setLocalQuiz] = useState(quiz);
  const [evaluating, setEvaluating] = useState(false);

  if (!localQuiz.question) return null;
  const q = localQuiz.question;

  async function submitOpen(answer: string) {
    setEvaluating(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          question: q.question,
          userAnswer: answer,
          questionType: q.type,
        }),
      });
      const data = await res.json();
      setLocalQuiz((prev) => ({
        ...prev,
        answered: true,
        userAnswer: answer,
        evaluation: data,
      }));
    } catch {
      toast.error("Could not evaluate answer.");
    }
    setEvaluating(false);
  }

  function selectMCQ(option: string) {
    if (localQuiz.answered) return;
    setLocalQuiz((prev) => ({ ...prev, answered: true, selectedOption: option }));
  }

  const isCorrectMCQ =
    q.type === "multiple_choice" &&
    localQuiz.answered &&
    localQuiz.selectedOption?.startsWith(q.correct ?? "");

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="bg-teal-600 px-5 py-3 flex items-center gap-2">
        <Target className="h-4 w-4 text-white" />
        <span className="text-sm font-semibold text-white">Quiz Question</span>
        <span className="ml-auto text-xs text-teal-200 bg-teal-700/50 rounded px-2 py-0.5">
          {q.type.replace("_", " ")}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <p className="font-medium text-slate-900">{q.question}</p>

        {/* MCQ options */}
        {q.type === "multiple_choice" && q.options && (
          <div className="space-y-2">
            {q.options.map((opt) => {
              const isSelected = localQuiz.selectedOption === opt;
              const optLetter = opt.charAt(0);
              const isCorrectOpt = optLetter === q.correct;
              let cls = "border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50";
              if (localQuiz.answered) {
                if (isCorrectOpt) cls = "border-emerald-500 bg-emerald-50 text-emerald-800";
                else if (isSelected && !isCorrectOpt) cls = "border-red-400 bg-red-50 text-red-700";
                else cls = "border-slate-200 text-slate-400 opacity-60";
              } else if (isSelected) {
                cls = "border-teal-500 bg-teal-50 text-teal-800";
              }
              return (
                <button
                  key={opt}
                  disabled={localQuiz.answered}
                  onClick={() => selectMCQ(opt)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors",
                    cls
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Short answer */}
        {q.type === "short_answer" && !localQuiz.answered && (
          <div className="space-y-2">
            <input
              type="text"
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && shortAnswer.trim() && submitOpen(shortAnswer)}
              placeholder="Your answer…"
              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Button
              onClick={() => submitOpen(shortAnswer)}
              disabled={!shortAnswer.trim() || evaluating}
              className="w-full"
            >
              {evaluating ? "Checking…" : "Submit Answer"}
            </Button>
          </div>
        )}

        {/* Long answer */}
        {q.type === "long_answer" && !localQuiz.answered && (
          <div className="space-y-2">
            <Textarea
              value={longAnswer}
              onChange={(e) => setLongAnswer(e.target.value)}
              placeholder="Write your answer here…"
              className="min-h-[120px]"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">{longAnswer.split(/\s+/).filter(Boolean).length} words</span>
              <Button
                onClick={() => submitOpen(longAnswer)}
                disabled={!longAnswer.trim() || evaluating}
              >
                {evaluating ? "Checking…" : "Submit Answer"}
              </Button>
            </div>
          </div>
        )}

        {/* Hint */}
        {!localQuiz.answered && (
          <button
            onClick={() => setLocalQuiz((p) => ({ ...p, showHint: !p.showHint }))}
            className="flex items-center gap-1.5 text-xs text-teal-600 hover:underline"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            {localQuiz.showHint ? "Hide hint" : "Get a hint"}
          </button>
        )}
        {localQuiz.showHint && (
          <div className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            💡 {q.hint}
          </div>
        )}

        {/* Result for MCQ */}
        {q.type === "multiple_choice" && localQuiz.answered && (
          <div className={cn("rounded-xl px-4 py-3 text-sm", isCorrectMCQ ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200")}>
            <p className={cn("font-semibold mb-1", isCorrectMCQ ? "text-emerald-700" : "text-red-700")}>
              {isCorrectMCQ ? "✅ Correct!" : "❌ Not quite"}
            </p>
            <p className="text-slate-600">{q.explanation}</p>
          </div>
        )}

        {/* Result for open-ended */}
        {(q.type === "short_answer" || q.type === "long_answer") && localQuiz.answered && localQuiz.evaluation && (
          <div className={cn("rounded-xl px-4 py-3 text-sm", localQuiz.evaluation.correct ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200")}>
            <p className={cn("font-semibold mb-1", localQuiz.evaluation.correct ? "text-emerald-700" : "text-amber-700")}>
              {localQuiz.evaluation.correct ? "✅ Well done!" : "📝 Good effort!"}
            </p>
            <p className="text-slate-600">{localQuiz.evaluation.feedback}</p>
          </div>
        )}

        {/* Next question */}
        {localQuiz.answered && (
          <Button className="w-full" onClick={onNext}>
            Next question →
          </Button>
        )}
      </div>
    </div>
  );
}

function TutorChat() {
  const searchParams = useSearchParams();
  const initSubject = (searchParams.get("subject") as Subject) ?? "Maths";
  const initTopic = searchParams.get("topic") ?? TOPICS[initSubject][0];

  const [subject, setSubject] = useState<Subject>(initSubject);
  const [topic, setTopic] = useState(initTopic);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "assistant",
      content: buildTutorGreeting(initSubject, initTopic),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, quizState, loading]);

  function changeSubject(newSubject: Subject) {
    setSubject(newSubject);
    const newTopic = TOPICS[newSubject][0];
    setTopic(newTopic);
    resetChat(newSubject, newTopic);
  }

  function changeTopic(newTopic: string) {
    setTopic(newTopic);
    resetChat(subject, newTopic);
  }

  function resetChat(s: Subject, t: string) {
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        role: "assistant",
        content: buildTutorGreeting(s, t),
        timestamp: new Date(),
      },
    ]);
    setQuizState(null);
    setPreviousQuestions([]);
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

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
        body: JSON.stringify({ messages: history, mode: "student", subject, topic }),
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
      toast.error("Couldn't reach the tutor. Please try again.");
    }
    setLoading(false);
  }

  async function handleQuiz() {
    setQuizLoading(true);
    const questionType = pickQuestionType(subject);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, questionType, previousQuestions }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPreviousQuestions((prev) => [...prev, data.question.question ?? ""]);
      setQuizState({
        question: data.question,
        answered: false,
        showHint: false,
        previousQuestions,
      });
    } catch {
      toast.error("Couldn't load a quiz question. Please try again.");
    }
    setQuizLoading(false);
  }

  async function handleQuickAction(type: "hint" | "explanation") {
    const prompt =
      type === "hint"
        ? `Give me a subtle hint for ${topic} in ${subject}.`
        : `Give me a clear explanation of ${topic} in ${subject}.`;
    await sendMessage(prompt);
  }

  const syllabusOutcome = SYLLABUS_OUTCOMES[subject]?.[topic] ?? "";

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
      {/* LEFT: Chat panel */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-slate-200">
          <div>
            <h1 className="font-semibold text-slate-900">Clarix Tutor Chat</h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              {subject} · {topic}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear chat?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all messages and start a new session.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => resetChat(subject, topic)}>
                  Clear chat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Mobile topic bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-2">
          <Select value={subject} onValueChange={(v) => changeSubject(v as Subject)}>
            <SelectTrigger className="h-9 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["Maths", "English", "Science", "History"] as Subject[]).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={topic} onValueChange={changeTopic}>
            <SelectTrigger className="h-9 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPICS[subject].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button onClick={() => handleQuickAction("hint")} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 min-h-[36px] min-w-[36px] flex items-center justify-center" title="Hint">
            <Lightbulb className="h-4 w-4" />
          </button>
          <button onClick={() => handleQuickAction("explanation")} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 min-h-[36px] min-w-[36px] flex items-center justify-center" title="Explanation">
            <BookOpen className="h-4 w-4" />
          </button>
          <button onClick={handleQuiz} disabled={quizLoading} className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 min-h-[36px] min-w-[36px] flex items-center justify-center" title="Quiz">
            {quizLoading ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : <Target className="h-4 w-4" />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex items-end gap-2 fade-in", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  C
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-teal-600 text-white rounded-br-sm"
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

          {/* Quiz card in chat flow */}
          {quizState && (
            <div className="max-w-2xl">
              <QuizCard
                key={quizState.question?.question ?? "quiz"}
                quiz={quizState}
                subject={subject}
                topic={topic}
                onNext={() => {
                  setQuizState(null);
                  handleQuiz();
                }}
              />
            </div>
          )}

          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-slate-200">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
              className="flex-1 min-h-[48px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="h-12 w-12 shrink-0"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT: Sidebar (desktop only) */}
      <div className="hidden lg:flex w-72 xl:w-80 flex-col border-l border-slate-200 bg-white overflow-y-auto">
        <div className="p-5 space-y-6">
          {/* Topic selector */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Current Topic</p>
            <Select value={subject} onValueChange={(v) => changeSubject(v as Subject)}>
              <SelectTrigger className="w-full mb-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={topic} onValueChange={changeTopic}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOPICS[subject].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Lesson info */}
          <div>
            <p className="font-semibold text-slate-900 mb-1">{topic}</p>
            {syllabusOutcome && (
              <p className="text-xs text-slate-500 leading-relaxed">{syllabusOutcome}</p>
            )}
          </div>

          <Separator />

          {/* Quick actions */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Actions</p>
            <div className="space-y-0">
              <Button
                variant="outline"
                className="w-full justify-start rounded-b-none border-b-0"
                onClick={() => handleQuickAction("hint")}
                disabled={loading}
              >
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Get a hint
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-none"
                onClick={() => handleQuickAction("explanation")}
                disabled={loading}
              >
                <BookOpen className="h-4 w-4 text-blue-500" />
                Get an explanation
              </Button>
              <Button
                className="w-full justify-start h-14 rounded-t-none rounded-xl"
                onClick={handleQuiz}
                disabled={quizLoading || loading}
              >
                {quizLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <Target className="h-4 w-4" />
                )}
                Take a quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TutorPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Loading tutor…</div>}>
      <TutorChat />
    </Suspense>
  );
}
