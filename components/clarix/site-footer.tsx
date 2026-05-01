"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function SiteFooter() {
  const [modal, setModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <>
      <footer className="border-t border-slate-200 bg-white/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-teal-600">Clarix</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs">
                AI-powered tutoring aligned to the Australian curriculum. Helping students from Year 1 to Year 12 build confidence and achieve their best.
              </p>
              <p className="text-sm text-teal-600 mt-3">hello@clarix.com.au</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Platform</h4>
              <ul className="space-y-2">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/tutor", label: "AI Tutor" },
                  { href: "/progress", label: "Progress" },
                  { href: "/parent", label: "Parent Dashboard" },
                  { href: "/pricing", label: "Pricing" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-500 hover:text-teal-600 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setModal("privacy")}
                    className="text-sm text-slate-500 hover:text-teal-600 transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModal("terms")}
                    className="text-sm text-slate-500 hover:text-teal-600 transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-slate-400">
              © 2026 Clarix Pty Ltd. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              Australian curriculum content © ACARA
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Dialog open={modal === "privacy"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>Last updated: 1 May 2026</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-slate-600">
            <p>Clarix Pty Ltd (&quot;Clarix&quot;, &quot;we&quot;, &quot;us&quot;) is committed to protecting your personal information in accordance with the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs).</p>
            <h3 className="font-semibold text-slate-900">Information We Collect</h3>
            <p>We collect information you provide when creating an account, including name, email address, year level, and Australian state. For students under 18, parental consent is required.</p>
            <h3 className="font-semibold text-slate-900">How We Use Your Information</h3>
            <p>Your information is used to provide personalised tutoring, track academic progress, and send relevant educational insights to parents. We do not sell your personal information to third parties.</p>
            <h3 className="font-semibold text-slate-900">Data Security</h3>
            <p>We use industry-standard encryption and security practices. Your data is stored securely in Australian data centres.</p>
            <h3 className="font-semibold text-slate-900">Contact Us</h3>
            <p>For privacy-related enquiries, contact hello@clarix.com.au</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Modal */}
      <Dialog open={modal === "terms"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>Last updated: 1 May 2026</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-slate-600">
            <p>By using Clarix, you agree to these Terms of Service. Please read them carefully.</p>
            <h3 className="font-semibold text-slate-900">Acceptable Use</h3>
            <p>Clarix is designed for educational purposes. You agree not to misuse the platform, share inappropriate content, or attempt to circumvent our AI content moderation.</p>
            <h3 className="font-semibold text-slate-900">Subscription and Billing</h3>
            <p>Free accounts are limited to 10 sessions per month. Paid plans are billed monthly or annually. You may cancel at any time, and your access continues until the end of the billing period.</p>
            <h3 className="font-semibold text-slate-900">Intellectual Property</h3>
            <p>All Clarix content, including AI responses and curriculum materials, remains the property of Clarix Pty Ltd. Student-generated content remains yours.</p>
            <h3 className="font-semibold text-slate-900">Limitation of Liability</h3>
            <p>Clarix provides educational support only and is not a substitute for qualified teaching professionals. We are not liable for academic outcomes.</p>
            <h3 className="font-semibold text-slate-900">Contact</h3>
            <p>Questions about these terms? Email hello@clarix.com.au</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
