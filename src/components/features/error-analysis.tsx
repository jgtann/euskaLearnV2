'use client';

import { useState, useTransition } from 'react';
import { getErrorAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BrainCircuit, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AnalysisResult = {
    identifiedMorphemes: string;
    errorHeatmap: string;
} | null;

export function ErrorAnalysis() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AnalysisResult>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = () => {
    startTransition(async () => {
      setError(null);
      setResult(null);
      const response = await getErrorAnalysis();
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

  return (
    <div className="space-y-6 text-center">
      <Button onClick={handleAnalysis} disabled={isPending} size="lg">
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

      {isPending && (
         <div className="text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" />
            <p>Our AI is reviewing your learning data...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 text-left animate-in fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Morpheme Friction Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{result.identifiedMorphemes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Error Heatmap</CardTitle>
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
