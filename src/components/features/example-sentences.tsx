'use client';

import { useEffect, useState, useTransition } from 'react';
import { getSentenceExamplesAction, getGrammarExplanationAction } from '@/app/actions';
import type { Word } from '@/lib/vocabulary';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, BookOpen, Volume2 } from 'lucide-react';
import { synthesizeSpeech } from '@/ai/flows/text-to-speech-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedText } from '@/components/features/animated-text';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExampleSentencesProps {
  word: Word;
}

interface SentenceExample {
  basque: string;
  english: string;
}

interface GrammarPoint {
    morpheme: string;
    explanation: string;
}

const sentenceInitialState = {
  data: null as { examples: SentenceExample[] } | null,
  error: null as string | null,
};

const grammarInitialState = {
    data: null as { breakdown: GrammarPoint[] } | null,
    error: null as string | null,
};

import { synthesizeElhuyarSpeech } from '@/app/actions/elhuyar-tts';
import { PlayAudioButton } from '@/components/features/play-audio-button';

function GrammarExplanation({ sentence }: { sentence: SentenceExample }) {
    const [state, setState] = useState(grammarInitialState);
    const [isFetching, startFetching] = useTransition();

    const handleFetchExplanation = () => {
        if (state.data || isFetching) return;

        startFetching(async () => {
            const formData = new FormData();
            formData.append('basqueSentence', sentence.basque);
            formData.append('englishSentence', sentence.english);
            const result = await getGrammarExplanationAction(null, formData);
            setState(result);
        });
    }

    return (
        <Popover onOpenChange={(open) => { if(open) handleFetchExplanation()}}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <BookOpen className="size-4 text-muted-foreground" />
                    <span className="sr-only">Show grammar explanation</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Grammar Breakdown</h4>
                        <p className="text-sm text-muted-foreground">
                            AI-generated explanation for "{sentence.basque}"
                        </p>
                    </div>
                    <div className="grid gap-2">
                       {isFetching && (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <p>Analyzing...</p>
                            </div>
                       )}
                       {state.error && <p className="text-sm text-destructive">{state.error}</p>}
                       {state.data?.breakdown.map((item, index) => (
                           <div key={index} className="grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1">
                             <span className="font-semibold font-code text-primary">{item.morpheme}</span>
                             <p className="text-sm text-muted-foreground">{item.explanation}</p>
                           </div>
                       ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

function SentenceItem({ example }: { example: SentenceExample }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | undefined>();
  
  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
      <div>
        <p className="font-semibold">
           <AnimatedText text={example.basque} isPlaying={isPlaying} duration={duration} />
        </p>
        <p className="text-sm text-muted-foreground">{example.english}</p>
      </div>
      <div className="flex gap-2">
        <PlayAudioButton text={example.basque} onPlayStateChange={(playing, dur) => { setIsPlaying(playing); if (dur) setDuration(dur); }} />
        <GrammarExplanation sentence={example} />
      </div>
    </div>
  );
}

export function ExampleSentences({ word }: ExampleSentencesProps) {
  const [state, setState] = useState(sentenceInitialState);
  const [isFetchingSentences, startFetchingSentences] = useTransition();
  const { toast } = useToast();
  
  useEffect(() => {
    startFetchingSentences(async () => {
      const formData = new FormData();
      formData.append('basqueWord', word.basque);
      formData.append('englishWord', word.english);
      
      const result = await getSentenceExamplesAction(null, formData);
      setState(result);

      if (result.error) {
        toast({
            variant: 'destructive',
            title: 'Error fetching examples',
            description: result.error,
        });
      }
    });
  }, [word, toast]);

  if (isFetchingSentences) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
        </div>
    );
  }

  if (state.error) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 p-8 text-center">
            <AlertTriangle className="size-12 text-destructive" />
            <h3 className="font-semibold text-destructive">Could not load examples</h3>
            <p className="text-destructive/80">{state.error}</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {state.data?.examples.map((example, index) => (
        <SentenceItem key={index} example={example} />
      ))}
    </div>
  );
}
