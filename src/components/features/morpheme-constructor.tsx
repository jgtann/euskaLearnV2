'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, RefreshCw, Sparkles, ThumbsUp, XCircle, Shuffle } from 'lucide-react';

const challenges = [
  {
    initialMorphemes: ['-a', 'txakur', '-k'],
    correctSequence: ['txakur', '-a', '-k'],
    correctWord: 'txakurrak',
    targetMeaning: 'the dog (subject)',
  },
  {
    initialMorphemes: ['etxe', '-a'],
    correctSequence: ['etxe', '-a'],
    correctWord: 'etxea',
    targetMeaning: 'the house',
  },
  {
    initialMorphemes: ['-ak', 'gizon'],
    correctSequence: ['gizon', '-ak'],
    correctWord: 'gizonak',
    targetMeaning: 'the men',
  },
  {
    initialMorphemes: ['-ri', 'emakume', '-a'],
    correctSequence: ['emakume', '-a', '-ri'],
    correctWord: 'emakumeari',
    targetMeaning: 'to the woman',
  },
  {
    initialMorphemes: ['liburu', '-a'],
    correctSequence: ['liburu', '-a'],
    correctWord: 'liburua',
    targetMeaning: 'the book',
  },
  {
    initialMorphemes: ['-ak', 'aita'],
    correctSequence: ['aita', '-ak'],
    correctWord: 'aitak',
    targetMeaning: 'the fathers',
  },
  {
    initialMorphemes: ['haur', '-ak'],
    correctSequence: ['haur', '-ak'],
    correctWord: 'haurrak',
    targetMeaning: 'the children',
  },
  {
    initialMorphemes: ['-n', 'hiri', '-a'],
    correctSequence: ['hiri', '-a', '-n'],
    correctWord: 'hirian',
    targetMeaning: 'in the city',
  },
  { initialMorphemes: ['-a', 'mahai'], correctSequence: ['mahai', '-a'], correctWord: 'mahaia', targetMeaning: 'the table' },
  { initialMorphemes: ['lan', '-a'], correctSequence: ['lan', '-a'], correctWord: 'lana', targetMeaning: 'the work' },
  { initialMorphemes: ['auto', '-a'], correctSequence: ['auto', '-a'], correctWord: 'autoa', targetMeaning: 'the car' },
  { initialMorphemes: ['janari', '-a'], correctSequence: ['janari', '-a'], correctWord: 'janaria', targetMeaning: 'the food' },
  { initialMorphemes: ['diru', '-a'], correctSequence: ['diru', '-a'], correctWord: 'dirua', targetMeaning: 'the money' },
  { initialMorphemes: ['-ak', 'etxe'], correctSequence: ['etxe', '-ak'], correctWord: 'etxeak', targetMeaning: 'the houses' },
  { initialMorphemes: ['-ak', 'liburu'], correctSequence: ['liburu', '-ak'], correctWord: 'liburuak', targetMeaning: 'the books' },
  { initialMorphemes: ['lagun', '-ak'], correctSequence: ['lagun', '-ak'], correctWord: 'lagunak', targetMeaning: 'the friends' },
  { initialMorphemes: ['-n', 'eskola', '-a'], correctSequence: ['eskola', '-a', '-n'], correctWord: 'eskolan', targetMeaning: 'in the school' },
  { initialMorphemes: ['-ri', 'gizon', '-a'], correctSequence: ['gizon', '-a', '-ri'], correctWord: 'gizonari', targetMeaning: 'to the man' },
  { initialMorphemes: ['lagun', '-a', '-ri'], correctSequence: ['lagun', '-a', '-ri'], correctWord: 'lagunari', targetMeaning: 'to the friend' },
  { initialMorphemes: ['-ekin', 'lagun', '-a'], correctSequence: ['lagun', '-a', '-ekin'], correctWord: 'lagunarekin', targetMeaning: 'with the friend' },
  { initialMorphemes: ['etxe', '-tik'], correctSequence: ['etxe', '-tik'], correctWord: 'etxetik', targetMeaning: 'from the house' },
  { initialMorphemes: ['-ra', 'etxe'], correctSequence: ['etxe', '-ra'], correctWord: 'etxera', targetMeaning: 'to the house' },
  { initialMorphemes: ['-ko', 'hiri'], correctSequence: ['hiri', '-ko'], correctWord: 'hiriko', targetMeaning: 'of the city' },
  { initialMorphemes: ['-a', 'begi'], correctSequence: ['begi', '-a'], correctWord: 'begia', targetMeaning: 'the eye' },
  { initialMorphemes: ['esku', '-ak'], correctSequence: ['esku', '-ak'], correctWord: 'eskuak', targetMeaning: 'the hands' }
];


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
  const [shuffledChallenges, setShuffledChallenges] = useState(() => [...challenges].sort(() => Math.random() - 0.5));
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const currentChallenge = shuffledChallenges[challengeIndex];
  const { initialMorphemes, correctSequence, correctWord, targetMeaning } = currentChallenge;

  const resetBoard = useCallback(() => {
    setConstructed([]);
    setFeedback(null);
  }, []);

  useEffect(() => {
    resetBoard();
  }, [challengeIndex, resetBoard, shuffledChallenges]);

  const availableMorphemes = useMemo(() => {
    // This logic is a bit flawed if morphemes can be repeated, but for these challenges it's fine.
    const constructedCopy = [...constructed];
    return initialMorphemes.filter(m => {
      const index = constructedCopy.indexOf(m);
      if (index > -1) {
        constructedCopy.splice(index, 1);
        return false;
      }
      return true;
    });
  }, [constructed, initialMorphemes]);

  const handlePaletteClick = (morpheme: string) => {
    setConstructed([...constructed, morpheme]);
    setFeedback(null);
  };

  const handleConstructionClick = (morpheme: string, index: number) => {
    const newConstructed = [...constructed];
    newConstructed.splice(index, 1);
    setConstructed(newConstructed);
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
    resetBoard();
  };

  const handleShuffle = () => {
    setShuffledChallenges([...challenges].sort(() => Math.random() - 0.5));
    setChallengeIndex(0);
  };
  
  const handleNext = () => {
    if (challengeIndex === shuffledChallenges.length - 1) {
      handleShuffle();
    } else {
      setChallengeIndex((prevIndex) => prevIndex + 1);
    }
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
                onClick={() => handleConstructionClick(m, i)}
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
        <Button variant="outline" onClick={handleShuffle}>
            <Shuffle className="mr-2" /> Shuffle List
        </Button>
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
            <div className="flex flex-col items-center gap-4 text-green-600">
                <ThumbsUp className="size-12"/>
                <p className="font-bold text-2xl">Zorionak! Correct!</p>
                <div className="text-center text-foreground/90 bg-green-500/10 p-3 rounded-md space-y-1">
                    <p>You combined <span className="font-bold font-code">{correctSequence.join(' + ')}</span></p>
                    <p>to form <span className="font-bold font-code text-lg">{correctWord}</span>.</p>
                </div>
                <Button variant="default" className="mt-4" onClick={handleNext}>Next Word <Sparkles className="ml-2"/></Button>
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
