
'use client';

import { useState } from 'react';
import { MorphemeConstructor } from "@/components/features/morpheme-constructor";
import { SentenceBuilder } from "@/components/features/sentence-builder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Layers } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-4xl font-bold">Construction Workshop</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Physicalize Basque grammar through morphological and syntactic puzzles.
        </p>
      </div>

      <Tabs defaultValue="word" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1 bg-muted rounded-xl">
          <TabsTrigger value="word" className="py-3 rounded-lg data-[state=active]:bg-background">
            <Layers className="size-4 mr-2" />
            Word Construction
          </TabsTrigger>
          <TabsTrigger value="sentence" className="py-3 rounded-lg data-[state=active]:bg-background">
            <BookOpen className="size-4 mr-2" />
            Sentence Scramble
          </TabsTrigger>
        </TabsList>

        <TabsContent value="word" className="animate-in fade-in slide-in-from-left-4">
          <MorphemeConstructor />
        </TabsContent>

        <TabsContent value="sentence" className="animate-in fade-in slide-in-from-right-4">
          <SentenceBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
