import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { buildQuizPrompt } from "@/lib/groq-prompts";
import type { Subject, QuestionType } from "@/lib/types";

export async function POST(req: NextRequest) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return Response.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
  }

  const body = await req.json();
  const { subject, topic, questionType, previousQuestions } = body as {
    subject: Subject;
    topic: string;
    questionType: QuestionType;
    previousQuestions: string[];
  };

  const prompt = buildQuizPrompt(subject, topic, questionType, previousQuestions);

  const groq = new Groq({ apiKey: key });

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 512,
    temperature: 0.8,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  let parsed;
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  } catch {
    return Response.json({ error: "Failed to parse quiz response." }, { status: 500 });
  }

  // Always enforce the requested type as per spec
  parsed.type = questionType;

  return Response.json({ question: parsed });
}
