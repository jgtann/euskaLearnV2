'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, 
  Sparkles, 
  Boxes, 
  Zap, 
  Trophy,
  RefreshCw,
  Dices,
  Clock,
  XCircle,
  Repeat
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { FREQUENT_NOUNS, generateLegoLevels } from '@/lib/lego-data';
import { useRouter, useSearchParams } from 'next/navigation';

export function MorphemeConstructor() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentNounIdx, setCurrentNounIdx] = useState(0);
  const [levelIdx, setLevelIdx] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shuffledNouns, setShuffledNouns] = useState<typeof FREQUENT_NOUNS>([]);

  const userItemsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'user_learning_items');
  }, [user, firestore]);
  const { data: userItems, isLoading: isLoadingSRS } = useCollection(userItemsQuery);

  useEffect(() => {
    if (userItems && shuffledNouns.length === 0) {
      const records = userItems || [];
      const recordMap = new Map(records.filter(r => r.type === 'lego_workshop').map(r => [r.learningItemId.toLowerCase(), r]));
      const now = Date.now();

      const newNouns: any[] = [];
      const dueNouns: any[] = [];
      const seenNouns: any[] = [];

      FREQUENT_NOUNS.forEach(noun => {
        const record = recordMap.get(noun.basque.toLowerCase());
        if (!record) {
          newNouns.push(noun);
        } else if (record.nextReview <= now) {
          dueNouns.push(noun);
        } else {
          seenNouns.push(noun);
        }
      });

      const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

      setShuffledNouns([
        ...shuffle(newNouns),
        ...shuffle(dueNouns),
        ...shuffle(seenNouns)
      ]);
    }
  }, [userItems, shuffledNouns.length]);

  const currentNoun = shuffledNouns[currentNounIdx] || FREQUENT_NOUNS[0];
  const legoLevels = useMemo(() => generateLegoLevels(currentNoun), [currentNoun]);
  const currentLevel = legoLevels[levelIdx];

  useEffect(() => {
    handleReset();
  }, [levelIdx, currentNounIdx, currentNoun.basque]);

  const handleSnap = (brick: string) => {
    if (isCorrect) return;
    setIsError(false);
    setBuilt(prev => [...prev, brick]);
  };

  const handleReset = () => {
    setBuilt([]);
    setIsCorrect(false);
    setIsError(false);
  };

  const handleNextNoun = () => {
    setCurrentNounIdx(prev => (prev + 1) % (shuffledNouns.length || FREQUENT_NOUNS.length));
    setLevelIdx(0);
    handleReset();
  };

  const handleGoToBoss = () => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', 'sentence');
    router.push(`?${params.toString()}`);
  };

  const updateSRS = (isFinalLevel: boolean) => {
    if (!user || !firestore) return;
    
    const docId = `lego_noun_${currentNoun.basque.toLowerCase()}`;
    const record = (userItems || []).find(r => r.id === docId);
    
    let currentMastery = record?.level || 0;
    const newMastery = isFinalLevel ? Math.min(currentMastery + 1, 5) : currentMastery;
    
    const intervals = [0, 1, 3, 7, 14, 30];
    const nextReview = Date.now() + (intervals[newMastery] || 0) * 24 * 60 * 60 * 1000;

    const docRef = doc(firestore, 'users', user.uid, 'user_learning_items', docId);
    setDocumentNonBlocking(docRef, {
      id: docId,
      userId: user.uid,
      learningItemId: currentNoun.basque.toLowerCase(),
      lastReviewed: Date.now(),
      nextReview,
      level: newMastery,
      type: 'lego_workshop',
      world: currentNoun.world || 'names', // CRITICAL: Save world identifier for Dashboard
      currentWorkshopLevel: levelIdx + 1
    }, { merge: true });
  };

  const checkBuild = () => {
    if (built.length !== currentLevel.bricks.length) {
      toast({
        variant: "destructive",
        title: "Build Incomplete",
        description: "Snap all the bricks together to finish the module!"
      });
      return;
    }

    const correctSequence = currentLevel.bricks.map(b => b.text);
    const isSequenceCorrect = built.every((brick, index) => brick === correctSequence[index]);

    if (isSequenceCorrect) {
      setIsCorrect(true);
      setIsError(false);
      const isFinal = levelIdx === legoLevels.length - 1;
      updateSRS(isFinal);
    } else {
      setIsError(true);
      toast({
        variant: "destructive",
        title: "Build Error",
        description: "The bricks aren't snapping together in the right order. Try again!"
      });
    }
  };

  const RoleColors: Record<string, string> = {
    root: "bg-white border-basque-green/40 text-basque-green",
    article: "bg-blue-100 border-blue-300 text-blue-700",
    plural: "bg-purple-100 border-purple-300 text-purple-700",
    suffix: "bg-orange-100 border-orange-300 text-orange-700",
    gold: "bg-yellow-100 border-yellow-400 text-yellow-800 font-black shadow-inner",
    verb: "bg-basque-red/10 border-basque-red/30 text-basque-red"
  };

  if (isLoadingSRS && shuffledNouns.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center gap-4">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Sorting Bricks...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-4">
            <div className="flex gap-1">
            {legoLevels.map((_, i) => (
                <div 
                key={i} 
                className={cn(
                    "h-2 w-8 rounded-full transition-all duration-500",
                    i <= levelIdx ? "bg-basque-green" : "bg-muted"
                )} 
                />
            ))}
            </div>
            <Button variant="ghost" size="sm" onClick={handleNextNoun} className="h-8 text-[10px] uppercase font-bold tracking-widest">
                <Dices className="size-3 mr-1" /> New Base Brick
            </Button>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
          <Clock className="size-3" />
          Queue Position: {currentNounIdx + 1} / {shuffledNouns.length || FREQUENT_NOUNS.length}
        </div>
      </div>

      <Card className={cn(
        "border-t-8 shadow-xl transition-all duration-500 overflow-hidden",
        isCorrect ? "border-t-basque-green bg-green-50/20" : isError ? "border-t-basque-red bg-red-50/20 animate-shake" : "border-t-basque-green bg-basque-stone/20"
      )}>
        <CardHeader className="text-center">
          <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-basque-green/10 text-basque-green border-basque-green/20">
            Level {currentLevel.id}: {currentLevel.title}
          </Badge>
          <CardTitle className="text-2xl font-black text-basque-earth tracking-tight">
            {currentLevel.description}
          </CardTitle>
          <CardDescription className="italic font-medium">
            Building: "{currentLevel.translation}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          
          <div className={cn(
            "min-h-[140px] flex flex-wrap items-center justify-center gap-2 p-6 rounded-2xl border-4 border-dashed transition-all duration-500",
            isCorrect ? "bg-white border-basque-green shadow-xl" : isError ? "bg-white border-basque-red" : "bg-white/50 border-gray-200"
          )}>
            {built.map((b, i) => {
              const role = currentLevel.bricks.find(br => br.text === b)?.role || 'root';
              return (
                <div 
                  key={i} 
                  className={cn(
                    "px-6 py-3 rounded-xl border-b-4 text-xl font-black transition-all animate-in zoom-in-95 cursor-pointer",
                    RoleColors[role]
                  )}
                  onClick={() => {
                    if (!isCorrect) {
                      setBuilt(prev => prev.filter((_, idx) => idx !== i));
                      setIsError(false);
                    }
                  }}
                >
                  {b}
                </div>
              );
            })}
            {built.length === 0 && <p className="text-muted-foreground italic text-sm">Snap the first brick: "{currentNoun.basque}"</p>}
          </div>

          {isCorrect && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-basque-green font-black text-4xl uppercase tracking-tighter">
                  <Sparkles className="size-6 text-yellow-500 animate-bounce" />
                  Zorionak!
                  <Sparkles className="size-6 text-yellow-500 animate-bounce" />
                </div>
                <div className="flex items-center justify-center px-6 py-3 bg-white rounded-2xl border-2 border-basque-green/20 shadow-sm">
                  <span className="text-3xl font-black text-basque-green tracking-tight">
                    {currentLevel.target}
                  </span>
                </div>
              </div>
              
              <div className="bg-basque-green/5 p-4 rounded-xl border border-basque-green/20">
                <div className="flex items-center gap-2 mb-1 text-basque-green font-bold text-xs uppercase">
                   <Zap className="size-3" /> Master Builder Logic
                </div>
                <p className="text-sm leading-relaxed text-basque-earth font-medium">
                  {currentLevel.logic}
                </p>
              </div>

              <div className="grid gap-3 pt-4 border-t border-basque-green/10">
                <p className="text-[10px] text-center font-bold uppercase text-muted-foreground tracking-widest">Next Steps</p>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset} className="font-bold">
                        <Repeat className="size-4 mr-2" /> Repeat Build
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        if (levelIdx < legoLevels.length - 1) {
                          setLevelIdx(prev => prev + 1);
                        } else {
                          handleNextNoun();
                        }
                      }} 
                      className="font-bold"
                    >
                        <Dices className="size-4 mr-2 text-primary" /> 
                        {levelIdx < legoLevels.length - 1 ? "Next Level" : "Another Noun"}
                    </Button>
                    <Button variant="default" size="sm" onClick={handleGoToBoss} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold">
                        <Trophy className="size-4 mr-2" /> Face the Boss
                    </Button>
                </div>
              </div>
            </div>
          )}

          {isError && (
             <div className="bg-basque-red/10 p-4 rounded-xl border border-basque-red/20 flex items-center justify-center gap-3 text-basque-red animate-in fade-in">
                <XCircle className="size-5 shrink-0" />
                <p className="font-bold text-xs uppercase tracking-tight">Brick alignment error! Check your construction order.</p>
             </div>
          )}

          {!isCorrect && (
            <div className="space-y-4">
              <p className="text-[10px] text-center font-bold uppercase text-muted-foreground tracking-widest">Available Bricks</p>
              <div className="flex flex-wrap justify-center gap-3">
                {currentLevel.bricks.filter(b => !built.includes(b.text)).map((brick, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className={cn(
                      "h-14 px-8 rounded-xl border-b-4 active:border-b-0 active:translate-y-px text-lg font-black transition-all hover:scale-105",
                      RoleColors[brick.role]
                    )}
                    onClick={() => handleSnap(brick.text)}
                  >
                    {brick.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!isCorrect && (
            <div className="flex justify-center gap-3 border-t pt-8">
              <Button variant="ghost" onClick={handleReset} disabled={isCorrect}>
                <RefreshCw className="mr-2 size-4" /> Reset Build
              </Button>
              <Button 
                className="bg-basque-earth hover:bg-black text-white px-8 h-14 font-black rounded-xl border-b-4 border-b-black shadow-lg transition-all active:border-b-0 active:translate-y-1" 
                onClick={checkBuild}
                disabled={built.length === 0}
              >
                Snap Bricks
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center gap-8 text-muted-foreground opacity-50">
        <div className="flex items-center gap-1"><Boxes className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Construction Mode</span></div>
        <div className="flex items-center gap-1"><Trophy className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">A1 Achievement Path</span></div>
      </div>
    </div>
  );
}