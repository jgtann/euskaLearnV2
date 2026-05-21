'use client';

import { useState, useEffect, useTransition } from 'react';
import { getPassageAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, BookOpen, Eye, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PlayAudioButton } from '@/components/features/play-audio-button';
import { AnimatedText } from '@/components/features/animated-text';

interface InputRichPassageProps {
  worldId: string;
}

function PassageAudioHeader({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | undefined>();
  return (
     <div className="flex items-start gap-4">
       <div className="text-2xl font-serif leading-relaxed text-basque-earth tracking-tight">
          <AnimatedText 
              text={text} 
              isPlaying={isPlaying} 
              duration={duration}
              activeClassName="text-primary drop-shadow font-bold scale-105"
          />
       </div>
       <PlayAudioButton 
           text={text} 
           className="mt-1 flex-shrink-0" 
           onPlayStateChange={(playing, dur) => { setIsPlaying(playing); if (dur) setDuration(dur); }} 
       />
     </div>
  );
}

function HintAudioItem({ hint }: { hint: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | undefined>();
  return (
    <div className="p-4 rounded-xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-1 gap-2">
        <div className="font-bold text-primary text-sm">
          <AnimatedText text={hint.basque} isPlaying={isPlaying} duration={duration} activeClassName="text-blue-500 scale-105" />
        </div>
        <PlayAudioButton 
            text={hint.basque} 
            className="w-6 h-6 [&_svg]:w-3 [&_svg]:h-3 flex-shrink-0" 
            onPlayStateChange={(playing, dur) => { setIsPlaying(playing); if (dur) setDuration(dur); }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground leading-tight">{hint.explanation}</p>
    </div>
  );
}

export function InputRichPassage({ worldId }: InputRichPassageProps) {
  const [isPending, startTransition] = useTransition();
  const [passage, setPassage] = useState<any>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    fetchPassage();
  }, [worldId]);

  const fetchPassage = () => {
    startTransition(async () => {
      const result = await getPassageAction(worldId);
      if (result.data) {
        setPassage(result.data);
      }
    });
  };

  if (isPending || !passage) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center gap-4 border-dashed">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Curating Input Passage...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Card className="border-t-8 border-t-primary shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="uppercase tracking-widest text-[9px] bg-white">
              Phase 1: Input & Noticing
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setShowTranslation(!showTranslation)} className="h-8 text-[10px] font-bold uppercase">
              <Eye className="size-3 mr-2" /> {showTranslation ? 'Hide Translation' : 'Show Translation'}
            </Button>
          </div>
          <CardTitle className="text-2xl font-black mt-2">{passage.title}</CardTitle>
          <CardDescription>Read the text below and notice how the "bricks" are used in real sentences.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="relative">
             <PassageAudioHeader text={passage.basqueText} />
             {showTranslation && (
               <div className="mt-6 p-4 bg-primary/5 border-l-4 border-l-primary rounded-r-xl animate-in slide-in-from-left-2">
                 <p className="text-base italic text-muted-foreground leading-relaxed">
                   {passage.englishTranslation}
                 </p>
               </div>
             )}
          </div>

          <div className="grid gap-4 mt-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
               <Info className="size-3" /> Patterns to Notice
            </h4>
            <div className="grid gap-3 sm:grid-cols-3">
              {passage.noticingHints.map((hint: any, i: number) => (
                 <HintAudioItem key={i} hint={hint} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <p className="text-xs text-muted-foreground italic">
          Ready to build these patterns yourself? Move to the <strong>Lego Builder</strong> tab.
        </p>
      </div>
    </div>
  );
}
