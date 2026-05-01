"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, CheckCircle, User, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AustralianState, Subject } from "@/lib/types";

type UserType = "student" | "parent";

const STATES: AustralianState[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const SUBJECTS: Subject[] = ["Maths", "English", "Science", "History"];
const YEAR_LEVELS = Array.from({ length: 12 }, (_, i) => i + 1);

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
              i + 1 < step
                ? "bg-teal-600 text-white"
                : i + 1 === step
                ? "bg-teal-600 text-white ring-2 ring-teal-200"
                : "bg-slate-100 text-slate-400"
            )}
          >
            {i + 1 < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={cn(
                "h-0.5 w-8 mx-1 transition-colors",
                i + 1 < step ? "bg-teal-600" : "bg-slate-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [yearLevel, setYearLevel] = useState<number>(10);
  const [state, setState] = useState<AustralianState | "">("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [childName, setChildName] = useState("");
  const [childYear, setChildYear] = useState<number>(7);
  const [childState, setChildState] = useState<AustralianState | "">("");
  const [extraChildren, setExtraChildren] = useState<Array<{ name: string; year: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;

  function toggleSubject(s: Subject) {
    setSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8) e.password = "Password must be at least 8 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleFinish() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.push(userType === "parent" ? "/parent" : "/dashboard");
  }

  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-700 flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Clarix</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Join thousands of Australian students learning smarter.
          </h2>
          <ul className="space-y-3">
            {[
              "Free to start, no credit card required",
              "Aligned to your state curriculum",
              "Learn at your own pace, any time",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-teal-100">
                <CheckCircle className="h-5 w-5 text-teal-300 shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-teal-200 text-sm">
          Trusted by 50,000+ Australian students and their families.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-8 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">It takes less than 2 minutes.</p>
          </div>

          <StepIndicator step={step} total={totalSteps} />

          {/* Step 1: User type */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">I am signing up as</h2>
              <button
                onClick={() => setUserType("student")}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all",
                  userType === "student"
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 hover:border-teal-300"
                )}
              >
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center",
                  userType === "student" ? "bg-teal-100" : "bg-slate-100"
                )}>
                  <User className={cn("h-6 w-6", userType === "student" ? "text-teal-600" : "text-slate-500")} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Student</p>
                  <p className="text-sm text-slate-500">I want to learn and get tutoring</p>
                </div>
              </button>
              <button
                onClick={() => setUserType("parent")}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all",
                  userType === "parent"
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 hover:border-teal-300"
                )}
              >
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center",
                  userType === "parent" ? "bg-teal-100" : "bg-slate-100"
                )}>
                  <Users className={cn("h-6 w-6", userType === "parent" ? "text-teal-600" : "text-slate-500")} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Parent / Guardian</p>
                  <p className="text-sm text-slate-500">I want to monitor my child&apos;s progress</p>
                </div>
              </button>
              <Button
                className="w-full mt-4"
                disabled={!userType}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Name, email, password */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Your details</h2>
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); }}
                  className="mt-1.5"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); }}
                  className="mt-1.5"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input
                  id="pw"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: "" }); }}
                  className="mt-1.5"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" onClick={() => { if (validateStep2()) setStep(3); }}>Continue</Button>
              </div>
            </div>
          )}

          {/* Step 3: Student specific */}
          {step === 3 && userType === "student" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Your learning profile</h2>
              <div>
                <Label>Year level</Label>
                <div className="grid grid-cols-6 gap-1.5 mt-1.5">
                  {YEAR_LEVELS.map((y) => (
                    <button
                      key={y}
                      onClick={() => setYearLevel(y)}
                      className={cn(
                        "h-10 rounded-lg text-sm font-medium border transition-colors",
                        yearLevel === y
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
                      onClick={() => setState(s)}
                      className={cn(
                        "h-10 rounded-lg text-xs font-medium border transition-colors",
                        state === s
                          ? "border-teal-500 bg-teal-600 text-white"
                          : "border-slate-200 text-slate-600 hover:border-teal-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Subjects (select all that apply)</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSubject(s)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm border transition-colors",
                        subjects.includes(s)
                          ? "border-teal-500 bg-teal-600 text-white"
                          : "border-slate-200 text-slate-600 hover:border-teal-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1" onClick={handleFinish} disabled={loading || !state}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating account…
                    </span>
                  ) : "Create Account"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Parent specific */}
          {step === 3 && userType === "parent" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Your child&apos;s details</h2>
              <div>
                <Label>Child&apos;s name</Label>
                <Input
                  placeholder="Child's name"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Year level</Label>
                  <div className="grid grid-cols-3 gap-1 mt-1.5">
                    {[7, 8, 9, 10, 11, 12].map((y) => (
                      <button
                        key={y}
                        onClick={() => setChildYear(y)}
                        className={cn(
                          "h-10 rounded-lg text-sm font-medium border transition-colors",
                          childYear === y
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
                  <div className="grid grid-cols-2 gap-1 mt-1.5">
                    {STATES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setChildState(s)}
                        className={cn(
                          "h-10 rounded-lg text-xs font-medium border transition-colors",
                          childState === s
                            ? "border-teal-500 bg-teal-600 text-white"
                            : "border-slate-200 text-slate-600 hover:border-teal-300"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extra children */}
              {extraChildren.length > 0 && (
                <div className="space-y-2">
                  <Label>Additional children</Label>
                  {extraChildren.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-700 flex-1">{c.name} — Year {c.year}</span>
                      <button
                        onClick={() => setExtraChildren((prev) => prev.filter((_, j) => j !== i))}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setExtraChildren((prev) => [...prev, { name: `Child ${prev.length + 2}`, year: 8 }])}
                className="text-sm text-teal-600 hover:underline flex items-center gap-1"
              >
                + Add another child
              </button>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1" onClick={handleFinish} disabled={loading || !childName || !childState}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating account…
                    </span>
                  ) : "Create Account"}
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
