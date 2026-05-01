"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClarix } from "@/lib/context";
import type { PersonaType } from "@/lib/types";
import { cn } from "@/lib/utils";

const PERSONAS = [
  { id: "student-y10-nsw" as PersonaType, icon: "🎓", label: "Student Year 10 NSW", route: "/dashboard" },
  { id: "parent-2-children" as PersonaType, icon: "👨‍👩‍👧", label: "Parent (2 children)", route: "/parent" },
  { id: "student-y5-vic" as PersonaType, icon: "🧒", label: "Student Year 5 VIC", route: "/dashboard" },
  { id: null, icon: "👨‍🏫", label: "Teacher (coming soon)", route: null, disabled: true },
];

export function PersonaSwitcher() {
  const [open, setOpen] = useState(false);
  const { currentPersona, setPersona } = useClarix();
  const router = useRouter();

  function handleSelect(id: PersonaType, route: string) {
    setPersona(id);
    setOpen(false);
    router.push(route);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white border border-slate-200 shadow-lg rounded-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors min-h-[48px]"
      >
        <User className="h-4 w-4 text-teal-600" />
        <span>Persona</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Switch Persona</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {PERSONAS.map((p) => (
              <button
                key={p.label}
                disabled={"disabled" in p && p.disabled}
                onClick={() =>
                  p.id && p.route && handleSelect(p.id, p.route)
                }
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  p.id && currentPersona === p.id
                    ? "border-teal-500 bg-teal-50 text-teal-800"
                    : "border-slate-200 hover:border-teal-300 hover:bg-teal-50/50"
                )}
              >
                <span className="text-xl">{p.icon}</span>
                <span className="text-sm font-medium">{p.label}</span>
                {p.id && currentPersona === p.id && (
                  <span className="ml-auto text-xs text-teal-600 font-medium">Active</span>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
