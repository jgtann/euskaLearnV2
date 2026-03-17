'use client';

import { useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { getTranslation } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, FileText, Languages, RefreshCw, HelpCircle } from 'lucide-react';
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
  const [showHint, setShowHint] = useState(false);
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
          {!showHint && (
            <Alert className="bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => setShowHint(true)}>
              <HelpCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-xs font-bold uppercase tracking-tight">Got a Clue!</AlertTitle>
              <AlertDescription className="text-xs">
                Click to see a secret tip about how this sentence is built!
              </AlertDescription>
            </Alert>
          )}

          {showHint && (
            <Alert className="bg-orange-50 border-orange-200 animate-in slide-in-from-top-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <AlertTitle className="text-xs font-bold uppercase">Language Secret</AlertTitle>
              <AlertDescription className="text-sm">
                Watch out for the <strong>{state.data.explanation[0]?.concept}</strong>. It helps us know who is doing what!
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
              <p className="text-2xl font-bold tracking-tight text-basque-earth text-center">{state.data.basqueTranslation}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg">
                <FileText className="text-accent" />
                How Basque Works!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.data.explanation.map((item: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/30 text-foreground/90">
                  <p className="font-bold text-primary font-code">{item.concept}</p>
                  <p className="mt-1 text-sm leading-relaxed">{item.explanation}</p>
                  {item.example && <p className="mt-2 text-[11px] italic text-muted-foreground">Example: "{item.example}"</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
