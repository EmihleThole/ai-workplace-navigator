import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Tool = z.enum(["email", "meetings", "tasks", "research", "chat", "resume", "cover_letter"]);

const InputSchema = z.object({
  tool: Tool,
  prompt: z.string().min(1).max(10000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(10000) }))
    .max(40)
    .optional(),
  save: z.boolean().optional(),
  title: z.string().max(200).optional(),
});

const SYSTEM_PROMPTS: Record<string, string> = {
  email:
    "You are a professional workplace email writer. Generate a clear, concise, and polished email based on the user's brief. Output ONLY the email — include a subject line on the first line as 'Subject: ...', then a blank line, then the body.",
  meetings:
    "You are an expert meeting notes summarizer. Given raw meeting notes or a transcript, produce a structured summary in Markdown with these sections: 'TL;DR' (2-3 lines), 'Key Discussion Points' (bullets), 'Decisions' (bullets), 'Action Items' (with owner and due date if mentioned).",
  tasks:
    "You are an AI task planner for working professionals. Generate clear, prioritized DAILY or WEEKLY schedules. If the user asks for a daily plan, output Markdown with: 'Today's Schedule' (a time-blocked table or list from morning to evening), 'Top 3 Priorities' (P1/P2/P3), 'Quick Wins', 'Risks/Dependencies'. If the user asks for a weekly plan, output Markdown with: 'Weekly Goals', 'Day-by-Day Plan' (Mon–Fri sections with prioritized tasks), 'Top 3 Priorities for the Week', and 'Risks/Dependencies'. Always rank tasks by impact and urgency, give realistic time estimates, and keep the plan focused and actionable. Use Markdown headings, bullet lists, and tables where helpful.",
  research:
    "You are an AI research assistant for working professionals. Produce a Markdown briefing: 'Summary' (3-5 lines), 'Key Concepts', 'Considerations & Tradeoffs', 'Recommended Next Steps'. Note you cannot browse the live web — flag where the user should verify with current sources.",
  chat:
    "You are a helpful AI workplace assistant. Be concise, professional, and practical. Use Markdown when helpful.",
  resume:
    "You are an expert resume writer. From the user's brief (career details, skills, target role), produce a polished, ATS-friendly resume in PLAIN TEXT ONLY. Strict formatting rules: do NOT use Markdown. Do NOT use #, *, -, _, backticks, or any bold/italic syntax. Do NOT use bullet symbols of any kind (no -, *, •, –). Use simple professional formatting only: SECTION HEADINGS in ALL CAPS on their own line, a blank line between sections, and plain sentences or short lines for items (one per line, no leading symbol). Include these sections in order: CONTACT (if details provided), SUMMARY (3-4 lines), CORE SKILLS (comma-separated or short lines, grouped by category with a category label followed by a colon), PROFESSIONAL EXPERIENCE (for each role: 'Job Title, Company — Dates' on one line, then 3-5 short impact lines underneath using strong action verbs and quantified results where possible, no bullet symbols), EDUCATION, and CERTIFICATIONS (if applicable). Keep tone confident and concise. Tailor wording to the target role if specified. Output only the resume text — no preamble, no commentary, no Markdown.",
  cover_letter:
    "You are an expert cover letter writer. From the user's brief (role, company, key strengths, optional job description), produce a tailored, professional cover letter. Output ONLY the letter: a date line, recipient/company line, greeting, 3-4 focused body paragraphs (hook, relevant achievements with quantified impact, why this company, closing call-to-action), and a sign-off. Keep it under one page, confident, specific, and free of clichés.",
};

export const generateAi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const messages = [
      { role: "system", content: SYSTEM_PROMPTS[data.tool] },
      ...(data.history ?? []),
      { role: "user", content: data.prompt },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Workspace settings.");
    if (!res.ok) {
      const t = await res.text();
      console.error("AI gateway error", res.status, t);
      throw new Error("AI request failed. Please try again.");
    }

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";

    let savedId: string | null = null;
    if (data.save && content) {
      const { data: row, error } = await context.supabase
        .from("generations")
        .insert({
          user_id: context.userId,
          tool: data.tool,
          title: data.title ?? data.prompt.slice(0, 80),
          input: data.prompt,
          output: content,
        })
        .select("id")
        .single();
      if (error) console.error("save generation error", error);
      else savedId = row.id;
    }

    return { content, savedId };
  });

export const listGenerations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ tool: Tool.optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("generations")
      .select("id, tool, title, input, output, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data.tool) q = q.eq("tool", data.tool);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { generations: rows ?? [] };
  });

export const updateGeneration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      output: z.string().max(50000).optional(),
      title: z.string().max(200).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase
      .from("generations")
      .update(patch)
      .eq("id", id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteGeneration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("generations")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [profile, sub] = await Promise.all([
      context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
      context.supabase.from("subscriptions").select("*").eq("user_id", context.userId).maybeSingle(),
    ]);
    return { profile: profile.data, subscription: sub.data };
  });

export const updateSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      plan: z.enum(["starter", "pro", "business"]),
      price_zar: z.number().min(80).max(10000),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("subscriptions")
      .update({ plan: data.plan, price_zar: data.price_zar, status: "active" })
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
