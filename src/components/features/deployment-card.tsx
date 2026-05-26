import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CloudUpload, ShieldCheck, Sparkles } from "lucide-react";

export default function DeploymentCard() {
  return (
    <Card className="overflow-hidden border border-border">
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-center gap-3 text-primary">
          <CloudUpload className="h-6 w-6" />
          <CardTitle>Deployment & Hosting</CardTitle>
        </div>

        <CardDescription>
          Keep your Basque learning app production-ready with Firebase App Hosting.
          Deploy updates safely, preview changes, and ensure fast global access for
          learners.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 px-6 pb-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl bg-muted p-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Production Ready
          </div>

          <p className="text-sm text-muted-foreground">
            Deploy your latest learning experience to your live Firebase App Hosting
            site with a single command.
          </p>

          <div className="rounded-xl bg-background p-3 text-sm font-mono text-foreground shadow-sm">
            npx -y firebase-tools@latest deploy
          </div>
        </div>

        <div className="space-y-3 rounded-2xl bg-muted p-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            Preview Channel
          </div>

          <p className="text-sm text-muted-foreground">
            Test changes before going live by deploying to a preview channel. Share
            the preview link with collaborators or learners.
          </p>

          <div className="rounded-xl bg-background p-3 text-sm font-mono text-foreground shadow-sm">
            npx -y firebase-tools@latest hosting:channel:deploy preview --expires 1d
          </div>
        </div>
      </CardContent>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Learn more in your project README or Firebase console.
        </p>

        <Button asChild size="sm">
          <a href="/README.md">Open Deployment Docs</a>
        </Button>
      </div>
    </Card>
  );
}