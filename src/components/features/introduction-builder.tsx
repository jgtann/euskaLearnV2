'use client';

import { useEffect, useState, useRef, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { getIntroduction } from '@/app/actions';
import { getSpeech } from '@/app/actions/speech';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, User, BookText, RefreshCw, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 animate-spin" /> Building...
        </>
      ) : (
        <>
          <Sparkles className="mr-2" /> Build My Introduction
        </>
      )}
    </Button>
  );
}

export function IntroductionBuilder() {
  const [state, setState] = useState<any>(initialState);
  const [isAudioPending, startAudioTransition] = useTransition();
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Builder Error",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const handleAction = async (formData: FormData) => {
    const result = await getIntroduction(state, formData);
    setState(result);
  }

  const handleReset = () => {
    formRef.current?.reset();
    setState(initialState);
  }

  const handlePlayAudio = () => {
    const introductionText = state.data?.introduction;
    if (!introductionText || isAudioPending) return;

    if (audioCache[introductionText]) {
      new Audio(audioCache[introductionText]).play().catch(() => {
        toast({
          variant: "destructive",
          title: "Audio Playback Error",
          description: "Could not play the audio file.",
        });
      });
      return;
    }

    startAudioTransition(async () => {
        const formData = new FormData();
        formData.append('text', introductionText);
        const response = await getSpeech(null, formData);

        if (response.data?.audioDataUri) {
            const audioDataUri = response.data.audioDataUri;
            setAudioCache(prev => ({ ...prev, [introductionText]: audioDataUri }));
            const audio = new Audio(audioDataUri);
            audio.play().catch(err => {
                 toast({
                    variant: "destructive",
                    title: "Audio Playback Error",
                    description: "Could not play the audio file.",
                });
            });
        } else {
            console.error("Speech synthesis error:", response.error);
        }
    });
  }

  return (
    <div className="space-y-6">
      <form action={handleAction} ref={formRef} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" name="name" placeholder="e.g., Alex" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="from">Where you are from</Label>
            <Input id="from" name="from" placeholder="e.g., California" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="hobby">A hobby you enjoy</Label>
            <Input id="hobby" name="hobby" placeholder="e.g., hiking" required />
        </div>
        <div className="space-y-2">
          <Label>Formality</Label>
          <RadioGroup defaultValue="informal" name="formality" className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="informal" id="informal" />
              <Label htmlFor="informal">Informal (Zu)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="formal" id="formal" />
              <Label htmlFor="formal">Formal (Zuk)</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex items-center gap-2">
            <SubmitButton />
            <Button type="button" variant="outline" size="icon" onClick={handleReset}>
                <RefreshCw className="size-4" />
                <span className="sr-only">Reset</span>
            </Button>
        </div>
      </form>

      {state.data && (
        <div className="space-y-6 animate-in fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 font-heading">
                <div className="flex items-center gap-2">
                    <User className="text-primary" />
                    Your Basque Introduction
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold">{state.data.introduction}</p>
                    <Button variant="outline" size="icon" onClick={handlePlayAudio} disabled={isAudioPending}>
                        {isAudioPending ? <Loader2 className="size-5 animate-spin" /> : <Volume2 className="size-5" />}
                        <span className="sr-only">Play audio</span>
                    </Button>
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <BookText className="text-accent" />
                Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.data.explanation.map((item: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg bg-background/50 text-foreground/90">
                  <p className="font-bold text-primary font-code">{item.concept}</p>
                  <p className="mt-1 text-muted-foreground">{item.meaning}</p>
                  <p className="mt-2 text-sm italic">e.g., "{item.example}"</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
