import { setDefaultResultOrder } from "dns";
setDefaultResultOrder("ipv4first");

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { application_id, company_name, job_title, notes } = await req.json();

  const prompt = `Write a professional cover letter for a ${job_title} position at ${company_name}.
${notes ? `Additional context: ${notes}` : ""}

The applicant is a fresh IT graduate from the Philippines with skills in Next.js, TypeScript, React, Laravel, Supabase, and Flutter. They have built real-world systems during their OJT internship including a Document Monitoring System, Queueing System, and Ticketing System.

Write a concise, genuine, confident cover letter (3 paragraphs). End with "Sincerely, [Your Name]" only.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    }),
    signal: AbortSignal.timeout(30000),
  });

  const data = await res.json();
  console.log("Groq response:", JSON.stringify(data, null, 2));

  const content = data.choices?.[0]?.message?.content ?? "Failed to generate.";

  if (content !== "Failed to generate.") {
    await supabase.from("cover_letters").insert({
      application_id,
      content,
    });
  }

  return NextResponse.json({ content });
}