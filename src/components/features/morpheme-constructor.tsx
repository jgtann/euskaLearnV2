'use client';

import { useState, useMemo, useEffect, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RefreshCw, ArrowRight, BrainCircuit, Loader2, Volume2 } from 'lucide-react';
import { getSpeech } from '@/app/actions/speech';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

const challenges = [
  { id: 'm-1', initialMorphemes: ['txakur', '-a', '-k'], correctSequence: ['txakur', '-a', '-k'], correctWord: 'txakurrak', targetMeaning: 'the dog (subject)' },
  { id: 'm-2', initialMorphemes: ['etxe', '-a', '-ra'], correctSequence: ['etxe', '-a', '-ra'], correctWord: 'etxera', targetMeaning: 'to the house' },
  { id: 'm-3', initialMorphemes: ['etxe', '-a'], correctSequence: ['etxe', '-a'], correctWord: 'etxea', targetMeaning: 'the house' },
  { id: 'm-4', initialMorphemes: ['gizon', '-ak'], correctSequence: ['gizon', '-ak'], correctWord: 'gizonak', targetMeaning: 'the men' },
  { id: 'm-5', initialMorphemes: ['emakume', '-a', '-ri'], correctSequence: ['emakume', '-a', '-ri'], correctWord: 'emakumeari', targetMeaning: 'to the woman' },
  { id: 'm-6', initialMorphemes: ['liburu', '-a'], correctSequence: ['liburu', '-a'], correctWord: 'liburua', targetMeaning: 'the book' },
  { id: 'm-7', initialMorphemes: ['aita', '-ak'], correctSequence: ['aita', '-ak'], correctWord: 'aitak', targetMeaning: 'the fathers' },
  { id: 'm-8', initialMorphemes: ['alaba', '-ak'], correctSequence: ['alaba', '-ak'], correctWord: 'alabak', targetMeaning: 'the daughters' },
  { id: 'm-9', initialMorphemes: ['haur', '-ak'], correctSequence: ['haur', '-ak'], correctWord: 'haurrak', targetMeaning: 'the children' },
  { id: 'm-10', initialMorphemes: ['hiri', '-a', '-n'], correctSequence: ['hiri', '-a', '-n'], correctWord: 'hirian', targetMeaning: 'in the city' },
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
  if (word.endsWith('aari')) word = word.replace(/aari$/, 'ari');
  else if (word.endsWith('aak')) word = word.replace(/aak$/, 'ak');
  else if (word.endsWith('aekin')) word = word.replace(/aekin$/, 'arekin');
  else if (word.endsWith('aan')) word = word.replace(/aan$/, 'an');
  else if (word.endsWith('aatik')) word = word.replace(/aatik$/, 'atik');
  else if (word.match(/[eiou]ara$/)) word = word.slice(0, -3) + word.slice(-2);
  else if (word.endsWith('aara')) word = word.replace(/aara$/, 'ara');
  else if (word.endsWith('akk')) word = word.replace(/akk$/, 'ek');
  else if (word.endsWith('aa')) word = word.slice(0, -1);
  else {
    const rDoublingRegex = /(ur|ar)a([knr])/;
    if (rDoublingRegex.test(word)) word = word.replace(rDoublingRegex, '$1ra$2');
  }
  return word;
};

export function MorphemeConstructor() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAudioPending, startAudioTransition] = useTransition();
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const userItemsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'user_learning_items');
  }, [user, firestore]);
  const { data: userItems } = useCollection(userItemsQuery);

  const sortedChallenges = useMemo(() => {
    const now = Date.now();
    const records = userItems || [];
    const recordMap = new Map(records.map(r => [r.learningItemId, r]));

    return [...challenges].sort((a, b) => {
      const recA = recordMap.get(a.id);
      const recB = recordMap.get(b.id);
      const dueA = recA ? recA.nextReview : 0;
      const dueB = recB ? recB.nextReview : 0;
      if (dueA <= now && dueB > now) return -1;
      if (dueB <= now && dueA > now) return 1;
      return Math.random() - 0.5;
    });
  }, [userItems]);

  const currentChallenge = sortedChallenges[currentIdx];

  const resetBoard = useCallback(() => {
    setConstructed([]);
    setFeedback(null);
  }, []);

  useEffect(() => {
    resetBoard();
  }, [currentChallenge, resetBoard]);

  const availableMorphemes = useMemo(() => {
    if (!currentChallenge) return [];
    const constructedCounts = constructed.reduce((acc, m) => { acc[m] = (acc[m] || 0) + 1; return acc; }, {} as Record<string, number>);
    const initialCounts = currentChallenge.initialMorphemes.reduce((acc, m) => { acc[m] = (acc[m] || 0) + 1; return acc; }, {} as Record<string, number>);
    return Object.keys(initialCounts).flatMap(morpheme => {
      const available = initialCounts[morpheme] - (constructedCounts[morpheme] || 0);
      return Array(Math.max(0, available)).fill(morpheme);
    }).sort(() => Math.random() - 0.5);
  }, [currentChallenge, constructed]);

  const updateSRS = (success: boolean) => {
    if (!user || !firestore || !currentChallenge) return;
    const records = userItems || [];
    const record = records.find(r => r.learningItemId === currentChallenge.id);
    const level = record ? (success ? Math.min(record.level + 1, 5) : Math.max(record.level - 1, 0)) : (success ? 1 : 0);
    const intervals = [0, 1, 3, 7, 14, 30]; // Days
    const nextReview = Date.now() + (intervals[level] || 0) * 24 * 60 * 60 * 1000;
    
    const docId = record?.id || `${user.uid}_${currentChallenge.id}`;
    const docRef = doc(firestore, 'users', user.uid, 'user_learning_items', docId);
    
    setDocumentNonBlocking(docRef, {
      id: docId,
      userId: user.uid,
      learningItemId: currentChallenge.id,
      lastReviewed: Date.now(),
      nextReview,
      level,
      correctCount: (record?.correctCount || 0) + (success ? 1 : 0),
      incorrectCount: (record?.incorrectCount || 0) + (success ? 0 : 1),
    }, { merge: true });
  };

  const handleCheck = () => {
    const isCorrect = JSON.stringify(constructed) === JSON.stringify(currentChallenge.correctSequence);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateSRS(isCorrect);
    if (isCorrect) handlePlayAudio(currentChallenge.correctWord);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % sortedChallenges.length);
  };

  const handlePlayAudio = (word: string) => {
    if (isAudioPending) return;
    if (audioCache[word]) { new Audio(audioCache[word]).play().catch(() => {}); return; }
    startAudioTransition(async () => {
      const formData = new FormData();
      formData.append('text', word);
      const response = await getSpeech(null, formData);
      if (response.data?.audioDataUri) {
        setAudioCache(prev => ({ ...prev, [word]: response.data.audioDataUri }));
        new Audio(response.data.audioDataUri).play().catch(() => {});
      }
    });
  };

  if (!currentChallenge) return <div className="p-8 text-center">Loading construction site...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-t-8 border-t-basque-green shadow-2xl overflow-hidden bg-basque-stone/30">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-basque-green/60">
                Constructional Entrenchment
            </Badge>
            <div className="flex items-center gap-1">
              <BrainCircuit className="size-3 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground">SRS Active</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-basque-earth">"{currentChallenge.targetMeaning}"</CardTitle>
          <CardDescription>Assemble the building blocks of the word</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* RESULT BOX */}
          <div className={cn("flex flex-wrap items-center justify-center gap-3 p-6 min-h-[120px] rounded-2xl border-4 border-dashed transition-all", feedback === 'correct' ? 'bg-green-100/50 border-green-500 shadow-inner' : 'bg-white/50 border-gray-200', feedback === 'incorrect' && 'bg-red-100/50 border-red-500 animate-in shake')}>
            {constructed.map((m, i) => (
              <MorphemeTile key={`${m}-${i}`} morpheme={m} onClick={() => !feedback && setConstructed(prev => prev.filter((_, idx) => idx !== i))} disabled={feedback === 'correct'} variant={m.startsWith('-') ? "suffix" : "root"} />
            ))}
            {constructed.length === 0 && <p className="text-gray-400 italic">Start building...</p>}
          </div>

          {/* WORD RESULT PREVIEW */}
          <div className="h-12 flex items-center justify-center">
            {constructed.length > 0 && (
              <div className="flex items-center gap-3 px-6 py-2 bg-basque-green/5 rounded-full border border-basque-green/10">
                <span className="text-2xl font-bold text-basque-green font-code">{getDisplayWord(constructed)}</span>
              </div>
            )}
          </div>

          {/* PALETTE */}
          <div className="flex flex-wrap justify-center content-start gap-4 py-6 border-y border-gray-100 min-h-[160px]">
            {availableMorphemes.map((m, i) => (
              <MorphemeTile key={`${m}-${i}`} morpheme={m} variant={m.startsWith('-') ? "suffix" : "root"} onClick={() => setConstructed(prev => [...prev, m])} disabled={feedback === 'correct'} />
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="ghost" onClick={resetBoard}><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
            {feedback !== 'correct' ? (
              <Button size="lg" className="bg-basque-earth hover:bg-black text-white px-8" disabled={constructed.length === 0} onClick={handleCheck}>Check</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handlePlayAudio(currentChallenge.correctWord)} disabled={isAudioPending}>
                  {isAudioPending ? <Loader2 className="size-5 animate-spin" /> : <Volume2 className="size-5" />}
                </Button>
                <Button size="lg" className="bg-basque-green hover:bg-green-700 text-white px-10" onClick={handleNext}>Next <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {feedback === 'incorrect' && <p className="text-center text-basque-red font-bold animate-in fade-in">Try again! Remember: Root + Suffixes.</p>}
    </div>
  );
}
