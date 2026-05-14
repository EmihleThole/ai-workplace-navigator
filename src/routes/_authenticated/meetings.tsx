import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/_authenticated/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — Workplace AI" }] }),
  component: () => (
    <div>
      <PageHeader eyebrow="Meetings" title="Meeting Notes Summarizer" description="Paste raw notes or a transcript — get a clean summary with action items." />
      <AiTool
        tool="meetings"
        title="Summarize"
        description="Drop in messy notes or transcript text below."
        inputLabel="Raw notes / transcript"
        inputPlaceholder="Paste meeting notes or transcript here..."
        cta="Summarize"
      />
    </div>
  ),
});
