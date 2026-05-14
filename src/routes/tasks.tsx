import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      { name: "description", content: "Break goals into prioritized, actionable plans." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  return (
    <div>
      <PageHeader eyebrow="Planning" title="AI Task Planner" description="Describe a goal — get a prioritized, time-boxed plan." />
      <AiTool
        tool="tasks"
        title="Plan"
        description="What are you trying to accomplish?"
        inputLabel="Your goal"
        inputPlaceholder="e.g. Launch a new landing page for our product within two weeks."
        cta="Generate plan"
        examples={[
          { label: "Product launch", prompt: "Launch a new SaaS feature in 3 weeks: design, build, QA, marketing, rollout." },
          { label: "Hire engineer", prompt: "Hire a senior backend engineer in 6 weeks." },
          { label: "Q4 OKRs", prompt: "Plan my Q4 OKRs as a product manager focused on retention and onboarding." },
        ]}
      />
    </div>
  );
}
