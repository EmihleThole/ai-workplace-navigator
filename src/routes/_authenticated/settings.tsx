import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Monitor, Moon, Sun, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/ThemeProvider";
import { getAccount } from "@/lib/ai.functions";
import { InstallAppButton } from "@/components/InstallAppButton";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Workplace AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const fetchAccount = useServerFn(getAccount);
  const qc = useQueryClient();
  const account = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount() });

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwd, setPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const [emailNotif, setEmailNotif] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [aiTips, setAiTips] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);
  useEffect(() => {
    if (account.data?.profile?.display_name) setName(account.data.profile.display_name);
  }, [account.data]);
  useEffect(() => {
    const raw = localStorage.getItem("notif-prefs");
    if (raw) {
      try {
        const p = JSON.parse(raw);
        setEmailNotif(p.email ?? true);
        setProductUpdates(p.product ?? true);
        setAiTips(p.tips ?? false);
      } catch {/* ignore */}
    }
  }, []);

  const saveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({ display_name: name }).eq("id", (await supabase.auth.getUser()).data.user!.id);
    setSavingProfile(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["account"] });
    }
  };

  const updatePassword = async () => {
    if (pwd.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSavingPwd(false);
    if (error) toast.error(error.message);
    else { toast.success("Password updated"); setPwd(""); }
  };

  const saveNotifs = (next: { email?: boolean; product?: boolean; tips?: boolean }) => {
    const merged = { email: emailNotif, product: productUpdates, tips: aiTips, ...next };
    localStorage.setItem("notif-prefs", JSON.stringify(merged));
    if (next.email !== undefined) setEmailNotif(next.email);
    if (next.product !== undefined) setProductUpdates(next.product);
    if (next.tips !== undefined) setAiTips(next.tips);
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Preferences" title="Settings" description="Manage your profile, security, appearance and notifications." />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled />
              <p className="text-[11px] text-muted-foreground">Email is your sign-in identifier and can't be changed here.</p>
            </div>
          </div>
          <Button onClick={saveProfile} disabled={savingProfile || !name.trim()}>
            {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save profile"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Switch between light and dark mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(v) => setTheme(v as "light" | "dark" | "system")} className="grid gap-3 sm:grid-cols-3">
            {([
              { v: "light", label: "Light", icon: Sun },
              { v: "dark", label: "Dark", icon: Moon },
              { v: "system", label: "System", icon: Monitor },
            ] as const).map((opt) => (
              <Label key={opt.v} htmlFor={`theme-${opt.v}`} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${theme === opt.v ? "border-primary bg-accent/40" : "hover:bg-accent/30"}`}>
                <RadioGroupItem id={`theme-${opt.v}`} value={opt.v} />
                <opt.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{opt.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your account password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="pwd">New password</Label>
            <Input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="At least 8 characters" maxLength={72} />
            <p className="text-[11px] text-muted-foreground">Checked against known leaked passwords for your safety.</p>
          </div>
          <Button onClick={updatePassword} disabled={savingPwd || !pwd}>
            {savingPwd ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Decide what we let you know about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row label="In-app & email notifications" desc="Important account and billing updates." checked={emailNotif} onChange={(v) => saveNotifs({ email: v })} />
          <Row label="Product updates" desc="New features and improvements." checked={productUpdates} onChange={(v) => saveNotifs({ product: v })} />
          <Row label="AI tips & best practices" desc="Occasional tips to get more out of the assistant." checked={aiTips} onChange={(v) => saveNotifs({ tips: v })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Download className="h-4 w-4" /> Install the app</CardTitle>
          <CardDescription>Install Workplace AI on your phone, tablet or desktop for a faster, full-screen experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <InstallAppButton variant="default" size="default" />
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Responsible AI</CardTitle>
          <CardDescription>Use the assistant safely.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>AI-generated content can be inaccurate, biased, or out of date. Always review and edit outputs before using them in real workplace communications.</p>
          <p>Don't paste confidential information, personal identifiers, passwords, or client data into prompts. You are responsible for how AI outputs are used.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
