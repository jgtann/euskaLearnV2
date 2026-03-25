'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  XCircle, 
  BrainCircuit, 
  Zap,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Unlock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { SENTENCE_CHALLENGES } from '@/lib/sentence-challenges';
import { WORLDS } from '@/lib/lego-data';
import { useRouter } from 'next/navigation';

interface SentenceBuilderProps {
  worldId: string;
}

export function SentenceBuilder({ worldId }: SentenceBuilderProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [sessionChallenges, setSessionChallenges] = useState<typeof SENTENCE_CHALLENGES>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [isGateUnlocked, setIsGateUnlocked] = useState(false);

  const userItemsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'user_learning_items');
  }, [user, firestore]);
  const { data: userItems } = useCollection(userItemsQuery);

  const currentWorldIndex = WORLDS.findIndex(w => w.id === worldId);
  const nextWorld = WORLDS[currentWorldIndex + 1];

  // Initialize session challenges filtered by worldId
  useEffect(() => {
    const worldChallenges = SENTENCE_CHALLENGES.filter(c => c.world === worldId);
    setSessionChallenges(worldChallenges);
    setCurrentIdx(0);
    setFeedback(null);
  }, [worldId]);

  const current = sessionChallenges[currentIdx];

  // Initialize palette when challenge changes
  useEffect(() => {
    if (current) {
      setPalette([...current.correct].sort(() => Math.random() - 0.5));
      setConstructed([]);
      setFeedback(null);
    }
  }, [current]);

  const updateSRS = (success: boolean) => {
    if (!user || !firestore || !current) return;
    
    const docId = `syntax_${current.id}`;
    const docRef = doc(firestore, 'users', user.uid, 'user_learning_items', docId);
    
    setDocumentNonBlocking(docRef, {
      id: docId,
      userId: user.uid,
      learningItemId: current.id,
      lastReviewed: Date.now(),
      nextReview: Date.now() + (success ? 24 * 60 * 60 * 1000 : 0),
      level: success ? 1 : 0,
      type: 'syntax_workshop',
      world: current.world
    }, { merge: true });
  };

  const checkBuild = () => {
    if (!current) return;
    if (constructed.length < current.correct.length) {
      toast({
        variant: "destructive",
        title: "Incomplete Sentence",
        description: "Snap all the bricks to test the engine!",
      });
      return;
    }

    const isCorrect = constructed.join(' ') === current.correct.join(' ');
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateSRS(isCorrect);

    if (isCorrect) {
      setSuccessCount(prev => {
        const next = prev + 1;
        if (next >= 5) setIsGateUnlocked(true);
        return next;
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < sessionChallenges.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setCurrentIdx(0);
    }
    setFeedback(null);
  };

  const handleReset = () => {
    if (!current) return;
    setPalette([...current.correct].sort(() => Math.random() - 0.5));
    setConstructed([]);
    setFeedback(null);
  };

  const handleGoToNextWorld = () => {
    if (nextWorld) {
      router.push(`/learn?world=${nextWorld.id}&tab=input`);
    }
  };

  if (!current && sessionChallenges.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-2">
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No challenges found for this world.</p>
      </Card>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="px-4 py-2 bg-muted/50 rounded-xl border flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
           <Trophy className={cn("size-4", isGateUnlocked ? "text-yellow-600" : "text-muted-foreground")} />
           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mastery Gate</span>
        </div>
        <div className="flex-1 max-w-[200px] flex items-center gap-2">
           <Progress value={Math.min((successCount / 5) * 100, 100)} className="h-1.5" />
           <span className="text-[10px] font-black">{successCount}/5</span>
        </div>
      </div>

      <Card className={cn(
        "border-t-8 transition-all duration-700 shadow-2xl overflow-hidden",
        feedback === 'correct' ? "border-t-basque-green bg-green-50/20" : 
        feedback === 'incorrect' ? "border-t-basque-red bg-red-50/20" : 
        "border-t-primary bg-basque-stone/10"
      )}>
        <CardHeader className="text-center pb-2">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary border-primary/20 px-3">
              {current.type}
            </Badge>
            {isGateUnlocked && (
              <Badge className="bg-yellow-600 text-white animate-pulse uppercase tracking-widest text-[9px] px-3">
                Next World Unlocked
              </Badge>
            )}
          </div>
          <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-black mb-1">Mission Objective</CardTitle>
          <div className="text-3xl font-black text-basque-earth tracking-tight leading-tight">"{current.english}"</div>
        </CardHeader>
        
        <CardContent className="space-y-10 p-10">
          
          {feedback === 'correct' ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-4 text-basque-green font-black text-5xl uppercase tracking-tighter">
                  <Sparkles className="size-10 text-yellow-500" />
                  ZORIONAK!
                  <Sparkles className="size-10 text-yellow-500" />
                </div>
              </div>
              
              <div className="w-full flex flex-wrap items-center justify-center gap-3 p-10 bg-white rounded-3xl border-4 border-basque-green shadow-xl">
                {current.correct.map((word, i) => {
                  const highlight = current.highlights?.[word];
                  return (
                    <div key={i} className="h-14 px-8 bg-white border-2 border-basque-green/30 border-b-8 border-b-basque-green/60 font-black text-2xl rounded-2xl flex items-center justify-center">
                      {highlight ? (
                        <>
                          <span className="text-basque-earth">{highlight[0]}</span>
                          <span className="text-primary">{highlight[1]}</span>
                        </>
                      ) : (
                        <span className="text-basque-green">{word}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-basque-green/10 p-8 rounded-2xl border-2 border-dashed border-basque-green/30">
                <div className="flex items-center gap-2 mb-4 text-basque-green font-black text-xs uppercase tracking-widest">
                   <Zap className="size-5" /> Master Builder Logic
                </div>
                <p className="text-base leading-relaxed text-basque-earth font-medium">
                  {current.meaning}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                 {isGateUnlocked && nextWorld && (
                   <div className="p-6 bg-yellow-600 rounded-2xl text-white shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                         <Unlock className="size-8" />
                         <h3 className="text-xl font-black uppercase tracking-tight">Mastery Gate Cleared!</h3>
                      </div>
                      <div className="flex gap-3">
                         <Button onClick={handleGoToNextWorld} className="flex-1 bg-white text-yellow-700 hover:bg-basque-stone font-black h-14">
                            Go to {nextWorld.title} <ArrowRight className="ml-2 size-5" />
                         </Button>
                         <Button onClick={handleNext} variant="outline" className="flex-1 border-white text-white hover:bg-white/10 font-bold h-14">
                            Stay Here
                         </Button>
                      </div>
                   </div>
                 )}
                 {!isGateUnlocked && (
                    <Button size="lg" className="bg-basque-green hover:bg-green-700 w-full h-20 text-2xl font-black rounded-3xl shadow-xl" onClick={handleNext}>
                        Next Build <ArrowRight className="ml-3 size-8" />
                    </Button>
                 )}
              </div>
            </div>
          ) : feedback === 'incorrect' ? (
            <div className="space-y-8 animate-in shake duration-500">
              <div className="flex flex-col items-center justify-center gap-3 text-basque-red">
                <div className="flex items-center gap-4 font-black text-4xl uppercase tracking-tighter">
                  <XCircle className="size-10" /> FRICTION DETECTED <XCircle className="size-10" />
                </div>
              </div>
              <div className="w-full flex flex-wrap items-center justify-center gap-3 p-10 bg-white rounded-3xl border-4 border-basque-red shadow-xl">
                {constructed.map((word, i) => (
                  <div key={i} className="h-14 px-8 bg-white border-2 border-basque-red/30 border-b-8 border-b-basque-red/60 font-black text-2xl rounded-2xl flex items-center justify-center text-basque-red opacity-60">
                    {word}
                  </div>
                ))}
              </div>
              <div className="bg-basque-red/10 p-8 rounded-2xl border-2 border-dashed border-basque-red/30">
                <p className="text-base leading-relaxed text-basque-earth font-medium">
                  The bricks aren't snapping! Remember, Basque often uses SOV order: Subject - Object - Verb.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <Button size="lg" variant="outline" className="px-12 h-16 font-black" onClick={handleReset}>
                  <RotateCcw className="mr-2" /> Try Again
                </Button>
                <Button size="lg" className="px-12 h-16 font-black" onClick={handleNext}>
                  Skip <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-center gap-3 p-10 min-h-[200px] rounded-3xl border-4 border-dashed bg-white/50 border-muted-foreground/20">
                  {constructed.map((word, i) => (
                    <Button key={i} variant="outline" className="h-14 px-8 font-black border-b-4 text-xl rounded-2xl" onClick={() => {
                      setConstructed(prev => prev.filter((_, idx) => idx !== i));
                      setPalette(prev => [...prev, word]);
                    }}>
                        {word}
                    </Button>
                  ))}
                  {constructed.length === 0 && <p className="opacity-20 italic">Snap bricks here...</p>}
              </div>
              <div className="flex flex-wrap justify-center gap-3 p-8 bg-muted/20 rounded-3xl border-2 border-dashed">
                  {palette.map((word, i) => (
                    <Button key={i} variant="secondary" className="h-14 px-8 font-black bg-white border-b-4 text-xl rounded-2xl" onClick={() => {
                      setConstructed(prev => [...prev, word]);
                      setPalette(prev => prev.filter((_, idx) => idx !== i));
                    }}>
                        {word}
                    </Button>
                  ))}
              </div>
              <div className="flex justify-center gap-4 pt-4 border-t">
                <Button variant="ghost" onClick={handleReset} className="font-bold">Reset</Button>
                <Button size="lg" className="bg-basque-earth hover:bg-black text-white px-12 h-16 text-xl font-black rounded-2xl" onClick={checkBuild} disabled={constructed.length === 0}>
                  Snap Bricks & Test
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
