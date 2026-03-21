'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { MorphemeConstructor } from "@/components/features/morpheme-constructor";
import { SentenceBuilder } from "@/components/features/sentence-builder";
import { InputRichPassage } from "@/components/features/input-rich-passage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Construction, Trophy, Sparkles, Eye } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { WORLDS } from '@/lib/lego-data';

export default function LearnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const worldId = searchParams.get('world') || 'names';
  const tab = searchParams.get('tab') || 'input';
  const missionType = searchParams.get('mission');
  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
                <BookOpen className="size-8 text-primary" />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 uppercase tracking-widest text-[9px]">
                        {world.title}
                    </Badge>
                    {missionType === 'rescue' && (
                        <Badge variant="destructive" className="uppercase tracking-widest text-[9px] animate-pulse">
                            Rescue Active
                        </Badge>
                    )}
                </div>
                <h1 className="font-heading text-4xl font-black tracking-tight">{world.title}</h1>
            </div>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
          {world.description} Follow the spiral: <strong>Read</strong> to notice patterns, <strong>Build</strong> to master morphology, then <strong>Challenge</strong> the Boss.
        </p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1 bg-muted rounded-xl">
          <TabsTrigger value="input" className="py-3 rounded-lg data-[state=active]:bg-background font-bold uppercase tracking-widest text-[10px]">
            <Eye className="size-4 mr-2 text-blue-500" />
            1. Input & Noticing
          </TabsTrigger>
          <TabsTrigger value="lego" className="py-3 rounded-lg data-[state=active]:bg-background font-bold uppercase tracking-widest text-[10px]">
            <Construction className="size-4 mr-2 text-basque-green" />
            2. Lego Builder
          </TabsTrigger>
          <TabsTrigger value="sentence" className="py-3 rounded-lg data-[state=active]:bg-background font-bold uppercase tracking-widest text-[10px]">
            <Trophy className="size-4 mr-2 text-yellow-600" />
            3. Boss Battle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="animate-in fade-in slide-in-from-left-4">
          <InputRichPassage worldId={worldId} />
        </TabsContent>

        <TabsContent value="lego" className="animate-in fade-in slide-in-from-bottom-4">
          <MorphemeConstructor />
        </TabsContent>

        <TabsContent value="sentence" className="animate-in fade-in slide-in-from-right-4">
          <div className="bg-primary/5 p-6 rounded-2xl mb-8 border border-primary/10 text-center">
            <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-widest text-sm mb-2">
                <Sparkles className="size-4" /> Mastery Gate Validation <Sparkles className="size-4" />
            </div>
            <p className="text-xs text-muted-foreground">Assemble 5 complex sentences with correct morphology to unlock the next World.</p>
          </div>
          <SentenceBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
