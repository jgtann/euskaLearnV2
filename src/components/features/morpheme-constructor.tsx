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
  { initialMorphemes: ['esku', '-ak'], correctSequence: ['esku', '-ak'], correctWord: 'eskuak', targetMeaning: 'the hands' },
  { initialMorphemes: ['-ak', 'ama'], correctSequence: ['ama', '-ak'], correctWord: 'amak', targetMeaning: 'the mothers' },
  { initialMorphemes: ['seme', '-a'], correctSequence: ['seme', '-a'], correctWord: 'semea', targetMeaning: 'the son' },
  { initialMorphemes: ['alaba', '-a'], correctSequence: ['alaba', '-a'], correctWord: 'alaba', targetMeaning: 'the daughter' },
  { initialMorphemes: ['-tik', 'auto', '-a'], correctSequence: ['auto', '-a', '-tik'], correctWord: 'autotik', targetMeaning: 'from the car' },
  { initialMorphemes: ['-ra', 'eskola', '-a'], correctSequence: ['eskola', '-a', '-ra'], correctWord: 'eskolara', targetMeaning: 'to the school' },
  { initialMorphemes: ['-n', 'urte', '-a'], correctSequence: ['urte', '-a', '-n'], correctWord: 'urtean', targetMeaning: 'in the year' },
  { initialMorphemes: ['-n', 'egun', '-a'], correctSequence: ['egun', '-a', '-n'], correctWord: 'egunean', targetMeaning: 'in the day' },
  { initialMorphemes: ['-n', 'bizitza', '-a'], correctSequence: ['bizitza', '-a', '-n'], correctWord: 'bizitzan', targetMeaning: 'in life' },
  { initialMorphemes: ['-n', 'leku', '-a'], correctSequence: ['leku', '-a', '-n'], correctWord: 'lekuan', targetMeaning: 'in the place' },
  { initialMorphemes: ['arazo', '-a'], correctSequence: ['arazo', '-a'], correctWord: 'arazoa', targetMeaning: 'the problem' },
  { initialMorphemes: ['arazo', '-ak'], correctSequence: ['arazo', '-ak'], correctWord: 'arazoak', targetMeaning: 'the problems' },
  { initialMorphemes: ['-n', 'aste', '-a'], correctSequence: ['aste', '-a', '-n'], correctWord: 'astean', targetMeaning: 'in the week' },
  { initialMorphemes: ['puntu', '-a'], correctSequence: ['puntu', '-a'], correctWord: 'puntua', targetMeaning: 'the point' },
  { initialMorphemes: ['-n', 'talde', '-a'], correctSequence: ['talde', '-a', '-n'], correctWord: 'taldean', targetMeaning: 'in the group' },
  { initialMorphemes: ['-n', 'mundu', '-a'], correctSequence: ['mundu', '-a', '-n'], correctWord: 'munduan', targetMeaning: 'in the world' },
  { initialMorphemes: ['galdera', '-a'], correctSequence: ['galdera', '-a'], correctWord: 'galdera', targetMeaning: 'the question' },
  { initialMorphemes: ['galdera', '-ak'], correctSequence: ['galdera', '-ak'], correctWord: 'galderak', targetMeaning: 'the questions' },
  { initialMorphemes: ['-ri', 'aita', '-a'], correctSequence: ['aita', '-a', '-ri'], correctWord: 'aitari', targetMeaning: 'to the father' },
  { initialMorphemes: ['-ri', 'ama', '-a'], correctSequence: ['ama', '-a', '-ri'], correctWord: 'amari', targetMeaning: 'to the mother' },
  { initialMorphemes: ['-ak', 'seme'], correctSequence: ['seme', '-ak'], correctWord: 'semeak', targetMeaning: 'the sons' },
  { initialMorphemes: ['-ak', 'alaba'], correctSequence: ['alaba', '-ak'], correctWord: 'alabak', targetMeaning: 'the daughters' },
  { initialMorphemes: ['-tik', 'hiri', '-a'], correctSequence: ['hiri', '-a', '-tik'], correctWord: 'hiritik', targetMeaning: 'from the city' },
  { initialMorphemes: ['-ra', 'hiri', '-a'], correctSequence: ['hiri', '-a', '-ra'], correctWord: 'hirira', targetMeaning: 'to the city' },
  { initialMorphemes: ['-tik', 'eskola', '-a'], correctSequence: ['eskola', '-a', '-tik'], correctWord: 'eskolatik', targetMeaning: 'from the school' },
  { initialMorphemes: ['-ekin', 'gizon', '-a'], correctSequence: ['gizon', '-a', '-ekin'], correctWord: 'gizonarekin', targetMeaning: 'with the man' },
  { initialMorphemes: ['-ekin', 'emakume', '-a'], correctSequence: ['emakume', '-a', '-ekin'], correctWord: 'emakumearekin', targetMeaning: 'with the woman' },
  { initialMorphemes: ['-dun', 'diru'], correctSequence: ['diru', '-dun'], correctWord: 'dirudun', targetMeaning: 'wealthy (having money)' },
  { initialMorphemes: ['-gabe', 'diru'], correctSequence: ['diru', '-gabe'], correctWord: 'dirugabe', targetMeaning: 'without money' },
  { initialMorphemes: ['-z', 'auto'], correctSequence: ['auto', '-z'], correctWord: 'autoz', targetMeaning: 'by car' },
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
  const [shuffledMorphemes, setShuffledMorphemes] = useState<string[]>([]);

  const currentChallenge = shuffledChallenges[challengeIndex];

  const resetBoard = useCallback(() => {
    setConstructed([]);
    setFeedback(null);
  }, []);

  useEffect(() => {
    if (currentChallenge) {
      setShuffledMorphemes([...currentChallenge.initialMorphemes].sort(() => Math.random() - 0.5));
    }
    resetBoard();
  }, [currentChallenge, resetBoard]);

  const availableMorphemes = useMemo(() => {
    // This logic is a bit flawed if morphemes can be repeated, but for these challenges it's fine.
    const constructedCopy = [...constructed];
    return shuffledMorphemes.filter(m => {
      const index = constructedCopy.indexOf(m);
      if (index > -1) {
        constructedCopy.splice(index, 1);
        return false;
      }
      return true;
    });
  }, [constructed, shuffledMorphemes]);

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
    if (JSON.stringify(constructed) === JSON.stringify(currentChallenge.correctSequence)) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleReset = () => {
    resetBoard();
  };

  const handleShuffleList = () => {
    setShuffledChallenges([...challenges].sort(() => Math.random() - 0.5));
    setChallengeIndex(0);
  };

  const handleShuffleTiles = () => {
    setShuffledMorphemes([...shuffledMorphemes].sort(() => Math.random() - 0.5));
  };
  
  const handleNext = () => {
    if (challengeIndex === shuffledChallenges.length - 1) {
      handleShuffleList();
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

  if (!currentChallenge) {
    return <div>Loading challenges...</div>;
  }

  const { correctSequence, correctWord, targetMeaning } = currentChallenge;

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
            <MorphemeTile key={`${m}-${i}`} morpheme={m} onClick={handlePaletteClick} disabled={feedback === 'correct'} />
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
        <Button variant="outline" onClick={handleShuffleList}>
            <Shuffle className="mr-2" /> New Word Set
        </Button>
        <Button variant="outline" onClick={handleShuffleTiles}>
            <Shuffle className="mr-2" /> Shuffle Tiles
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
