'use client';

import { useState, useTransition, useMemo } from 'react';
import { getErrorAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BrainCircuit, AlertTriangle, Sparkles } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { user } = useUser();
  const firestore = useFirestore();

  // Fetch user's learning items with stats
  const userLearningItemsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'user_learning_items');
  }, [user, firestore]);
  const { data: userItems, isLoading: isLoadingUserItems } = useCollection(userLearningItemsQuery);

  // Fetch all learning items to map IDs to text
  const allLearningItemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'learning_items');
  }, [firestore]);
  const { data: allItems, isLoading: isLoadingAllItems } = useCollection(allLearningItemsQuery);
  
  const userDataString = useMemo(() => {
    if (!userItems || !allItems) return null;

    const learningItemsMap = new Map(allItems.map(item => [item.id, item]));

    return userItems
      .filter(item => item.incorrectCount > 0)
      .map(userItem => {
          const learningItem = learningItemsMap.get(userItem.learningItemId);
          if (!learningItem) return null;
          // Format for the AI: Item text, correct/incorrect counts
          return `Item: "${learningItem.basqueText}", Correct: ${userItem.correctCount}, Incorrect: ${userItem.incorrectCount}`;
      })
      .filter(Boolean)
      .join('\n');
  }, [userItems, allItems]);


  const handleAnalysis = () => {
    setError(null);
    setResult(null);

    if (isLoadingUserItems || isLoadingAllItems) {
      toast({ title: "Please wait", description: "Learning data is still loading." });
      return;
    }
    
    if (!userDataString) {
      setResult({
        identifiedMorphemes: "No patterns to analyze yet.",
        errorHeatmap: "You haven't made any mistakes! Keep up the great work. Come back after you've completed more exercises.",
      });
      return;
    }

    startTransition(async () => {
      const response = await getErrorAnalysis(userDataString);
      if (response.error) {
        setError(response.error);
        toast({
          variant: "destructive",
          title: "Analysis Error",
          description: response.error,
        });
      } else {
        setResult(response.data);
      }
    });
  };

  const isLoading = isPending || isLoadingUserItems || isLoadingAllItems;

  return (
    <div className="space-y-6 text-center">
      <Button onClick={handleAnalysis} disabled={isLoading} size="lg">
        {isPending ? (
          <>
            <Loader2 className="mr-2 animate-spin" /> Analyzing...
          </>
        ) : (
          <>
            <BrainCircuit className="mr-2" /> Analyze My Errors
          </>
        )}
      </Button>

      {isLoading && !isPending && (
         <div className="text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" />
            <p>Loading your learning data...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 text-left animate-in fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Sparkles className="text-primary"/>
                Morpheme Friction Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{result.identifiedMorphemes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <AlertTriangle className="text-destructive"/>
                Error Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{result.errorHeatmap}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
