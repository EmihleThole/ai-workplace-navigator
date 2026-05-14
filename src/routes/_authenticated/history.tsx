import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Save, Loader2, Mail, FileText, ListChecks, BookOpen, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { listGenerations, updateGeneration, deleteGeneration } from "@/lib/ai.functions";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "History — Workplace AI" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  component: HistoryPage,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail, meetings: FileText, tasks: ListChecks, research: BookOpen, chat: MessageSquare,
};

type Tool = "email" | "meetings" | "tasks" | "research" | "chat";

function HistoryPage() {
  const { q: searchQuery } = Route.useSearch();
  const [filter, setFilter] = useState<"all" | Tool>("all");
  const [search, setSearch] = useState(searchQuery ?? "");
  const fetchHistory = useServerFn(listGenerations);
  const update = useServerFn(updateGeneration);
  const remove = useServerFn(deleteGeneration);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["history", filter],
    queryFn: () => fetchHistory({ data: filter === "all" ? {} : { tool: filter } }),
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync search box with URL ?q= when it changes (e.g. from header search)
  useEffect(() => { setSearch(searchQuery ?? ""); }, [searchQuery]);

  const allItems = q.data?.generations ?? [];
  const items = search.trim()
    ? allItems.filter((g) => {
        const s = search.toLowerCase();
        return (g.title ?? "").toLowerCase().includes(s) || g.input.toLowerCase().includes(s) || g.output.toLowerCase().includes(s);
      })
    : allItems;
  const active = items.find((g) => g.id === activeId) ?? items[0];

  const startEdit = (id: string, output: string) => {
    setActiveId(id);
    setDraft(output);
  };

  const save = async () => {
    if (!active) return;
    setSaving(true);
    try {
      await update({ data: { id: active.id, output: draft } });
      qc.invalidateQueries({ queryKey: ["history"] });
      toast.success("Saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this entry permanently?")) return;
    try {
      await remove({ data: { id } });
      if (activeId === id) setActiveId(null);
      qc.invalidateQueries({ queryKey: ["history"] });
      toast.success("Deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Saved" title="Your AI history" description="Every generation is saved here. Click any item to read or edit it." />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
      </Tabs>

      {q.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-sm text-muted-foreground">No generations yet. Try one of the tools to get started.</CardContent></Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-2">
            {items.map((g) => {
              const Icon = ICONS[g.tool] ?? FileText;
              return (
                <button
                  key={g.id}
                  onClick={() => startEdit(g.id, g.output)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${active?.id === g.id ? "border-primary bg-accent/50" : "bg-card hover:bg-accent/30"}`}
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /> <span className="capitalize">{g.tool}</span></span>
                    <span>{formatDistanceToNow(new Date(g.created_at), { addSuffix: true })}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm font-medium">{g.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{g.output}</p>
                </button>
              );
            })}
          </div>

          {active && (
            <Card className="shadow-[var(--shadow-elegant)]">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-primary">{active.tool}</p>
                    <h2 className="mt-1 text-lg font-semibold">{active.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(active.created_at), { addSuffix: true })}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(active.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mb-3 rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Original prompt</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{active.input}</p>
                </div>
                <label className="text-sm font-medium">Output (editable)</label>
                <Textarea
                  value={activeId === active.id ? draft : active.output}
                  onChange={(e) => { setActiveId(active.id); setDraft(e.target.value); }}
                  rows={20}
                  className="mt-2 font-mono text-sm"
                />
                <div className="mt-3 flex justify-end">
                  <Button onClick={save} disabled={saving || activeId !== active.id || draft === active.output}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save changes</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
