import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/_authenticated/research")({
  head: () => ({ meta: [{ title: "Research Assistant — Workplace AI" }] }),
  component: () => (
    <div>
      <PageHeader eyebrow="Research" title="AI Research Assistant" description="Get a structured briefing on any topic." />
      <AiTool
        tool="research"
        title="Research"
        description="Ask a question or paste a topic to research."
        inputLabel="Topic or question"
        inputPlaceholder="e.g. What are the trade-offs between PostgreSQL and DynamoDB for a SaaS app?"
        cta="Research"
      />
    </div>
  ),
});
