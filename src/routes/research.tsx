import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      { name: "description", content: "Get structured briefings on any workplace topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <div>
      <PageHeader eyebrow="Research" title="AI Research Assistant" description="Get a structured briefing on any topic or question." />
      <AiTool
        tool="research"
        title="Research"
        description="What do you want to learn about?"
        inputLabel="Topic or question"
        inputPlaceholder="e.g. Pros and cons of moving from REST to GraphQL for our internal API."
        cta="Run research"
        examples={[
          { label: "Compare tools", prompt: "Compare Notion, Confluence and Coda for a 50-person engineering team." },
          { label: "Market trend", prompt: "What's the state of vertical AI agents in 2025?" },
          { label: "Concept primer", prompt: "Explain CRDTs and where they're useful for collaborative apps." },
        ]}
      />
    </div>
  );
}
