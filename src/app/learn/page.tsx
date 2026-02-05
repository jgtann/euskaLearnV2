import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MorphemeConstructor } from "@/components/features/morpheme-constructor";

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-4xl font-bold">Morpheme Crafting</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Combine tiles to construct Basque words and phrases.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity: Construct a Word</CardTitle>
          <CardDescription>
            Use the morpheme tiles below to correctly form the word for "the dog (subject)".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MorphemeConstructor />
        </CardContent>
      </Card>
    </div>
  );
}
