
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, RefreshCw, Sparkles, ArrowRight, XCircle } from 'lucide-react';

// Thesis 5.4: Syntax Scrambles (Reordering sentence components)
const sentenceChallenges = [
  {
    english: "The woman gives the book to the man.",
    correct: ["Emakumeak", "gizonari", "liburua", "ematen", "dio"],
    meaning: "Subject (Erg) + Dative + Object + Verb + Aux",
    type: "Ditransitive"
  },
  {
    english: "I am in the house.",
    correct: ["Ni", "etxean", "naiz"],
    meaning: "Subject + Inessive + Verb",
    type: "Intransitive"
  }
];

export function SentenceBuilder() {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [palette, setPalette] = useState<string[]>([]);

  const current = sentenceChallenges[challengeIdx];

  useEffect(() => {
    if (current) {
      setPalette([...current.correct].sort(() => Math.random() - 0.5));
      setConstructed([]);
      setFeedback(null);
    }
  }, [challengeIdx]);

  const handleTile = (word: string, isPalette: boolean, idx?: number) => {
    if (feedback === 'correct') return;
    if (isPalette) {
      setConstructed([...constructed, word]);
      const newPalette = [...palette];
      newPalette.splice(palette.indexOf(word), 1);
      setPalette(newPalette);
    } else {
      setConstructed(constructed.filter((_, i) => i !== idx));
      setPalette([...palette, word]);
    }
    setFeedback(null);
  };

  const check = () => {
    const isCorrect = JSON.stringify(constructed) === JSON.stringify(current.correct);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-8 border-t-primary shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Syntax Scramble</CardTitle>
          <div className="text-2xl font-bold mt-2">"{current.english}"</div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className={cn(
            "flex flex-wrap items-center justify-center gap-2 p-6 min-h-[100px] rounded-2xl border-2 border-dashed transition-all",
            feedback === 'correct' ? "bg-green-50 border-green-500" : "bg-muted/50 border-border"
          )}>
            {constructed.map((w, i) => (
              <Button key={i} variant="outline" className="bg-white font-bold" onClick={() => handleTile(w, false, i)}>
                {w}
              </Button>
            ))}
            {constructed.length === 0 && <p className="text-muted-foreground italic">Reconstruct the Basque sentence...</p>}
          </div>

          <div className="flex flex-wrap justify-center gap-3 p-4 bg-muted rounded-lg min-h-[80px]">
            {palette.map((w, i) => (
              <Button key={i} variant="secondary" className="font-bold hover:scale-105" onClick={() => handleTile(w, true)}>
                {w}
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={() => { setPalette([...current.correct].sort()); setConstructed([]); setFeedback(null); }}>
              <RefreshCw className="size-4 mr-2" /> Reset
            </Button>
            {feedback === 'correct' ? (
              <Button className="bg-basque-green hover:bg-green-700" onClick={() => setChallengeIdx((i) => (i + 1) % sentenceChallenges.length)}>
                Next Sentence <Sparkles className="ml-2 size-4" />
              </Button>
            ) : (
              <Button onClick={check} disabled={constructed.length !== current.correct.length}>Check Syntax</Button>
            )}
          </div>
        </CardContent>
      </Card>
      {feedback === 'incorrect' && (
        <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-center flex items-center justify-center gap-2 text-destructive">
          <XCircle className="size-5" />
          <p className="text-sm font-bold">Try a different order. Hint: Basque is often SOV (Subject-Object-Verb).</p>
        </div>
      )}
    </div>
  );
}
