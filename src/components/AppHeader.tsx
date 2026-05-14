import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, Moon, Search, Settings, Sun, User as UserIcon, Sparkles } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { InstallAppButton } from "@/components/InstallAppButton";
import { supabase } from "@/integrations/supabase/client";
import { getAccount } from "@/lib/ai.functions";
import { toast } from "sonner";

type Notif = { id: string; title: string; body: string; read: boolean; time: string };

const SEED: Notif[] = [
  { id: "n1", title: "Welcome to Workplace AI 👋", body: "Your 14-day free trial has started.", read: false, time: "Just now" },
  { id: "n2", title: "Tip: Save your work", body: "Every AI generation is saved to your History automatically.", read: false, time: "1h ago" },
  { id: "n3", title: "New: Daily & weekly schedules", body: "Try the Task Planner to plan your week.", read: false, time: "Today" },
];

export function AppHeader() {
  const navigate = useNavigate();
  const { theme, setTheme, resolved } = useTheme();
  const fetchAccount = useServerFn(getAccount);
  const account = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount() });

  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const [search, setSearch] = useState("");
  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate({ to: "/history", search: { q } as never });
  };

  const [notifs, setNotifs] = useState<Notif[]>(SEED);
  const unread = notifs.filter((n) => !n.read).length;
  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));

  const onSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const profile = account.data?.profile;
  const name = profile?.display_name || email.split("@")[0] || "User";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md sm:px-4">
      <SidebarTrigger />

      <form onSubmit={onSubmitSearch} className="relative ml-1 hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your history…"
          className="pl-9"
        />
      </form>

      <div className="flex-1 md:hidden" />

      <InstallAppButton />

      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
        title={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
      >
        {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {unread}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-2 py-1.5">
            <DropdownMenuLabel className="px-0">Notifications</DropdownMenuLabel>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
            )}
          </div>
          <DropdownMenuSeparator />
          {notifs.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">You're all caught up.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifs.map((n) => (
                <div key={n.id} className={`px-3 py-2.5 text-sm ${!n.read ? "bg-accent/40" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{n.title}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                </div>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="ml-1 flex items-center gap-2 rounded-full p-0.5 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs font-semibold" style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}>
                {initials || <UserIcon className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm font-semibold" style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}>
                {initials || <UserIcon className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email || "—"}</p>
              {account.data?.subscription && (
                <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  {account.data.subscription.status === "trialing" ? "Free trial" : account.data.subscription.plan}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/account"><UserIcon className="mr-2 h-4 w-4" /> Account & plan</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link></DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {resolved === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {resolved === "dark" ? "Light mode" : "Dark mode"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onSignOut} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
