import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, BookOpen, MessageSquare, Sparkles, Check, ShieldCheck, ArrowRight, FileUser, FilePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";
import teamImg from "@/assets/team.jpg";
import workImg from "@/assets/work.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace AI — AI productivity for South African professionals" },
      { name: "description", content: "Draft emails, summarise meetings, plan tasks and research instantly. 14-day free trial. From R80/month." },
    ],
  }),
  component: Landing,
});

const tools = [
  { icon: Mail, title: "Smart Emails", desc: "Draft polished emails in seconds." },
  { icon: FileText, title: "Meeting Notes", desc: "Turn raw notes into action items." },
  { icon: ListChecks, title: "Task Planner", desc: "Break goals into clear plans." },
  { icon: BookOpen, title: "Research", desc: "Structured briefings on any topic." },
  { icon: FileUser, title: "Resume Builder", desc: "ATS-friendly resumes tailored to any role." },
  { icon: FilePen, title: "Cover Letters", desc: "Tailored cover letters in seconds." },
  { icon: MessageSquare, title: "AI Chat", desc: "Conversational workplace help." },
];

const plans = [
  { name: "Starter", price: 80, blurb: "Solo professionals getting started.", features: ["All 5 AI tools", "Saved history", "Email support"], cta: "Start free trial", highlight: false },
  { name: "Pro", price: 180, blurb: "Power users who ship more every day.", features: ["Everything in Starter", "Priority AI responses", "Longer context windows", "Priority support"], cta: "Start free trial", highlight: true },
  { name: "Business", price: 380, blurb: "Small teams collaborating at scale.", features: ["Everything in Pro", "Team workspaces (coming soon)", "Audit logs", "Dedicated success manager"], cta: "Start free trial", highlight: false },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold">Workplace AI</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/signup"><Button size="sm">Start free</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-subtle)" }} />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Built for South African teams
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Automate the busywork.<br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
                Focus on real work.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Workplace AI drafts emails, summarises meetings, plans tasks and answers research questions — so you spend less time typing and more time deciding.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg" className="h-12 px-6">Start 14-day free trial <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <a href="#pricing"><Button size="lg" variant="outline" className="h-12 px-6">View pricing</Button></a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No credit card required · From R80/month after trial</p>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Workplace AI dashboard preview" width={1536} height={1024} className="rounded-2xl border shadow-[var(--shadow-elegant)]" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Five AI tools, one workspace</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to move faster</h2>
          <p className="mt-4 text-muted-foreground">Each tool is purpose-built with structured prompts. All outputs are editable so you stay in control.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <div key={t.title} className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-elegant)]">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Image band */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="overflow-hidden rounded-2xl border">
          <img src={teamImg} alt="Team collaborating with Workplace AI" width={1280} height={896} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold tracking-tight">Built for the way you actually work</h2>
          <p className="mt-4 text-muted-foreground">Whether you're a solo consultant or a growing team, Workplace AI saves you hours every week. Your generations are saved automatically — come back anytime to review or refine.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Saved history of every AI output you generate", "Editable results — refine anything in place", "Secure sign-in with email or Google", "Responsible AI disclaimers built in"].map((f) => (
              <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> {f}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Simple pricing in Rands</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Start free. Upgrade as you grow.</h2>
            <p className="mt-4 text-muted-foreground">Every plan starts with a 14-day free trial. Plans scale as we add more features.</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`flex flex-col rounded-2xl border bg-card p-8 ${p.highlight ? "ring-2 ring-primary shadow-[var(--shadow-glow)]" : ""}`}>
                {p.highlight && <span className="mb-3 w-fit rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Most popular</span>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.blurb}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">R{p.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 flex-1 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> {f}</li>
                  ))}
                </ul>
                <Link to="/signup" className="mt-8">
                  <Button className="w-full" variant={p.highlight ? "default" : "outline"}>{p.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-wider">Security & responsible AI</p>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Your data stays yours</h2>
          <p className="mt-4 text-muted-foreground">All sign-ins are protected by industry-standard encryption with leaked-password checks. Your generations are stored securely and only visible to you. Outputs are AI-generated — always review before sending or acting on them.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border order-1 lg:order-2">
          <img src={workImg} alt="Person working productively with Workplace AI" width={1280} height={896} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-10 space-y-6">
            {[
              { q: "How long is the free trial?", a: "Every account starts with a 14-day free trial — no credit card required." },
              { q: "What happens after the trial?", a: "You can choose any plan starting from R80/month. If you don't upgrade, your account simply pauses until you do." },
              { q: "Can I edit AI outputs?", a: "Yes — every output is fully editable in place, and your changes are saved to your history." },
              { q: "Is my data secure?", a: "Sign-in uses encrypted sessions and leaked-password protection. Your generations are stored privately and only you can read them." },
            ].map((f) => (
              <div key={f.q} className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to reclaim your week?</h2>
        <p className="mt-4 text-muted-foreground">Join professionals using AI to draft, summarise and plan in seconds.</p>
        <Link to="/signup" className="mt-8 inline-block">
          <Button size="lg" className="h-12 px-8">Start your free trial <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold">Workplace AI</span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">AI-powered productivity tools for working professionals. Built with care in South Africa.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Account</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
                <li><Link to="/signup" className="hover:text-foreground">Create account</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Workplace AI. All rights reserved.</p>
            <p>AI outputs may be inaccurate — always review before use.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
