'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getTranslation } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, FileText, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

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
  const [state, formAction] = useFormState(getTranslation, initialState);
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

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <Textarea
          name="text"
          placeholder="e.g., The woman gives the book to the man."
          rows={3}
          className="text-base"
        />
        <SubmitButton />
      </form>

      {state.data && (
        <div className="space-y-6 animate-in fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Languages className="text-primary" />
                Basque Translation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{state.data.basqueTranslation}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <FileText className="text-accent" />
                Grammatical Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/90">
              <p>{state.data.explanation}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
