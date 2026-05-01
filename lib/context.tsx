"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { PersonaType, UserProfile } from "./types";
import { MOCK_STUDENT, MOCK_PARENT, MOCK_STUDENT_Y5 } from "./mock-data";

interface ClarixContextValue {
  currentUser: UserProfile;
  currentPersona: PersonaType;
  setPersona: (p: PersonaType) => void;
}

const ClarixContext = createContext<ClarixContextValue | null>(null);

function personaToUser(p: PersonaType): UserProfile {
  switch (p) {
    case "student-y10-nsw":
      return MOCK_STUDENT;
    case "parent-2-children":
      return MOCK_PARENT;
    case "student-y5-vic":
      return MOCK_STUDENT_Y5;
  }
}

export function ClarixProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clarix-persona") as PersonaType | null;
      if (stored) return stored;
    }
    return "student-y10-nsw";
  });

  const setPersona = useCallback((p: PersonaType) => {
    setCurrentPersona(p);
    localStorage.setItem("clarix-persona", p);
  }, []);

  return (
    <ClarixContext.Provider
      value={{
        currentUser: personaToUser(currentPersona),
        currentPersona,
        setPersona,
      }}
    >
      {children}
    </ClarixContext.Provider>
  );
}

export function useClarix() {
  const ctx = useContext(ClarixContext);
  if (!ctx) throw new Error("useClarix must be used within ClarixProvider");
  return ctx;
}
