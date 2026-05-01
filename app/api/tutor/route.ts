import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";
import { buildTutorSystemPrompt, buildParentSystemPrompt } from "@/lib/groq-prompts";
import type { Subject } from "@/lib/types";

export async function POST(req: NextRequest) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return Response.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
  }

  const body = await req.json();
  const { messages, mode, subject, topic, parentContext } = body as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    mode: "student" | "parent";
    subject?: Subject;
    topic?: string;
    parentContext?: {
      childName: string;
      yearLevel: number;
      state: string;
      strongSubject: string;
      strongPct: number;
      weakSubject: string;
      weakPct: number;
      recentTopics: string;
      weakAreas: string;
      streak: number;
      weeklyHours: string;
    };
  };

  // Enrich system prompt with real session data where available
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let systemPrompt: string;

  if (mode === "parent" && parentContext) {
    // If user is logged in as parent, we can trust the parentContext they sent
    systemPrompt = buildParentSystemPrompt(parentContext);
  } else {
    // Student mode: use real profile data to personalise the prompt
    let studentName: string | undefined;
    let yearLevel: number | undefined;
    let state: string | undefined;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, year_level, state")
        .eq("id", user.id)
        .single();

      if (profile) {
        studentName = profile.full_name?.split(" ")[0];
        yearLevel = profile.year_level;
        state = profile.state;
      }
    }

    systemPrompt = buildTutorSystemPrompt(
      subject ?? "Maths",
      topic ?? "General",
      studentName,
      yearLevel,
      state
    );
  }

  const groq = new Groq({ apiKey: key });

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_tokens: 1024,
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content ?? "";
  return Response.json({ reply });
}
