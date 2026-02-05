'use client';

import { useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { getTranslation } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, FileText, Languages, RefreshCw } from 'lucide-react';
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
  const [state, setState] = useState(initialState);
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
    const result = await getTranslation(state, formData);
    setState(result);
  }

  const handleReset = () => {
    formRef.current?.reset();
    setState(initialState);
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 font-heading">
                <div className="flex items-center gap-2">
                    <Languages className="text-primary" />
                    Basque Translation
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{state.data.basqueTranslation}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <FileText className="text-accent" />
                Grammatical Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.data.explanation.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background/50 text-foreground/90">
                  <p className="font-bold text-primary">{item.concept}</p>
                  <p className="mt-1">{item.explanation}</p>
                  {item.example && <p className="mt-2 text-sm italic">e.g., "{item.example}"</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
