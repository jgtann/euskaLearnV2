'use client';

import { useState, useMemo, useEffect, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RefreshCw, ArrowRight, Layers } from 'lucide-react';
import { getSpeech } from '@/app/actions/speech';
import { useToast } from '@/hooks/use-toast';

const challenges = [
  { initialMorphemes: ['txakur', '-a', '-k'], correctSequence: ['txakur', '-a', '-k'], correctWord: 'txakurrak', targetMeaning: 'the dog (subject)' },
  { initialMorphemes: ['etxe', '-a', '-ra'], correctSequence: ['etxe', '-a', '-ra'], correctWord: 'etxera', targetMeaning: 'to the house' },
  { initialMorphemes: ['etxe', '-a'], correctSequence: ['etxe', '-a'], correctWord: 'etxea', targetMeaning: 'the house' },
  { initialMorphemes: ['gizon', '-ak'], correctSequence: ['gizon', '-ak'], correctWord: 'gizonak', targetMeaning: 'the men' },
  { initialMorphemes: ['emakume', '-a', '-ri'], correctSequence: ['emakume', '-a', '-ri'], correctWord: 'emakumeari', targetMeaning: 'to the woman' },
  { initialMorphemes: ['liburu', '-a'], correctSequence: ['liburu', '-a'], correctWord: 'liburua', targetMeaning: 'the book' },
  { initialMorphemes: ['aita', '-ak'], correctSequence: ['aita', '-ak'], correctWord: 'aitak', targetMeaning: 'the fathers' },
  { initialMorphemes: ['alaba', '-ak'], correctSequence: ['alaba', '-ak'], correctWord: 'alabak', targetMeaning: 'the daughters' },
  { initialMorphemes: ['haur', '-ak'], correctSequence: ['haur', '-ak'], correctWord: 'haurrak', targetMeaning: 'the children' },
  { initialMorphemes: ['hiri', '-a', '-n'], correctSequence: ['hiri', '-a', '-n'], correctWord: 'hirian', targetMeaning: 'in the city' },
  { initialMorphemes: ['mahai', '-a'], correctSequence: ['mahai', '-a'], correctWord: 'mahaia', targetMeaning: 'the table' },
  { initialMorphemes: ['lan', '-a'], correctSequence: ['lan', '-a'], correctWord: 'lana', targetMeaning: 'the work' },
  { initialMorphemes: ['auto', '-a'], correctSequence: ['auto', '-a'], correctWord: 'autoa', targetMeaning: 'the car' },
  { initialMorphemes: ['janari', '-a'], correctSequence: ['janari', '-a'], correctWord: 'janaria', targetMeaning: 'the food' },
  { initialMorphemes: ['diru', '-a'], correctSequence: ['diru', '-a'], correctWord: 'dirua', targetMeaning: 'the money' },
  { initialMorphemes: ['etxe', '-ak'], correctSequence: ['etxe', '-ak'], correctWord: 'etxeak', targetMeaning: 'the houses' },
  { initialMorphemes: ['liburu', '-ak'], correctSequence: ['liburu', '-ak'], correctWord: 'liburuak', targetMeaning: 'the books' },
  { initialMorphemes: ['lagun', '-ak'], correctSequence: ['lagun', '-ak'], correctWord: 'lagunak', targetMeaning: 'the friends' },
  { initialMorphemes: ['eskola', '-a', '-n'], correctSequence: ['eskola', '-a', '-n'], correctWord: 'eskolan', targetMeaning: 'in the school' },
  { initialMorphemes: ['gizon', '-a', '-ri'], correctSequence: ['gizon', '-a', '-ri'], correctWord: 'gizonari', targetMeaning: 'to the man' },
  { initialMorphemes: ['lagun', '-a', '-ri'], correctSequence: ['lagun', '-a', '-ri'], correctWord: 'lagunari', targetMeaning: 'to the friend' },
  { initialMorphemes: ['lagun', '-a', '-ekin'], correctSequence: ['lagun', '-a', '-ekin'], correctWord: 'lagunarekin', targetMeaning: 'with the friend' },
  { initialMorphemes: ['etxe', '-a', '-ra'], correctSequence: ['etxe', '-a', '-ra'], correctWord: 'etxera', targetMeaning: 'to the house' },
  { initialMorphemes: ['hiri', '-ko'], correctSequence: ['hiri', '-ko'], correctWord: 'hiriko', targetMeaning: 'of the city' },
  { initialMorphemes: ['begi', '-a'], correctSequence: ['begi', '-a'], correctWord: 'begia', targetMeaning: 'the eye' },
  { initialMorphemes: ['esku', '-ak'], correctSequence: ['esku', '-ak'], correctWord: 'eskuak', targetMeaning: 'the hands' },
  { initialMorphemes: ['ama', '-ak'], correctSequence: ['ama', '-ak'], correctWord: 'amak', targetMeaning: 'the mothers' },
  { initialMorphemes: ['seme', '-a'], correctSequence: ['seme', '-a'], correctWord: 'semea', targetMeaning: 'the son' },
  { initialMorphemes: ['auto', '-a', '-tik'], correctSequence: ['auto', '-a', '-tik'], correctWord: 'autotik', targetMeaning: 'from the car' },
  { initialMorphemes: ['eskola', '-a', '-ra'], correctSequence: ['eskola', '-a', '-ra'], correctWord: 'eskolara', targetMeaning: 'to the school' },
  { initialMorphemes: ['urte', '-a', '-n'], correctSequence: ['urte', '-a', '-n'], correctWord: 'urtean', targetMeaning: 'in the year' },
  { initialMorphemes: ['egun', '-a', '-n'], correctSequence: ['egun', '-a', '-n'], correctWord: 'egunean', targetMeaning: 'in the day' },
  { initialMorphemes: ['bizitza', '-a', '-n'], correctSequence: ['bizitza', '-a', '-n'], correctWord: 'bizitzan', targetMeaning: 'in life' },
  { initialMorphemes: ['leku', '-a', '-n'], correctSequence: ['leku', '-a', '-n'], correctWord: 'lekuan', targetMeaning: 'in the place' },
  { initialMorphemes: ['arazo', '-a'], correctSequence: ['arazo', '-a'], correctWord: 'arazoa', targetMeaning: 'the problem' },
  { initialMorphemes: ['arazo', '-ak'], correctSequence: ['arazo', '-ak'], correctWord: 'arazoak', targetMeaning: 'the problems' },
  { initialMorphemes: ['aste', '-a', '-n'], correctSequence: ['aste', '-a', '-n'], correctWord: 'astean', targetMeaning: 'in the week' },
  { initialMorphemes: ['puntu', '-a'], correctSequence: ['puntu', '-a'], correctWord: 'puntua', targetMeaning: 'the point' },
  { initialMorphemes: ['talde', '-a', '-n'], correctSequence: ['talde', '-a', '-n'], correctWord: 'taldean', targetMeaning: 'in the group' },
  { initialMorphemes: ['mundu', '-a', '-n'], correctSequence: ['mundu', '-a', '-n'], correctWord: 'munduan', targetMeaning: 'in the world' },
  { initialMorphemes: ['galdera', '-a'], correctSequence: ['galdera', '-a'], correctWord: 'galdera', targetMeaning: 'the question' },
  { initialMorphemes: ['galdera', '-ak'], correctSequence: ['galdera', '-ak'], correctWord: 'galderak', targetMeaning: 'the questions' },
  { initialMorphemes: ['aita', '-a', '-ri'], correctSequence: ['aita', '-a', '-ri'], correctWord: 'aitari', targetMeaning: 'to the father' },
  { initialMorphemes: ['ama', '-a', '-ri'], correctSequence: ['ama', '-a', '-ri'], correctWord: 'amari', targetMeaning: 'to the mother' },
  { initialMorphemes: ['seme', '-ak'], correctSequence: ['seme', '-ak'], correctWord: 'semeak', targetMeaning: 'the sons' },
  { initialMorphemes: ['hiri', '-a', '-tik'], correctSequence: ['hiri', '-a', '-tik'], correctWord: 'hiritik', targetMeaning: 'from the city' },
  { initialMorphemes: ['hiri', '-a', '-ra'], correctSequence: ['hiri', '-a', '-ra'], correctWord: 'hirira', targetMeaning: 'to the city' },
  { initialMorphemes: ['eskola', '-a', '-tik'], correctSequence: ['eskola', '-a', '-tik'], correctWord: 'eskolatik', targetMeaning: 'from the school' },
  { initialMorphemes: ['gizon', '-a', '-ekin'], correctSequence: ['gizon', '-a', '-ekin'], correctWord: 'gizonarekin', targetMeaning: 'with the man' },
  { initialMorphemes: ['emakume', '-a', '-ekin'], correctSequence: ['emakume', '-a', '-ekin'], correctWord: 'emakumearekin', targetMeaning: 'with the woman' },
  { initialMorphemes: ['diru', '-dun'], correctSequence: ['diru', '-dun'], correctWord: 'dirudun', targetMeaning: 'wealthy (having money)' },
  { initialMorphemes: ['diru', '-gabe'], correctSequence: ['diru', '-gabe'], correctWord: 'dirugabe', targetMeaning: 'without money' },
  { initialMorphemes: ['auto', '-z'], correctSequence: ['auto', '-z'], correctWord: 'autoz', targetMeaning: 'by car' },
];

const MorphemeTile = ({
  morpheme,
  onClick,
  disabled,
  variant = "root"
}: {
  morpheme: string;
  onClick: () => void;
  disabled: boolean;
  variant?: "root" | "suffix"
}) => (
  <Button
    variant="secondary"
    size="lg"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "text-xl font-bold transition-all h-14 px-6 border-b-4 active:border-b-0 active:translate-y-px shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95",
      variant === "root"
        ? "bg-white border-basque-green/30 text-basque-green hover:bg-basque-stone"
        : "bg-basque-red/10 border-basque-red/30 text-basque-red hover:bg-basque-red/20",
      "font-code rounded-xl"
    )}
  >
    {morpheme}
  </Button>
);

const getDisplayWord = (morphemes: string[]): string => {
  let word = morphemes.join('').replace(/-/g, '');

  if (word.endsWith('aari')) {
    word = word.replace(/aari$/, 'ari');
  } else if (word.endsWith('aak')) {
    word = word.replace(/aak$/, 'ak');
  } else if (word.endsWith('aekin')) {
    word = word.replace(/aekin$/, 'arekin');
  } else if (word.endsWith('aan')) {
    word = word.replace(/aan$/, 'an');
  } else if (word.endsWith('aatik')) {
      word = word.replace(/aatik$/, 'atik');
  } else if (word.match(/[eiou]ara$/)) {
    word = word.slice(0, -3) + word.slice(-2);
  } else if (word.endsWith('aara')) {
    word = word.replace(/aara$/, 'ara');
  } else if (word.endsWith('akk')) {
    word = word.replace(/akk$/, 'ek');
  } else if (word.endsWith('aa')) {
    word = word.slice(0, -1);
  } else {
      const rDoublingRegex = /(ur|ar)a([knr])/;
      if (rDoublingRegex.test(word)) {
        word = word.replace(rDoublingRegex, '$1ra$2');
      }
  }
  
  return word;
};


export function MorphemeConstructor() {
  const [shuffledChallenges, setShuffledChallenges] = useState(challenges);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAudioPending, startAudioTransition] = useTransition();
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});

  const currentChallenge = useMemo(() => shuffledChallenges[challengeIndex], [shuffledChallenges, challengeIndex]);

  useEffect(() => {
    setShuffledChallenges(prev => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  const resetBoard = useCallback(() => {
    setConstructed([]);
    setFeedback(null);
  }, []);

  useEffect(() => {
    resetBoard();
  }, [currentChallenge, resetBoard]);
 
  const availableMorphemes = useMemo(() => {
    if (!currentChallenge) return [];
    
    const constructedCounts = constructed.reduce((acc, m) => {
      acc[m] = (acc[m] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const initialCounts = currentChallenge.initialMorphemes.reduce((acc, m) => {
      acc[m] = (acc[m] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(initialCounts).flatMap(morpheme => {
      const usedCount = constructedCounts[morpheme] || 0;
      const availableCount = initialCounts[morpheme] - usedCount;
      return Array(availableCount > 0 ? availableCount : 0).fill(morpheme);
    }).sort(() => Math.random() - 0.5);
  }, [currentChallenge, constructed]);

  const handleTileInteraction = (morpheme: string, fromPalette: boolean, index?: number) => {
    if (feedback === 'correct') return;
    setFeedback(null);

    if (fromPalette) {
      setConstructed(prev => [...prev, morpheme]);
    } else if (index !== undefined) {
      setConstructed(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleCheck = () => {
    if(!currentChallenge) return;
    const isCorrect = JSON.stringify(constructed) === JSON.stringify(currentChallenge.correctSequence);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) handlePlayAudio(currentChallenge.correctWord);
  };
  
  const handleNext = () => {
    const nextIndex = challengeIndex + 1;
    if (nextIndex >= shuffledChallenges.length) {
      setShuffledChallenges(prev => [...prev].sort(() => Math.random() - 0.5));
      setChallengeIndex(0);
    } else {
      setChallengeIndex(nextIndex);
    }
    resetBoard();
  };

  const handlePlayAudio = (word: string) => {
    if (isAudioPending) return;

    if (audioCache[word]) {
      new Audio(audioCache[word]).play().catch(() => {});
      return;
    }

    startAudioTransition(async () => {
      const formData = new FormData();
      formData.append('text', word);
      const response = await getSpeech(null, formData);
      if (response.data?.audioDataUri) {
        const audioDataUri = response.data.audioDataUri;
        setAudioCache(prev => ({ ...prev, [word]: audioDataUri }));
        new Audio(audioDataUri).play().catch(() => {});
      }
    });
  };

  if (!currentChallenge) {
    return <div>Loading challenges...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-t-8 border-t-basque-green shadow-2xl overflow-hidden bg-basque-stone/30">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-basque-green/60">
                Constructional Entrenchment
            </Badge>
          </div>
          <CardTitle className="text-3xl font-black text-basque-earth">
            "{currentChallenge.targetMeaning}"
          </CardTitle>
          <CardDescription className="text-base">
            Assemble the building blocks of the word
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-3 p-6 min-h-[120px] rounded-2xl border-4 border-dashed transition-all duration-300",
              feedback === 'correct' ? 'bg-green-100/50 border-green-500 shadow-inner' : 'bg-white/50 border-gray-200',
              feedback === 'incorrect' && 'bg-red-100/50 border-red-500 animate-in shake'
            )}
          >
            {constructed.map((m, i) => (
              <div key={`${m}-${i}`} className="animate-in zoom-in-50 duration-200">
                <MorphemeTile 
                  morpheme={m} 
                  onClick={() => handleTileInteraction(m, false, i)} 
                  disabled={feedback === 'correct'} 
                  variant={m.startsWith('-') ? "suffix" : "root"} 
                />
              </div>
            ))}
            {constructed.length === 0 && (
              <p className="text-gray-400 italic font-medium animate-pulse">
                Build the word here...
              </p>
            )}
          </div>

          <div className="h-12 flex items-center justify-center">
            {constructed.length > 0 && (
              <div className="flex items-center gap-3 px-6 py-2 bg-basque-green/5 rounded-full border border-basque-green/10 animate-in fade-in slide-in-from-bottom-2">
                <span className="text-xs font-bold text-basque-green/60 uppercase tracking-tighter">Result</span>
                <span className="text-2xl font-bold text-basque-green tracking-tight font-code">
                  {getDisplayWord(constructed)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center content-start gap-4 py-6 border-y border-gray-100 min-h-[160px]">
            {availableMorphemes.map((m, i) => (
              <div key={`${m}-${i}`} className="animate-in fade-in zoom-in-90">
                <MorphemeTile
                  morpheme={m}
                  variant={m.startsWith('-') ? "suffix" : "root"}
                  onClick={() => handleTileInteraction(m, true)}
                  disabled={feedback === 'correct'}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="ghost" size="lg" onClick={resetBoard}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
            
            {feedback !== 'correct' ? (
              <Button
                size="lg"
                className="bg-basque-earth hover:bg-black text-white px-8 shadow-lg"
                disabled={constructed.length === 0}
                onClick={handleCheck}
              >
                Check Construction
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-basque-green hover:bg-green-700 text-white px-10 animate-bounce shadow-lg"
                onClick={handleNext}
              >
                Next Word <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {feedback === 'incorrect' && (
        <p className="text-center text-basque-red font-bold animate-in fade-in">
          Not quite! Check the order. Remember: Root + Suffixes.
        </p>
      )}
    </div>
  );
}
