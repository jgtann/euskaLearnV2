'use client';

import { useEffect, useState, useTransition } from 'react';
import { getSentenceExamplesAction } from '@/app/actions';
import { getSpeech } from '@/app/actions/speech';
import type { Word } from '@/lib/vocabulary';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Volume2, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ExampleSentencesProps {
  word: Word;
}

interface SentenceExample {
  basque: string;
  english: string;
}

const initialState = {
  data: null as { examples: SentenceExample[] } | null,
  error: null as string | null,
};

export function ExampleSentences({ word }: ExampleSentencesProps) {
  const [state, setState] = useState(initialState);
  const [isFetching, startFetching] = useTransition();
  const [playingSentence, setPlayingSentence] = useState<string | null>(null);
  const [isAudioPending, startAudioTransition] = useTransition();
  const { toast } = useToast();
  
  useEffect(() => {
    startFetching(async () => {
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

  const handlePlayAudio = (sentence: string) => {
    if (isAudioPending) return;

    setPlayingSentence(sentence);
    startAudioTransition(async () => {
        const formData = new FormData();
        formData.append('text', sentence);

        const response = await getSpeech(null, formData);
        let audio: HTMLAudioElement | null = null;

        if (response.error) {
            toast({
                variant: "destructive",
                title: "Speech Synthesis Error",
                description: response.error,
            });
            setPlayingSentence(null);
        } else if (response.data?.audioDataUri) {
            audio = new Audio(response.data.audioDataUri);
            audio.play().catch(err => {
                 toast({
                    variant: "destructive",
                    title: "Audio Playback Error",
                    description: "Could not play the audio file.",
                });
            });
            audio.onended = () => setPlayingSentence(null);
        }
        
        if(!response.data?.audioDataUri) {
             setPlayingSentence(null);
        }
    });
  }

  if (isFetching) {
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
        <div key={index} className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
          <div>
            <p className="font-semibold">{example.basque}</p>
            <p className="text-sm text-muted-foreground">{example.english}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handlePlayAudio(example.basque)}
            disabled={isAudioPending}
          >
            {playingSentence === example.basque ? <Loader2 className="size-5 animate-spin"/> : <Volume2 className="size-5" />}
            <span className="sr-only">Play sentence</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
