import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      { name: "description", content: "Turn raw meeting notes into structured summaries." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  return (
    <div>
      <PageHeader eyebrow="Meetings" title="Meeting Notes Summarizer" description="Paste raw notes or a transcript — get a TL;DR, decisions and action items." />
      <AiTool
        tool="meeting"
        title="Summarize"
        description="Paste your raw meeting notes or transcript below."
        inputLabel="Meeting notes / transcript"
        inputPlaceholder="Paste raw notes here…"
        cta="Summarize meeting"
      />
    </div>
  );
}
