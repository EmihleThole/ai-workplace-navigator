import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Copy, RotateCcw, Check, Save } from "lucide-react";
import { toast } from "sonner";
import { generateAi, updateGeneration } from "@/lib/ai.functions";

type Tool = "email" | "meetings" | "tasks" | "research";

interface AiToolProps {
  tool: Tool;
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  cta?: string;
  examples?: { label: string; prompt: string }[];
  /** When provided, loads this past generation as the initial state. */
  initial?: { id: string; input: string; output: string };
}

export function AiTool({ tool, title, description, inputLabel, inputPlaceholder, cta = "Generate", examples, initial }: AiToolProps) {
  const run = useServerFn(generateAi);
  const update = useServerFn(updateGeneration);
  const [prompt, setPrompt] = useState(initial?.input ?? "");
  const [output, setOutput] = useState(initial?.output ?? "");
  const [savedId, setSavedId] = useState<string | null>(initial?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (initial) {
      setPrompt(initial.input);
      setOutput(initial.output);
      setSavedId(initial.id);
      setDirty(false);
    }
  }, [initial]);

  const onRun = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter some input first.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { tool, prompt, save: true } });
      setOutput(res.content);
      setSavedId(res.savedId);
      setDirty(false);
      if (res.savedId) toast.success("Saved to your history");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const onSaveEdit = async () => {
    if (!savedId) return;
    setSavingEdit(true);
    try {
      await update({ data: { id: savedId, output } });
      setDirty(false);
      toast.success("Changes saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{inputLabel}</label>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={inputPlaceholder} rows={10} className="resize-y" />
          </div>
          {examples && examples.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button key={ex.label} type="button" onClick={() => setPrompt(ex.prompt)} className="rounded-full border bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-accent">
                  {ex.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={onRun} disabled={loading} className="flex-1">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : <><Sparkles className="mr-2 h-4 w-4" /> {cta}</>}
            </Button>
            {prompt && (
              <Button variant="outline" onClick={() => { setPrompt(""); setOutput(""); setSavedId(null); }} title="Clear">
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Output</CardTitle>
              <CardDescription>Editable — refine before using.</CardDescription>
            </div>
            <div className="flex gap-2">
              {savedId && dirty && (
                <Button size="sm" variant="default" onClick={onSaveEdit} disabled={savingEdit}>
                  {savingEdit ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Save className="mr-2 h-3.5 w-3.5" /> Save</>}
                </Button>
              )}
              {output && (
                <Button size="sm" variant="outline" onClick={onCopy}>
                  {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={output}
            onChange={(e) => { setOutput(e.target.value); setDirty(true); }}
            placeholder={loading ? "Thinking…" : "Your AI-generated result will appear here."}
            rows={18}
            className="resize-y font-mono text-sm leading-relaxed"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            AI-generated content may contain errors. Review and edit before sharing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
