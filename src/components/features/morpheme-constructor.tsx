'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, RefreshCw, Sparkles, ThumbsUp, XCircle } from 'lucide-react';
import { AudioPlayer } from './audio-player';

const initialMorphemes = ['-a', 'txakur', '-k'];
const correctSequence = ['txakur', '-a', '-k'];
const correctWord = 'txakurrak';
const targetMeaning = 'the dog (subject)';

const MorphemeTile = ({ morpheme, onClick, disabled }) => (
  <Button
    variant="secondary"
    size="lg"
    onClick={() => onClick(morpheme)}
    disabled={disabled}
    className="text-lg font-bold transition-all duration-200 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground disabled:opacity-50 font-code"
  >
    {morpheme}
  </Button>
);

export function MorphemeConstructor() {
  const [constructed, setConstructed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const availableMorphemes = useMemo(() => {
    return initialMorphemes.filter(m => !constructed.includes(m));
  }, [constructed]);

  const handlePaletteClick = (morpheme: string) => {
    setConstructed([...constructed, morpheme]);
    setFeedback(null);
  };

  const handleConstructionClick = (morpheme: string) => {
    setConstructed(constructed.filter(m => m !== morpheme));
    setFeedback(null);
  };
  
  const handleCheck = () => {
    if (JSON.stringify(constructed) === JSON.stringify(correctSequence)) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleReset = () => {
    setConstructed([]);
    setFeedback(null);
  };

  const constructionAreaClasses = cn(
    "flex items-center justify-center gap-2 p-4 min-h-[80px] rounded-lg border-2 border-dashed transition-colors",
    feedback === 'correct' && 'border-green-500 bg-green-500/10',
    feedback === 'incorrect' && 'border-destructive bg-destructive/10',
    !feedback && 'border-primary/50 bg-primary/5'
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-center text-muted-foreground">Form the word for:</p>
        <p className="text-center font-heading text-3xl font-bold text-primary">{targetMeaning}</p>
      </div>
      
      <div className={constructionAreaClasses}>
        {constructed.length > 0 ? (
          constructed.map((m, i) => (
             <Button
                key={i}
                variant="outline"
                size="lg"
                onClick={() => handleConstructionClick(m)}
                className="text-lg font-bold bg-card shadow-sm cursor-pointer animate-in fade-in font-code"
              >
                {m}
              </Button>
          ))
        ) : (
          <p className="text-muted-foreground">Click tiles below to build the word</p>
        )}
      </div>

      <Card className="p-6 bg-muted/50">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {availableMorphemes.map((m, i) => (
            <MorphemeTile key={i} morpheme={m} onClick={handlePaletteClick} disabled={feedback === 'correct'} />
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={handleReset} disabled={constructed.length === 0}>
            <RefreshCw className="mr-2" /> Reset
        </Button>
        <Button onClick={handleCheck} disabled={constructed.length === 0 || feedback === 'correct'}>
            <CheckCircle className="mr-2" /> Check Answer
        </Button>
      </div>

      {feedback && (
        <div className="p-4 rounded-lg text-center animate-in fade-in zoom-in-95">
          {feedback === 'correct' && (
            <div className="flex flex-col items-center gap-2 text-green-600">
                <ThumbsUp className="size-12"/>
                <p className="font-bold text-2xl">Zorionak! Correct!</p>
                <div className="text-center text-foreground/90 bg-green-500/10 p-3 rounded-md">
                    <p>You combined <span className="font-bold font-code">{correctSequence.join(' + ')}</span></p>
                    <p>to form <span className="font-bold font-code">{correctWord}</span>.</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <p className="text-muted-foreground">Listen:</p>
                    <AudioPlayer text={correctWord} />
                </div>
                <Button variant="default" className="mt-4">Next Word <Sparkles className="ml-2"/></Button>
            </div>
          )}
          {feedback === 'incorrect' && (
            <div className="flex flex-col items-center gap-2 text-destructive">
                <XCircle className="size-12"/>
                <p className="font-bold text-2xl">Not quite, try again!</p>
                <p>The order of morphemes is important.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
