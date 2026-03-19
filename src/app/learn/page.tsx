
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { MorphemeConstructor } from "@/components/features/morpheme-constructor";
import { SentenceBuilder } from "@/components/features/sentence-builder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Construction, Trophy, Sparkles } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { WORLDS } from '@/lib/lego-data';

export default function LearnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const worldId = searchParams.get('world') || 'names';
  const tab = searchParams.get('tab') || 'lego';
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
                <Construction className="size-8 text-primary" />
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
                <h1 className="font-heading text-4xl font-black tracking-tight">{worldId === 'names' ? 'Master Builder Workshop' : world.title}</h1>
            </div>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
          {world.description} Practice with the "Lego" bricks below, then face the <strong>Boss Battle</strong> to advance.
        </p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1 bg-muted rounded-xl">
          <TabsTrigger value="lego" className="py-3 rounded-lg data-[state=active]:bg-background font-bold uppercase tracking-widest text-xs">
            <Construction className="size-4 mr-2" />
            Lego Builder
          </TabsTrigger>
          <TabsTrigger value="sentence" className="py-3 rounded-lg data-[state=active]:bg-background font-bold uppercase tracking-widest text-xs">
            <Trophy className="size-4 mr-2 text-yellow-600" />
            Boss Battle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lego" className="animate-in fade-in slide-in-from-left-4">
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
