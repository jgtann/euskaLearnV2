'use client';

import { useState, useRef, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { getGrammarCheck } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, CheckCircle2, XCircle, RefreshCw, BrainCircuit, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 animate-spin" /> Analyzing...
        </>
      ) : (
        <>
          <BrainCircuit className="mr-2" /> Check My Basque
        </>
      )}
    </Button>
  );
}

export function GrammarChecker() {
  const [state, setState] = useState<any>({ data: null, error: null });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleAction = async (formData: FormData) => {
    const result = await getGrammarCheck(state, formData);
    setState(result);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Check Failed",
        description: result.error,
      });
    }
  }

  const handleReset = () => {
    formRef.current?.reset();
    setState({ data: null, error: null });
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} action={handleAction} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            name="text"
            placeholder="e.g., Nik ura edaten dut"
            rows={3}
            className="text-lg font-medium"
          />
          <p className="text-xs text-muted-foreground">Type a Basque phrase or sentence you're working on.</p>
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
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <Card className={cn(
            "border-l-8",
            state.data.isCorrect ? "border-l-basque-green bg-green-50/30" : "border-l-basque-red bg-red-50/30"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl font-heading">
                {state.data.isCorrect ? (
                  <>
                    <CheckCircle2 className="text-basque-green size-6" />
                    <span className="text-basque-green">Looking Good!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-basque-red size-6" />
                    <span className="text-basque-red">Almost There!</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-white/80 border shadow-sm">
                <p className="text-sm font-bold uppercase text-muted-foreground tracking-widest mb-1">Simple Explanation</p>
                <p className="text-lg leading-relaxed text-basque-earth">{state.data.explanation}</p>
              </div>

              {!state.data.isCorrect && state.data.correctedText && (
                <div className="p-4 rounded-xl bg-basque-green/10 border-2 border-basque-green/20">
                  <p className="text-sm font-bold uppercase text-basque-green tracking-widest mb-1">Corrected Version</p>
                  <p className="text-2xl font-black text-basque-green tracking-tight font-code">{state.data.correctedText}</p>
                </div>
              )}

              {state.data.isCorrect && (
                <div className="flex justify-center py-2 animate-bounce">
                    <Sparkles className="text-yellow-500 size-8" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
