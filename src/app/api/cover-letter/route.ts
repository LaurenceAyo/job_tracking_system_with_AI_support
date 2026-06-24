import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { application_id, company_name, job_title, notes } = await req.json();

  const prompt = `Write a professional cover letter for a ${job_title} position at ${company_name}.
${notes ? `Additional context: ${notes}` : ""}

The applicant is a fresh IT graduate from the Philippines with skills in Next.js, TypeScript, React, Laravel, Supabase, and Flutter. They have built real-world systems during their OJT (internship).

Write a concise, genuine, confident cover letter (3 paragraphs). Do not include placeholders like [Your Name] — end with "Sincerely, [Your Name]" only.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();
  
  // Log the full response so we can see what Gemini returns
  console.log("Gemini response:", JSON.stringify(data, null, 2));

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Failed to generate.";

  if (content !== "Failed to generate.") {
    await supabase.from("cover_letters").insert({
      application_id,
      content,
    });
  }

  return NextResponse.json({ content });
}