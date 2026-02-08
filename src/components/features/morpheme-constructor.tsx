'use client';

import { useState, useMemo, useEffect, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, RefreshCw, Sparkles, ThumbsUp, XCircle, Shuffle, Volume2, Loader2, ArrowRight } from 'lucide-react';
import { getSpeech } from '@/app/actions/speech';
import { useToast } from '@/hooks/use-toast';

const challenges = [
  { initialMorphemes: ['-a', 'txakur', '-k'], correctSequence: ['txakur', '-a', '-k'], correctWord: 'txakurrak', targetMeaning: 'the dog (subject)', type: 'Ergative' },
  { initialMorphemes: ['etxe', '-a'], correctSequence: ['etxe', '-a'], correctWord: 'etxea', targetMeaning: 'the house', type: 'Absolutive' },
  { initialMorphemes: ['-ak', 'gizon'], correctSequence: ['gizon', '-ak'], correctWord: 'gizonak', targetMeaning: 'the men', type: 'Absolutive' },
  { initialMorphemes: ['-ri', 'emakume', '-a'], correctSequence: ['emakume', '-a', '-ri'], correctWord: 'emakumeari', targetMeaning: 'to the woman', type: 'Dative' },
  { initialMorphemes: ['liburu', '-a'], correctSequence: ['liburu', '-a'], correctWord: 'liburua', targetMeaning: 'the book', type: 'Absolutive' },
  { initialMorphemes: ['-ak', 'aita'], correctSequence: ['aita', '-ak'], correctWord: 'aitak', targetMeaning: 'the fathers', type: 'Absolutive' },
  { initialMorphemes: ['haur', '-ak'], correctSequence: ['haur', '-ak'], correctWord: 'haurrak', targetMeaning: 'the children', type: 'Absolutive' },
  { initialMorphemes: ['-n', 'hiri', '-a'], correctSequence: ['hiri', '-a', '-n'], correctWord: 'hirian', targetMeaning: 'in the city', type: 'Inessive' },
  { initialMorphemes: ['-a', 'mahai'], correctSequence: ['mahai', '-a'], correctWord: 'mahaia', targetMeaning: 'the table', type: 'Absolutive' },
  { initialMorphemes: ['lan', '-a'], correctSequence: ['lan', '-a'], correctWord: 'lana', targetMeaning: 'the work', type: 'Absolutive' },
  { initialMorphemes: ['auto', '-a'], correctSequence: ['auto', '-a'], correctWord: 'autoa', targetMeaning: 'the car', type: 'Absolutive' },
  { initialMorphemes: ['janari', '-a'], correctSequence: ['janari', '-a'], correctWord: 'janaria', targetMeaning: 'the food', type: 'Absolutive' },
  { initialMorphemes: ['diru', '-a'], correctSequence: ['diru', '-a'], correctWord: 'dirua', targetMeaning: 'the money', type: 'Absolutive' },
  { initialMorphemes: ['-ak', 'etxe'], correctSequence: ['etxe', '-ak'], correctWord: 'etxeak', targetMeaning: 'the houses', type: 'Absolutive' },
  { initialMorphemes: ['-ak', 'liburu'], correctSequence: ['liburu', '-ak'], correctWord: 'liburuak', targetMeaning: 'the books', type: 'Absolutive' },
  { initialMorphemes: ['lagun', '-ak'], correctSequence: ['lagun', '-ak'], correctWord: 'lagunak', targetMeaning: 'the friends', type: 'Absolutive' },
  { initialMorphemes: ['-n', 'eskola', '-a'], correctSequence: ['eskola', '-a', '-n'], correctWord: 'eskolan', targetMeaning: 'in the school', type: 'Inessive' },
  { initialMorphemes: ['-ri', 'gizon', '-a'], correctSequence: ['gizon', '-a', '-ri'], correctWord: 'gizonari', targetMeaning: 'to the man', type: 'Dative' },
  { initialMorphemes: ['lagun', '-a', '-ri'], correctSequence: ['lagun', '-a', '-ri'], correctWord: 'lagunari', targetMeaning: 'to the friend', type: 'Dative' },
  { initialMorphemes: ['-ekin', 'lagun', '-a'], correctSequence: ['lagun', '-a', '-ekin'], correctWord: 'lagunarekin', targetMeaning: 'with the friend', type: 'Comitative' },
  { initialMorphemes: ['etxe', '-tik'], correctSequence: ['etxe', '-tik'], correctWord: 'etxetik', targetMeaning: 'from the house', type: 'Ablative' },
  { initialMorphemes: ['-ra', 'etxe'], correctSequence: ['etxe', '-ra'], correctWord: 'etxera', targetMeaning: 'to the house', type: 'Adlative' },
  { initialMorphemes: ['-ko', 'hiri'], correctSequence: ['hiri', '-ko'], correctWord: 'hiriko', targetMeaning: 'of the city', type: 'Genitive' },
  { initialMorphemes: ['-a', 'begi'], correctSequence: ['begi', '-a'], correctWord: 'begia', targetMeaning: 'the eye', type: 'Absolutive' },
  { initialMorphemes: ['esku', '-ak'], correctSequence: ['esku', '-ak'], correctWord: 'eskuak', targetMeaning: 'the hands', type: 'Absolutive' },
  { initialMorphemes: ['-ak', 'ama'], correctSequence: ['ama', '-ak'], correctWord: 'amak', targetMeaning: 'the mothers', type: 'Absolutive' },
  { initialMorphemes: ['seme', '-a'], correctSequence: ['seme', '-a'], correctWord: 'semea', targetMeaning: 'the son', type: 'Absolutive' },
  { initialMorphemes: ['alaba', '-a'], correctSequence: ['alaba', '-a'], correctWord: 'alaba', targetMeaning: 'the daughter', type: 'Absolutive' },
  { initialMorphemes: ['-tik', 'auto', '-a'], correctSequence: ['auto', '-a', '-tik'], correctWord: 'autotik', targetMeaning: 'from the car', type: 'Ablative' },
  { initialMorphemes: ['-ra', 'eskola', '-a'], correctSequence: ['eskola', '-a', '-ra'], correctWord: 'eskolara', targetMeaning: 'to the school', type: 'Adlative' },
  { initialMorphemes: ['-n', 'urte', '-a'], correctSequence: ['urte', '-a', '-n'], correctWord: 'urtean', targetMeaning: 'in the year', type: 'Inessive' },
  { initialMorphemes: ['-n', 'egun', '-a'], correctSequence: ['egun', '-a', '-n'], correctWord: 'egunean', targetMeaning: 'in the day', type: 'Inessive' },
  { initialMorphemes: ['-n', 'bizitza', '-a'], correctSequence: ['bizitza', '-a', '-n'], correctWord: 'bizitzan', targetMeaning: 'in life', type: 'Inessive' },
  { initialMorphemes: ['-n', 'leku', '-a'], correctSequence: ['leku', '-a', '-n'], correctWord: 'lekuan', targetMeaning: 'in the place', type: 'Inessive' },
  { initialMorphemes: ['arazo', '-a'], correctSequence: ['arazo', '-a'], correctWord: 'arazoa', targetMeaning: 'the problem', type: 'Absolutive' },
  { initialMorphemes: ['arazo', '-ak'], correctSequence: ['arazo', '-ak'], correctWord: 'arazoak', targetMeaning: 'the problems', type: 'Absolutive' },
  { initialMorphemes: ['-n', 'aste', '-a'], correctSequence: ['aste', '-a', '-n'], correctWord: 'astean', targetMeaning: 'in the week', type: 'Inessive' },
  { initialMorphemes: ['puntu', '-a'], correctSequence: ['puntu', '-a'], correctWord: 'puntua', targetMeaning: 'the point', type: 'Absolutive' },
  { initialMorphemes: ['-n', 'talde', '-a'], correctSequence: ['talde', '-a', '-n'], correctWord: 'taldean', targetMeaning: 'in the group', type: 'Inessive' },
  { initialMorphemes: ['-n', 'mundu', '-a'], correctSequence: ['mundu', '-a', '-n'], correctWord: 'munduan', targetMeaning: 'in the world', type: 'Inessive' },
  { initialMorphemes: ['galdera', '-a'], correctSequence: ['galdera', '-a'], correctWord: 'galdera', targetMeaning: 'the question', type: 'Absolutive' },
  { initialMorphemes: ['galdera', '-ak'], correctSequence: ['galdera', '-ak'], correctWord: 'galderak', targetMeaning: 'the questions', type: 'Absolutive' },
  { initialMorphemes: ['-ri', 'aita', '-a'], correctSequence: ['aita', '-a', '-ri'], correctWord: 'aitari', targetMeaning: 'to the father', type: 'Dative' },
  { initialMorphemes: ['-ri', 'ama', '-a'], correctSequence: ['ama', '-a', '-ri'], correctWord: 'amari', targetMeaning: 'to the mother', type: 'Dative' },
  { initialMorphemes: ['-ak', 'seme'], correctSequence: ['seme', '-ak'], correctWord: 'semeak', targetMeaning: 'the sons', type: 'Absolutive' },
  { initialMorphemes: ['-ak', 'alaba'], correctSequence: ['alaba', '-ak'], correctWord: 'alabak', targetMeaning: 'the daughters', type: 'Absolutive' },
  { initialMorphemes: ['-tik', 'hiri', '-a'], correctSequence: ['hiri', '-a', '-tik'], correctWord: 'hiritik', targetMeaning: 'from the city', type: 'Ablative' },
  { initialMorphemes: ['-ra', 'hiri', '-a'], correctSequence: ['hiri', '-a', '-ra'], correctWord: 'hirira', targetMeaning: 'to the city', type: 'Adlative' },
  { initialMorphemes: ['-tik', 'eskola', '-a'], correctSequence: ['eskola', '-a', '-tik'], correctWord: 'eskolatik', targetMeaning: 'from the school', type: 'Ablative' },
  { initialMorphemes: ['-ekin', 'gizon', '-a'], correctSequence: ['gizon', '-a', '-ekin'], correctWord: 'gizonarekin', targetMeaning: 'with the man', type: 'Comitative' },
  { initialMorphemes: ['-ekin', 'emakume', '-a'], correctSequence: ['emakume', '-a', '-ekin'], correctWord: 'emakumearekin', targetMeaning: 'with the woman', type: 'Comitative' },
  { initialMorphemes: ['-dun', 'diru'], correctSequence: ['diru', '-dun'], correctWord: 'dirudun', targetMeaning: 'wealthy (having money)', type: 'Attribute' },
  { initialMorphemes: ['-gabe', 'diru'], correctSequence: ['diru', '-gabe'], correctWord: 'dirugabe', targetMeaning: 'without money', type: 'Attribute' },
  { initialMorphemes: ['-z', 'auto'], correctSequence: ['auto', '-z'], correctWord: 'autoz', targetMeaning: 'by car', type: 'Instrumental' },
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

export function MorphemeConstructor() {
  const [shuffledChallenges, setShuffledChallenges] = useState(challenges);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAudioPending, startAudioTransition] = useTransition();
  const { toast } = useToast();

  const currentChallenge = useMemo(() => shuffledChallenges[challengeIndex], [shuffledChallenges, challengeIndex]);
  const [availableMorphemes, setAvailableMorphemes] = useState<string[]>([]);

  useEffect(() => {
    // This runs once on mount to shuffle the initial list of challenges.
    handleShuffleList();
  }, []);

  const resetBoard = useCallback(() => {
    if (currentChallenge) {
      setConstructed([]);
      setFeedback(null);
      setAvailableMorphemes([...currentChallenge.initialMorphemes].sort(() => Math.random() - 0.5));
    }
  }, [currentChallenge]);

  useEffect(() => {
    resetBoard();
  }, [currentChallenge, resetBoard]);
  
  const handleShuffleList = () => {
    setShuffledChallenges([...challenges].sort(() => Math.random() - 0.5));
    setChallengeIndex(0);
  };
  
  const handleTileInteraction = (morpheme: string, fromPalette: boolean, index?: number) => {
    if (feedback === 'correct') return;
    setFeedback(null);

    if (fromPalette) {
      setConstructed(prev => [...prev, morpheme]);
      setAvailableMorphemes(prev => {
        const indexToRemove = prev.indexOf(morpheme);
        if (indexToRemove > -1) {
          const newAvailable = [...prev];
          newAvailable.splice(indexToRemove, 1);
          return newAvailable;
        }
        return prev;
      });
    } else if (index !== undefined) {
      const removedMorpheme = constructed[index];
      setConstructed(prev => prev.filter((_, i) => i !== index));
      setAvailableMorphemes(prev => [...prev, removedMorpheme]);
    }
  };

  const handleCheck = () => {
    if(!currentChallenge) return;
    const isCorrect = JSON.stringify(constructed) === JSON.stringify(currentChallenge.correctSequence);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) handlePlayAudio(currentChallenge.correctWord);
  };
  
  const handleNext = () => {
    if (challengeIndex === shuffledChallenges.length - 1) {
      handleShuffleList();
    } else {
      setChallengeIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePlayAudio = (word: string) => {
    if (isAudioPending) return;
    startAudioTransition(async () => {
      const formData = new FormData();
      formData.append('text', word);
      const response = await getSpeech(null, formData);
      if (response.data?.audioDataUri) {
        new Audio(response.data.audioDataUri).play();
      } else {
         toast({
            variant: "destructive",
            title: "Audio Error",
            description: response.error || "Could not generate audio.",
        });
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
             <Badge className="bg-basque-red text-white border-none">{currentChallenge.type}</Badge>
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
              "flex flex-wrap items-center justify-center gap-3 p-6 min-h-[100px] rounded-2xl border-4 border-dashed transition-all duration-500",
              feedback === 'correct' && 'bg-green-100 border-green-500 animate-in fade-in',
              feedback === 'incorrect' && 'bg-red-100 border-red-500 animate-in shake',
              !feedback && 'bg-white/50 border-gray-200'
            )}
          >
            {constructed.map((m, i) => (
              <button
                key={i}
                onClick={() => handleTileInteraction(m, false, i)}
                className="animate-in zoom-in-75 duration-200"
              >
                <MorphemeTile morpheme={m} onClick={() => {}} disabled={feedback === 'correct'} variant={m.startsWith('-') ? "suffix" : "root"} />
              </button>
            ))}
            {constructed.length === 0 && (
              <p className="text-gray-400 italic">Select tiles below...</p>
            )}
          </div>

          {constructed.length > 0 && (
            <div className="flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
               <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Result:</span>
               <span className="text-2xl font-code font-bold text-basque-green bg-white px-4 py-1 rounded-lg border shadow-sm">
                  {constructed.join('').replace(/-/g, '').replace(/aak$/, 'ak')}
               </span>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 py-6 border-y border-gray-100">
            {availableMorphemes.map((m, i) => (
              <MorphemeTile
                key={i}
                morpheme={m}
                variant={m.startsWith('-') ? "suffix" : "root"}
                onClick={() => handleTileInteraction(m, true)}
                disabled={feedback === 'correct'}
              />
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
        <p className="text-center text-basque-red font-bold animate-bounce">
          Try a different order! Remember: Root + Article + Case.
        </p>
      )}
    </div>
  );
}
