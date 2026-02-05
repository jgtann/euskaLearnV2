'use client';

import { useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { getIntroduction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, User, BookText, RefreshCw } from 'lucide-react';
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
  const [state, setState] = useState(initialState);
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

  return (
    <div className="space-y-6">
      <form action={handleAction} ref={formRef} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" name="name" placeholder="e.g., Alex" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="from">Where you are from</Label>
            <Input id="from" name="from" placeholder="e.g., California" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="hobby">A hobby you enjoy</Label>
            <Input id="hobby" name="hobby" placeholder="e.g., hiking" />
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
            <CardContent>
              <p className="text-lg font-semibold">{state.data.introduction}</p>
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
              {state.data.explanation.map((item, index) => (
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
