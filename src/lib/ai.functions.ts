import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  tool: z.enum(["email", "meeting", "tasks", "research", "chat"]),
  prompt: z.string().min(1).max(10000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(10000) }))
    .max(40)
    .optional(),
});

const SYSTEM_PROMPTS: Record<string, string> = {
  email:
    "You are a professional workplace email writer. Generate a clear, concise, and polished email based on the user's brief. Output ONLY the email — include a subject line on the first line as 'Subject: ...', then a blank line, then the body. Use a tone appropriate to the context.",
  meeting:
    "You are an expert meeting notes summarizer. Given raw meeting notes or a transcript, produce a structured summary with these sections: 'TL;DR' (2-3 lines), 'Key Discussion Points' (bullets), 'Decisions' (bullets), 'Action Items' (bulleted list with owner and due date if mentioned). Use clean Markdown.",
  tasks:
    "You are an AI task planner. Break the user's goal into a prioritized, actionable plan. Output Markdown with sections: 'Goal', 'Plan' (numbered steps with estimated time), 'Today's Focus' (top 3), and 'Risks/Dependencies'. Be realistic and specific.",
  research:
    "You are an AI research assistant for working professionals. Given a topic or question, produce a structured briefing in Markdown: 'Summary' (3-5 lines), 'Key Concepts' (bullets), 'Considerations & Tradeoffs', 'Recommended Next Steps'. Cite reasoning, but note you cannot browse the live web — flag where the user should verify with current sources.",
  chat:
    "You are a helpful AI workplace assistant. Be concise, professional, and practical. Use Markdown formatting when helpful.",
};

export const generateAi = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const messages = [
      { role: "system", content: SYSTEM_PROMPTS[data.tool] },
      ...(data.history ?? []),
      { role: "user", content: data.prompt },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
      }),
    });

    if (res.status === 429) {
      throw new Error("Rate limit reached. Please wait a moment and try again.");
    }
    if (res.status === 402) {
      throw new Error("AI credits exhausted. Please add credits in Workspace settings.");
    }
    if (!res.ok) {
      const t = await res.text();
      console.error("AI gateway error", res.status, t);
      throw new Error("AI request failed. Please try again.");
    }

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });
