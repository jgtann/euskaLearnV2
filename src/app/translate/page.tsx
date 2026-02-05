import { TranslationTool } from "@/components/features/translation-tool";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages } from "lucide-react";

export default function TranslatePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl font-bold">AI-Powered Translanguaging</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Translate from English to Basque and get AI-powered explanations.
        </p>
      </div>
      
      <Card className="max-w-3xl mx-auto w-full">
         <CardHeader>
          <div className="flex items-center gap-4">
            <Languages className="size-8 text-primary" />
            <CardTitle>Translation & Explanation Engine</CardTitle>
          </div>
          <CardDescription>
            Enter an English sentence to see its Basque translation and a detailed breakdown of the grammatical differences.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <TranslationTool />
        </CardContent>
      </Card>

    </div>
  );
}
