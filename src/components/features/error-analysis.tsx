
'use client';

import { useState, useTransition, useMemo } from 'react';
import { getErrorAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BrainCircuit, AlertTriangle, Sparkles, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

type AnalysisResult = {
    identifiedMorphemes: string;
    errorHeatmap: string;
} | null;

export function ErrorAnalysis() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AnalysisResult>(null);
  const { toast } = useToast();

  const { user } = useUser();
  const firestore = useFirestore();

  const userLearningItemsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'user_learning_items');
  }, [user, firestore]);
  const { data: userItems, isLoading: isLoadingUserItems } = useCollection(userLearningItemsQuery);

  const userDataString = useMemo(() => {
    if (!userItems || userItems.length === 0) return null;

    return userItems
      .filter(item => (item.incorrectCount || 0) > 0)
      .map(userItem => {
          return `Item: "${userItem.learningItemId}", Correct: ${userItem.correctCount || 0}, Incorrect: ${userItem.incorrectCount || 0}`;
      })
      .join('\n');
  }, [userItems]);

  const handleAnalysis = () => {
    if (!userDataString) {
      setResult({
        identifiedMorphemes: "Insufficient data for pattern detection.",
        errorHeatmap: "You haven't logged any errors yet! Keep practicing to generate diagnostic data.",
      });
      return;
    }

    startTransition(async () => {
      const response = await getErrorAnalysis(userDataString);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: response.error,
        });
      } else {
        setResult(response.data);
      }
    });
  };

  const isLoading = isPending || isLoadingUserItems;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-muted-foreground max-w-md">
            Our AI analyzes your unique mistake history to identify specific patterns of confusion between Basque and English structures.
        </p>
        <Button onClick={handleAnalysis} disabled={isLoading} size="lg">
            {isPending ? (
            <>
                <Loader2 className="mr-2 animate-spin" /> Analyzing Patterns...
            </>
            ) : (
            <>
                <BrainCircuit className="mr-2" /> Run AI Diagnostics
            </>
            )}
        </Button>
      </div>

      {result && (
        <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="size-4 text-primary"/>
                Inferred Friction Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{result.identifiedMorphemes}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="size-4 text-orange-500"/>
                Cognitive Error Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{result.errorHeatmap}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
