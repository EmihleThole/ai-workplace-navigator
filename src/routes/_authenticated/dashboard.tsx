import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Mail, FileText, ListChecks, BookOpen, MessageSquare, ArrowRight, Sparkles, Clock, FileUser, FilePen } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccount, listGenerations } from "@/lib/ai.functions";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Workplace AI" }] }),
  component: Dashboard,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft polished emails in seconds." },
  { to: "/meetings", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn raw notes into TL;DRs and action items." },
  { to: "/tasks", icon: ListChecks, title: "AI Task Planner", desc: "Break goals into prioritized plans." },
  { to: "/research", icon: BookOpen, title: "AI Research Assistant", desc: "Get structured briefings on any topic." },
  { to: "/resume", icon: FileUser, title: "AI Resume Builder", desc: "Craft an ATS-friendly resume tailored to any role." },
  { to: "/cover-letter", icon: FilePen, title: "AI Cover Letter Generator", desc: "Generate tailored cover letters in seconds." },
  { to: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Conversational assistant for everyday questions." },
] as const;

function Dashboard() {
  const fetchAccount = useServerFn(getAccount);
  const fetchHistory = useServerFn(listGenerations);
  const account = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount() });
  const history = useQuery({ queryKey: ["history", "recent"], queryFn: () => fetchHistory({ data: {} }) });

  const sub = account.data?.subscription;
  const profile = account.data?.profile;
  const trialDaysLeft = sub?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(sub.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div>
      <div className="mb-10 overflow-hidden rounded-2xl border p-8 shadow-[var(--shadow-elegant)]" style={{ background: "var(--gradient-subtle)" }}>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Workplace AI
        </div>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">Pick a tool below or jump back into something you were working on.</p>
        {sub && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs">
            {sub.status === "trialing" ? (
              <><Clock className="h-3.5 w-3.5 text-primary" /> Free trial · {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} left ·{" "}
                <Link to="/account" className="font-semibold text-primary hover:underline">Choose a plan</Link></>
            ) : (
              <>Plan: <span className="font-semibold capitalize">{sub.plan}</span> · R{Number(sub.price_zar)}/mo</>
            )}
          </div>
        )}
      </div>

      <PageHeader eyebrow="Workspace" title="Your AI tools" description="All outputs are saved automatically and editable." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
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

      {history.data && history.data.generations.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <Link to="/history" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {history.data.generations.slice(0, 4).map((g) => (
              <Link key={g.id} to="/history" className="block rounded-lg border bg-card p-4 hover:shadow-[var(--shadow-elegant)]">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="capitalize">{g.tool}</span>
                  <span>{formatDistanceToNow(new Date(g.created_at), { addSuffix: true })}</span>
                </div>
                <p className="mt-1 line-clamp-1 font-medium">{g.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{g.output}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 rounded-xl border bg-muted/40 p-5">
        <h2 className="text-sm font-semibold">Responsible AI</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Generated outputs may be inaccurate, biased, or incomplete. Always review and edit AI content before using it in real workplace communications. Don't paste confidential or personally identifiable information into prompts.
        </p>
      </div>
    </div>
  );
}
