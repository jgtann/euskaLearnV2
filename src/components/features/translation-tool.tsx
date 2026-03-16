
'use client';

import { useEffect, useState, useRef, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { getTranslation } from '@/app/actions';
import { getSpeech } from '@/app/actions/speech';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, FileText, Languages, RefreshCw, Volume2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
          <Loader2 className="mr-2 animate-spin" /> Translating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2" /> Translate & Explain
        </>
      )}
    </Button>
  );
}

export function TranslationTool() {
  const [state, setState] = useState<any>(initialState);
  const [isAudioPending, startAudioTransition] = useTransition();
  const [showHint, setShowHint] = useState(false);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Translation Error",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const handleAction = async (formData: FormData) => {
    setShowHint(false);
    const result = await getTranslation(state, formData);
    setState(result);
  }

  const handleReset = () => {
    formRef.current?.reset();
    setState(initialState);
    setShowHint(false);
  }

  const handlePlayAudio = () => {
    const translationText = state.data?.basqueTranslation;
    if (!translationText || isAudioPending) return;

    if (audioCache[translationText]) {
      const audio = new Audio(audioCache[translationText]);
      audio.play().catch(() => {});
      return;
    }

    startAudioTransition(async () => {
        const formData = new FormData();
        formData.append('text', translationText);
        const response = await getSpeech(null, formData);

        if (response.data?.audioDataUri) {
            const audioDataUri = response.data.audioDataUri;
            setAudioCache(prev => ({ ...prev, [translationText]: audioDataUri }));
            const audio = new Audio(audioDataUri);
            audio.play().catch(() => {});
        }
    });
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} action={handleAction} className="space-y-4">
        <Textarea
          name="text"
          placeholder="e.g., The woman gives the book to the man."
          rows={3}
          className="text-base"
        />
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
          {/* Thesis 4.8: AI-Assisted Support - Adaptive Hints */}
          {!showHint && (
            <Alert className="bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => setShowHint(true)}>
              <HelpCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-xs font-bold uppercase tracking-tight">Adaptive Hint Available</AlertTitle>
              <AlertDescription className="text-xs">
                Click to see a structural clue before the full translation.
              </AlertDescription>
            </Alert>
          )}

          {showHint && (
            <Alert className="bg-orange-50 border-orange-200 animate-in slide-in-from-top-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <AlertTitle className="text-xs font-bold uppercase">Structural Scaffold</AlertTitle>
              <AlertDescription className="text-sm">
                Focus on the <strong>{state.data.explanation[0]?.concept}</strong>. In Basque, this marks the relationship between the participants.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 font-heading">
                <div className="flex items-center gap-2 text-xl">
                    <Languages className="text-primary" />
                    Basque Translation
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-2xl font-bold tracking-tight text-basque-earth">{state.data.basqueTranslation}</p>
                <Button variant="outline" size="icon" onClick={handlePlayAudio} disabled={isAudioPending}>
                    {isAudioPending ? <Loader2 className="size-5 animate-spin" /> : <Volume2 className="size-5" />}
                    <span className="sr-only">Play audio</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg">
                <FileText className="text-accent" />
                Pedagogical Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.data.explanation.map((item: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/30 text-foreground/90">
                  <p className="font-bold text-primary font-code">{item.concept}</p>
                  <p className="mt-1 text-sm leading-relaxed">{item.explanation}</p>
                  {item.example && <p className="mt-2 text-[11px] italic text-muted-foreground">e.g., "{item.example}"</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
