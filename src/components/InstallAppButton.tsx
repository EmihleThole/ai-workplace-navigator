import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAppButton({ variant = "outline", size = "sm" }: { variant?: "outline" | "ghost" | "default"; size?: "sm" | "default" }) {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
    } else {
      setOpen(true);
    }
  };

  if (installed) return null;

  return (
    <>
      <Button variant={variant} size={size} onClick={handleClick}>
        <Download className="mr-1.5 h-3.5 w-3.5" />
        <span className="hidden sm:inline">Install app</span>
        <span className="sm:hidden">Install</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5" /> Install Workplace AI</DialogTitle>
            <DialogDescription>Get the app on your device for a faster, full-screen experience.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold">Desktop (Chrome / Edge)</p>
              <p className="text-muted-foreground">Click the install icon (⊕) in the address bar, or open the browser menu → "Install Workplace AI".</p>
            </div>
            <div>
              <p className="font-semibold">Android (Chrome)</p>
              <p className="text-muted-foreground">Tap the menu (⋮) → "Add to Home screen" or "Install app".</p>
            </div>
            <div>
              <p className="font-semibold">iPhone / iPad (Safari)</p>
              <p className="text-muted-foreground">Tap the Share button → "Add to Home Screen".</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
