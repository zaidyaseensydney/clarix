"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TESTIMONIALS } from "@/lib/mock-data";
import {
  BookOpen,
  Brain,
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Australian Curriculum Aligned",
    description:
      "All content is mapped to the latest ACARA outcomes, from Foundation to Year 12 across all states.",
  },
  {
    icon: Brain,
    title: "AI-Powered Personalised Learning",
    description:
      "Our AI tutor adapts to each student's pace, identifying gaps and reinforcing concepts in real time.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Detailed weekly reports show exactly where students are improving and where they need more focus.",
  },
  {
    icon: Users,
    title: "Parent Dashboard",
    description:
      "Parents stay informed and involved with a dedicated view of their child's sessions and achievements.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose your goals",
    description:
      "Tell us your year level, state, and the subjects you want to focus on. Clarix sets up a personalised learning plan.",
  },
  {
    step: "02",
    title: "Learn with your AI tutor",
    description:
      "Chat with Clarix anytime. Ask questions, tackle quizzes, and get guided hints — all aligned to your curriculum.",
  },
  {
    step: "03",
    title: "Track and improve weekly",
    description:
      "See your progress across topics, celebrate achievements, and get focused recommendations for the next session.",
  },
];

const PRICING_PREVIEW = [
  {
    name: "Free",
    price: "$0",
    features: ["10 sessions/month", "1 subject", "Basic progress tracking"],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Student",
    price: "$19",
    features: ["Unlimited sessions", "All subjects", "Full progress tracking", "Quiz tools"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Family",
    price: "$35",
    features: ["Up to 4 children", "Parent dashboard", "Weekly email reports", "Priority support"],
    cta: "Start free trial",
    highlighted: false,
  },
];

export default function LandingPage() {
  function scrollToHowItWorks() {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 text-sm px-4 py-1.5 backdrop-blur-sm">
            AI tutoring for Australian students
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Build confidence from Year 1<br className="hidden sm:block" /> to Year 12 with Clarix.
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            A modern tutoring experience aligned to Australian curriculum outcomes, built for students and trusted by parents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-white/90 shadow-lg" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToHowItWorks}
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              See How It Works
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "50K+", label: "Students" },
              { value: "Year 1–12", label: "All year levels" },
              { value: "8 States", label: "All of Australia" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How Clarix Works
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Three simple steps to a smarter study routine.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative">
                <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 h-full">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white text-xl font-bold mb-5">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 bg-white/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything students need to thrive
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Purpose-built for Australian learners with the tools that actually make a difference.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="border-slate-100">
                <CardContent className="pt-6 flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                    <f.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Australian families
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border-slate-100">
                <CardContent className="pt-6">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 sm:px-6 bg-white/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 text-lg">
              Start free, upgrade when you&apos;re ready.{" "}
              <Link href="/pricing" className="text-teal-600 hover:underline font-medium">
                See full pricing →
              </Link>
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PREVIEW.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "border-teal-500 border-2 shadow-md relative"
                    : "border-slate-100"
                }
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                    <Badge className="bg-teal-600 text-white text-xs px-3">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-slate-900 mb-1">{plan.name}</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {plan.price}
                    <span className="text-sm font-normal text-slate-500">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6 mt-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center bg-teal-600 rounded-3xl py-16 px-8 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to help your student succeed?
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of Australian families who have already discovered a better way to learn.
          </p>
          <Button size="lg" className="bg-white text-teal-700 hover:bg-white/90" asChild>
            <Link href="/signup">
              Get started free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
