import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { buildEvaluatePrompt } from "@/lib/groq-prompts";
import type { Subject, QuestionType } from "@/lib/types";

export async function POST(req: NextRequest) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return Response.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
  }

  const body = await req.json();
  const { subject, topic, question, userAnswer, questionType } = body as {
    subject: Subject;
    topic: string;
    question: string;
    userAnswer: string;
    questionType: QuestionType;
  };

  const prompt = buildEvaluatePrompt(subject, topic, question, userAnswer, questionType);

  const groq = new Groq({ apiKey: key });

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 256,
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  let parsed;
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { correct: false, feedback: "Unable to evaluate." };
  } catch {
    parsed = { correct: false, feedback: "Unable to evaluate answer." };
  }

  return Response.json(parsed);
}
