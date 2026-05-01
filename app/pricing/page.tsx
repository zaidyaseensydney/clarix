"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TESTIMONIALS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "10 sessions per month",
      "1 subject",
      "Basic progress tracking",
      "AI tutor access",
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    id: "student",
    name: "Student",
    monthlyPrice: 19,
    yearlyPrice: 149,
    features: [
      "Unlimited sessions",
      "All 4 subjects",
      "Full progress tracking",
      "Quiz tools",
      "Achievement badges",
      "Weekly summaries",
    ],
    cta: "Start 7-day free trial",
    highlighted: true,
  },
  {
    id: "family",
    name: "Family",
    monthlyPrice: 35,
    yearlyPrice: 279,
    features: [
      "Everything in Student",
      "Up to 4 children",
      "Parent dashboard",
      "AI parent advisor",
      "Weekly email reports",
      "Priority support",
    ],
    cta: "Start 7-day free trial",
    highlighted: false,
  },
];

const FAQS = [
  {
    q: "Is there a free trial?",
    a: "Yes! Both the Student and Family plans include a 7-day free trial. No credit card required — you can explore all features before committing.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. There are no lock-in contracts. You can cancel your subscription at any time and continue to have access until the end of your billing period.",
  },
  {
    q: "What year levels do you support?",
    a: "Clarix supports all year levels from Year 1 through to Year 12, across all Australian states and territories. Content is aligned to the relevant state and federal curriculum outcomes.",
  },
  {
    q: "Is it aligned to the Australian curriculum?",
    a: "Yes. All content is mapped to the Australian Curriculum v9.0 and relevant state curriculum documents including NSW NESA, VIC VCAA, QLD, and more.",
  },
  {
    q: "Can I add more than 4 children?",
    a: "The Family plan currently supports up to 4 children. If you need more, please contact us at hello@clarix.com.au and we'll arrange a custom plan for your family.",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
            Start free. Upgrade when you&apos;re ready. No hidden fees.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                !yearly ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                yearly ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              Yearly
              <Badge variant="success" className="text-xs">Save ~35%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const period = yearly ? "/year" : "/month";

            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative",
                  plan.highlighted ? "border-teal-500 border-2 shadow-lg" : "border-slate-100"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                    <Badge className="bg-teal-600 text-white px-3">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="pt-8 pb-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h2>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-slate-400 text-sm">{period}</span>
                    )}
                    {yearly && plan.monthlyPrice > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        Billed annually (${Math.round(plan.yearlyPrice / 12)}/mo equivalent)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
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
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="bg-white rounded-xl border border-slate-100 px-2">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left px-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            What Australian families are saying
          </h2>
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
      </div>
    </div>
  );
}
