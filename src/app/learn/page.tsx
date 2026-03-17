'use client';

import { MorphemeConstructor } from "@/components/features/morpheme-constructor";
import { SentenceBuilder } from "@/components/features/sentence-builder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Construction } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-4xl font-bold">Master Builder Workshop</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Snap together Basque grammar like Lego bricks to build your linguistic spaceship.
        </p>
      </div>

      <Tabs defaultValue="lego" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1 bg-muted rounded-xl">
          <TabsTrigger value="lego" className="py-3 rounded-lg data-[state=active]:bg-background">
            <Construction className="size-4 mr-2" />
            Lego Builder
          </TabsTrigger>
          <TabsTrigger value="sentence" className="py-3 rounded-lg data-[state=active]:bg-background">
            <BookOpen className="size-4 mr-2" />
            Sentence Scramble
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lego" className="animate-in fade-in slide-in-from-left-4">
          <MorphemeConstructor />
        </TabsContent>

        <TabsContent value="sentence" className="animate-in fade-in slide-in-from-right-4">
          <SentenceBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
