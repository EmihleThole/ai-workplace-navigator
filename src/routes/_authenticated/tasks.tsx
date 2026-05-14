import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({ meta: [{ title: "Task Planner — Workplace AI" }] }),
  component: () => (
    <div>
      <PageHeader
        eyebrow="Planning"
        title="AI Task Planner"
        description="Generate a prioritized daily or weekly schedule from your goals."
      />
      <AiTool
        tool="tasks"
        title="Plan your day or week"
        description="Describe what you need to get done. Mention if you want a daily or weekly schedule."
        inputLabel="Your goals & constraints"
        inputPlaceholder="e.g. Plan my week: ship the pricing page, prepare a board update, 3 customer calls, and 5 hours of focus time for deep work."
        cta="Generate plan"
        examples={[
          { label: "Daily schedule", prompt: "Build a DAILY schedule for tomorrow. Tasks: finish Q3 report (3h), 2 customer calls, review PR for checkout, gym at 6pm. Prioritize by impact and urgency." },
          { label: "Weekly schedule", prompt: "Build a WEEKLY plan (Mon-Fri). Goals: launch pricing page, run 3 user interviews, write blog post, hire 1 engineer. Show a day-by-day breakdown with priorities." },
          { label: "Project plan", prompt: "Plan the launch of a new feature in 3 weeks: marketing, engineering, support. Break into a weekly schedule with priorities." },
          { label: "Quarter goals", prompt: "Break down Q3 goals: grow MRR by 20%, ship 2 major features, hire 1 engineer. Give a weekly plan for the first month." },
        ]}
      />
    </div>
  ),
});
