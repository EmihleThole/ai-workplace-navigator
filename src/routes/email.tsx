import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      { name: "description", content: "Generate professional emails from a short brief." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <div>
      <PageHeader eyebrow="Communication" title="Smart Email Generator" description="Describe what you need to say. We'll draft a polished email." />
      <AiTool
        tool="email"
        title="Compose"
        description="Briefly describe the email — recipient, purpose, tone, key points."
        inputLabel="What's the email about?"
        inputPlaceholder="e.g. Reply to a client postponing our Friday meeting to next Tuesday at 2pm. Apologetic but professional."
        cta="Draft email"
        examples={[
          { label: "Follow-up", prompt: "Polite follow-up to a client who hasn't responded to my proposal in 5 days." },
          { label: "Decline meeting", prompt: "Decline a meeting request for Thursday at 3pm — propose Friday morning instead." },
          { label: "Project update", prompt: "Weekly project update to my manager: shipped feature X, blocked on Y, plan for next week." },
        ]}
      />
    </div>
  );
}
