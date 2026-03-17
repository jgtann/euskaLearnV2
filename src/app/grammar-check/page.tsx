import { GrammarChecker } from "@/components/features/grammar-checker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

export default function GrammarCheckPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <h1 className="font-heading text-4xl font-bold">Friction Analysis</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Check your Basque phrases and get corrections.
        </p>
      </div>
      
      <Card className="w-full">
         <CardHeader>
          <div className="flex items-center gap-4">
            <BrainCircuit className="size-8 text-primary" />
            <CardTitle>Grammar & Spelling Diagnostics</CardTitle>
          </div>
          <CardDescription>
            Not sure if your sentence is right? Paste it here and our AI will help you notice the patterns.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <GrammarChecker />
        </CardContent>
      </Card>
    </div>
  );
}
