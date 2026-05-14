import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, BookOpen, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft polished emails in seconds from a short brief." },
  { to: "/meetings", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn raw notes into TL;DRs, decisions and action items." },
  { to: "/tasks", icon: ListChecks, title: "AI Task Planner", desc: "Break goals into prioritized, actionable plans." },
  { to: "/research", icon: BookOpen, title: "AI Research Assistant", desc: "Get structured briefings on any topic, fast." },
  { to: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Conversational assistant for everyday work questions." },
] as const;

function Dashboard() {
  return (
    <div>
      <div
        className="mb-10 overflow-hidden rounded-2xl border p-8 shadow-[var(--shadow-elegant)]"
        style={{ background: "var(--gradient-subtle)" }}
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Workplace AI
        </div>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-foreground">
          Automate the busywork. Focus on what matters.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          A suite of AI-powered tools to draft, summarize, plan and research — built for working
          professionals who want to move faster without sacrificing quality.
        </p>
      </div>

      <PageHeader eyebrow="Workspace" title="Your AI tools" description="Pick a tool to get started. All outputs are editable." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
              <CardHeader>
                <div
                  className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <t.icon className="h-5 w-5" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {t.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-muted/40 p-5">
        <h2 className="text-sm font-semibold text-foreground">Responsible AI</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Generated outputs may be inaccurate, biased, or incomplete. Always review and edit AI
          content before using it in real workplace communications or decisions. Do not paste
          confidential or personally identifiable information into prompts.
        </p>
      </div>
    </div>
  );
}
