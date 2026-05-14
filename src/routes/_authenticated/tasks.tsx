import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({ meta: [{ title: "Task Planner — Workplace AI" }] }),
  component: () => (
    <div>
      <PageHeader eyebrow="Planning" title="AI Task Planner" description="Describe a goal — get a prioritized, actionable plan." />
      <AiTool
        tool="tasks"
        title="Plan"
        description="Describe what you want to achieve and any constraints."
        inputLabel="Your goal"
        inputPlaceholder="e.g. Launch a new pricing page in 2 weeks with 3 plans, copy, and Stripe checkout."
        cta="Build plan"
        examples={[
          { label: "Product launch", prompt: "Plan the launch of a new feature in 3 weeks: marketing, engineering, support." },
          { label: "Quarter goals", prompt: "Break down Q3 goals: grow MRR by 20%, ship 2 major features, hire 1 engineer." },
        ]}
      />
    </div>
  ),
});
