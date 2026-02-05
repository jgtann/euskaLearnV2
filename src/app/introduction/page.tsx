import { IntroductionBuilder } from "@/components/features/introduction-builder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function IntroductionPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-4xl font-bold">Self-Introduction Builder</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Craft your personal introduction in Basque with AI assistance.
        </p>
      </div>
      
      <Card className="max-w-3xl mx-auto w-full">
         <CardHeader>
          <div className="flex items-center gap-4">
            <User className="size-8 text-primary" />
            <CardTitle>Introduction Crafting Tool</CardTitle>
          </div>
          <CardDescription>
            Fill in your details, and our AI will help you create a natural-sounding introduction in Basque, complete with explanations.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <IntroductionBuilder />
        </CardContent>
      </Card>
    </div>
  );
}
