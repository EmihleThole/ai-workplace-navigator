import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { getAccount, updateSubscription } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account & Plan — Workplace AI" }] }),
  component: AccountPage,
});

const PLANS = [
  { id: "starter", name: "Starter", price: 80, features: ["All 5 AI tools", "Saved history", "Email support"] },
  { id: "pro", name: "Pro", price: 180, features: ["Everything in Starter", "Priority AI responses", "Longer context windows", "Priority support"] },
  { id: "business", name: "Business", price: 380, features: ["Everything in Pro", "Team workspaces (coming soon)", "Audit logs", "Dedicated success manager"] },
] as const;

function AccountPage() {
  const fetchAccount = useServerFn(getAccount);
  const update = useServerFn(updateSubscription);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount() });

  const sub = q.data?.subscription;
  const profile = q.data?.profile;
  const trialDaysLeft = sub?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(sub.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null;

  const choosePlan = async (plan: "starter" | "pro" | "business", price: number) => {
    try {
      await update({ data: { plan, price_zar: price } });
      qc.invalidateQueries({ queryKey: ["account"] });
      toast.success(`You're on the ${plan} plan — R${price}/month.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Account" title="Your account & plan" description="Manage your subscription and trial." />

      <Card className="mb-8 shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Signed in as {profile?.display_name ?? "—"}</CardDescription>
        </CardHeader>
        <CardContent>
          {sub ? (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs">
                {sub.status === "trialing" ? (
                  <><Clock className="h-3.5 w-3.5 text-primary" /> Free trial · {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} remaining</>
                ) : sub.status === "active" ? (
                  <>Active plan: <span className="font-semibold capitalize">{sub.plan}</span> · R{Number(sub.price_zar)}/mo</>
                ) : (
                  <>Status: {sub.status}</>
                )}
              </div>
            </div>
          ) : q.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        </CardContent>
      </Card>

      <h2 className="mb-4 text-lg font-semibold">Choose your plan</h2>
      <p className="mb-6 text-sm text-muted-foreground">All prices in South African Rand (ZAR). Plans grow as we add new features — start small, upgrade anytime.</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = sub?.plan === p.id && sub?.status === "active";
          const isPopular = p.id === "pro";
          return (
            <Card key={p.id} className={isPopular ? "border-primary ring-1 ring-primary shadow-[var(--shadow-glow)]" : ""}>
              <CardHeader>
                {isPopular && <span className="mb-1 w-fit rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">Most popular</span>}
                <CardTitle className="flex items-baseline gap-1">
                  <span>{p.name}</span>
                  <span className="ml-auto text-2xl font-bold">R{p.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> {f}</li>
                  ))}
                </ul>
                <Button className="w-full" disabled={isCurrent} variant={isPopular ? "default" : "outline"} onClick={() => choosePlan(p.id, p.price)}>
                  {isCurrent ? "Current plan" : `Choose ${p.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border bg-muted/40 p-5 text-xs text-muted-foreground">
        Note: payment processing in Rands will be enabled in the next step. For now, choosing a plan updates your account preference. We'll connect a secure payment provider (Stripe or Paddle) when you're ready.
      </div>
    </div>
  );
}
