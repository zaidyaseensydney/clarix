import type { Subject } from "./types";

export const SUBJECTS: Subject[] = ["Maths", "English", "Science", "History"];

export const TOPICS: Record<Subject, string[]> = {
  Maths: [
    "Linear equations",
    "Fractions",
    "Algebra",
    "Geometry",
    "Statistics",
  ],
  English: [
    "Persuasive writing",
    "Text analysis",
    "Creative writing",
    "Grammar",
  ],
  Science: [
    "Cell structure",
    "Ecosystems",
    "Forces",
    "Chemistry basics",
  ],
  History: [
    "Federation",
    "Ancient civilisations",
    "World War 2",
    "Colonial Australia",
  ],
};

export const SYLLABUS_OUTCOMES: Record<Subject, Record<string, string>> = {
  Maths: {
    "Linear equations":
      "MA5-EQU-P-01: Solves linear equations and inequalities using algebraic techniques.",
    Fractions:
      "MA4-FRC-C-01: Compares and orders fractions and performs operations with fractions.",
    Algebra:
      "MA4-ALG-C-01: Generalises number properties to operate with algebraic expressions.",
    Geometry:
      "MA4-GEO-C-01: Classifies and constructs geometrical figures and applies properties.",
    Statistics:
      "MA4-DAT-C-01: Collects, represents and interprets data using statistical displays.",
  },
  English: {
    "Persuasive writing":
      "EN5-ECH-01: Crafts and presents persuasive texts to achieve a purpose for an audience.",
    "Text analysis":
      "EN5-RVL-01: Analyses and evaluates how language, context and purpose shape meaning.",
    "Creative writing":
      "EN5-CRE-01: Composes texts that draw on imagination, experience and ideas.",
    Grammar:
      "EN5-GRM-01: Understands and applies knowledge of language forms and features.",
  },
  Science: {
    "Cell structure":
      "SC4-LWS-01: Identifies that living things are composed of cells which carry out life processes.",
    Ecosystems:
      "SC4-ENV-01: Explains how interactions between organisms and their environment sustain ecosystems.",
    Forces:
      "SC4-FOR-01: Describes the effects of forces on objects and explains motion.",
    "Chemistry basics":
      "SC4-CHM-01: Identifies properties and changes of substances in terms of atoms and molecules.",
  },
  History: {
    Federation:
      "HT4-1: Describes the nature of historical sources and explains their value in the study of Australian Federation.",
    "Ancient civilisations":
      "HT4-2: Describes features of the ancient world and their significance for societies.",
    "World War 2":
      "HT5-2: Explains the causes and effects of significant events and developments in modern history.",
    "Colonial Australia":
      "HT4-3: Describes the experiences of men, women and children in colonial Australia.",
  },
};

export const SUBJECT_INTERESTS: Subject[] = [
  "Maths",
  "English",
  "Science",
  "History",
];
