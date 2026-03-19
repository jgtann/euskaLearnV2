'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { SENTENCE_CHALLENGES } from '@/lib/sentence-challenges';

export function SentenceBuilder() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [challenges, setChallenges] = useState<typeof SENTENCE_CHALLENGES>([]);
  const { toast } = useToast();

  const userItemsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'user_learning_items');
  }, [user, firestore]);
  const { data: userItems } = useCollection(userItemsQuery);

  useEffect(() => {
    if (userItems) {
      const records = userItems || [];
      const recordMap = new Map(records.map(r => [r.learningItemId, r]));
      const now = Date.now();

      const sorted = [...SENTENCE_CHALLENGES].sort((a, b) => {
        const recA = recordMap.get(a.id);
        const recB = recordMap.get(b.id);
        
        const dueA = recA ? recA.nextReview : 0;
        const dueB = recB ? recB.nextReview : 0;
        
        if (dueA <= now && dueB > now) return -1;
        if (dueB <= now && dueA > now) return 1;
        
        return Math.random() - 0.5;
      });
      setChallenges(sorted);
    } else {
      setChallenges(SENTENCE_CHALLENGES);
    }
  }, [userItems]);

  const current = challenges[currentIdx];

  useEffect(() => {
    if (current) {
      setPalette([...current.correct].sort(() => Math.random() - 0.5));
      setConstructed([]);
      setFeedback(null);
    }
  }, [current]);

  const updateSRS = (success: boolean) => {
    if (!user || !firestore || !current) return;
    const records = userItems || [];
    const record = records.find(r => r.learningItemId === current.id);
    
    let currentLevel = record?.level || 0;
    const newLevel = success ? Math.min(currentLevel + 1, 5) : Math.max(currentLevel - 1, 0);
    
    const intervals = [0, 1, 3, 7, 14, 30];
    const nextReview = Date.now() + (intervals[newLevel] || 0) * 24 * 60 * 60 * 1000;
    
    const docId = record?.id || `syntax_${current.id}`;
    const docRef = doc(firestore, 'users', user.uid, 'user_learning_items', docId);
    
    setDocumentNonBlocking(docRef, {
      id: docId,
      userId: user.uid,
      learningItemId: current.id,
      lastReviewed: Date.now(),
      nextReview,
      level: newLevel,
      correctCount: (record?.correctCount || 0) + (success ? 1 : 0),
      incorrectCount: (record?.incorrectCount || 0) + (success ? 0 : 1),
      type: 'syntax_workshop',
      world: current.world
    }, { merge: true });
  };

  const checkBuild = () => {
    if (constructed.length < current.correct.length) {
      toast({
        variant: "destructive",
        title: "Incomplete Sentence",
        description: "You need to use all the bricks to complete the build!",
      });
      return;
    }

    const isCorrect = constructed.join(' ') === current.correct.join(' ');
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateSRS(isCorrect);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % challenges.length);
  };

  const handleReset = () => {
    setPalette([...current.correct].sort(() => Math.random() - 0.5));
    setConstructed([]);
    setFeedback(null);
  };

  if (!current) {
    return (
      <Card className="p-12 text-center border-dashed border-2">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Loading syntax engine...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
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
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="size-4 text-yellow-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Master Builder Quest</span>
            </div>
          </div>
          <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-black mb-1">Mission Objective</CardTitle>
          <div className="text-3xl font-black text-basque-earth tracking-tight leading-tight">"{current.english}"</div>
        </CardHeader>
        
        <CardContent className="space-y-10 p-10">
          
          {feedback === 'correct' ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-4 text-basque-green font-black text-5xl uppercase tracking-tighter">
                  <Sparkles className="size-10 animate-bounce text-yellow-500" />
                  ZORIONAK!
                  <Sparkles className="size-10 animate-bounce text-yellow-500" />
                </div>
                <p className="text-basque-green/80 font-bold uppercase tracking-widest text-xs">Sentence Fully Functional</p>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                 <div className="w-full flex flex-wrap items-center justify-center gap-3 p-10 bg-white rounded-3xl border-4 border-basque-green shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    {current.correct.map((word, i) => {
                      const parts = current.highlights?.[word];
                      return (
                        <div 
                          key={i} 
                          className="animate-in fade-in slide-in-from-top-12 fill-mode-both"
                          style={{ animationDelay: `${i * 150}ms`, animationDuration: '600ms' }}
                        >
                          <div className="h-14 px-8 bg-white border-2 border-basque-green/30 border-b-8 border-b-basque-green/60 font-black text-2xl rounded-2xl flex items-center justify-center shadow-sm">
                            {parts ? (
                              <>
                                <span className="text-basque-earth">{parts[0]}</span>
                                <span className="text-primary">{parts[1]}</span>
                              </>
                            ) : (
                              <span className="text-basque-green">{word}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                 </div>
              </div>

              <div className="bg-basque-green/10 p-8 rounded-2xl border-2 border-dashed border-basque-green/30">
                <div className="flex items-center gap-2 mb-4 text-basque-green font-black text-xs uppercase tracking-widest">
                   <Zap className="size-5" /> Master Builder Logic
                </div>
                <p className="text-base leading-relaxed text-basque-earth font-medium">
                  {current.meaning}
                </p>
              </div>

              <div className="flex justify-center">
                <Button 
                  size="lg"
                  className="bg-basque-green hover:bg-green-700 px-16 h-20 text-2xl font-black rounded-3xl shadow-2xl hover:shadow-basque-green/20 transition-all border-b-8 border-b-green-900 active:border-b-0 active:translate-y-2" 
                  onClick={handleNext}
                >
                  Next Build <ArrowRight className="ml-3 size-8" />
                </Button>
              </div>
            </div>
          ) : feedback === 'incorrect' ? (
            <div className="space-y-8 animate-in shake duration-500">
              <div className="flex flex-col items-center justify-center gap-3 text-basque-red">
                <div className="flex items-center gap-4 font-black text-4xl uppercase tracking-tighter">
                  <XCircle className="size-10" />
                  FRICTION DETECTED
                  <XCircle className="size-10" />
                </div>
                <p className="font-bold uppercase tracking-widest text-xs">Assembly Failed</p>
              </div>

              <div className="flex flex-col items-center gap-4">
                 <div className="w-full flex flex-wrap items-center justify-center gap-3 p-10 bg-white rounded-3xl border-4 border-basque-red shadow-xl relative overflow-hidden">
                    {constructed.map((word, i) => (
                      <div key={i} className="h-14 px-8 bg-white border-2 border-basque-red/30 border-b-8 border-b-basque-red/60 font-black text-2xl rounded-2xl flex items-center justify-center text-basque-red opacity-60">
                        {word}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-basque-red/10 p-8 rounded-2xl border-2 border-dashed border-basque-red/30">
                <div className="flex items-center gap-2 mb-4 text-basque-red font-black text-xs uppercase tracking-widest">
                   <BrainCircuit className="size-5" /> Diagnostic Note
                </div>
                <p className="text-base leading-relaxed text-basque-earth font-medium">
                  The bricks aren't snapping correctly. In Basque, the <strong>verb</strong> typically sits at the end of the sentence (SOV order). Check your assembly and try again!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-12 h-16 text-xl font-black rounded-2xl border-basque-red/20 text-basque-red hover:bg-basque-red/5" 
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2 size-6" /> Try Again
                </Button>
                <Button 
                  size="lg"
                  className="bg-muted-foreground hover:bg-black text-white px-12 h-16 text-xl font-black rounded-2xl shadow-xl transition-all" 
                  onClick={handleNext}
                >
                  Skip Challenge <ArrowRight className="ml-2 size-6" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className={cn(
                  "flex flex-wrap items-center justify-center gap-3 p-10 min-h-[200px] rounded-3xl border-4 border-dashed transition-all duration-500", 
                  "bg-white/50 border-muted-foreground/20 shadow-inner"
              )}>
                  {constructed.map((word, i) => (
                    <Button 
                        key={i} 
                        variant="outline" 
                        className="h-14 px-8 bg-white font-black border-b-4 border-b-muted active:border-b-0 animate-in slide-in-from-bottom-2 text-xl rounded-2xl hover:bg-white hover:text-primary transition-all" 
                        onClick={() => {
                          setConstructed(prev => prev.filter((_, idx) => idx !== i));
                          setPalette(prev => [...prev, word]);
                        }}
                    >
                        {word}
                    </Button>
                  ))}
                  {constructed.length === 0 && (
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <BrainCircuit className="size-12" />
                      <p className="text-sm font-bold uppercase tracking-widest italic">Assemble the syntax engine...</p>
                    </div>
                  )}
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] text-center font-bold uppercase text-muted-foreground/60 tracking-widest">Cargo Hold: Available Bricks</p>
                  <div className="flex flex-wrap justify-center gap-3 p-8 bg-muted/20 rounded-3xl border-2 border-dashed border-muted-foreground/10">
                      {palette.map((word, i) => (
                        <Button 
                            key={i} 
                            variant="secondary" 
                            className="h-14 px-8 font-black bg-white border-b-4 border-b-muted hover:shadow-lg hover:scale-105 transition-all text-xl rounded-2xl text-basque-earth" 
                            onClick={() => {
                              setConstructed(prev => [...prev, word]);
                              setPalette(prev => prev.filter((_, idx) => idx !== i));
                            }}
                        >
                            {word}
                        </Button>
                      ))}
                  </div>
              </div>

              <div className="flex justify-center gap-4 pt-4 border-t border-muted-foreground/10">
                <Button 
                  variant="ghost" 
                  onClick={handleReset}
                  className="font-bold text-muted-foreground hover:text-primary h-14 px-6 rounded-xl"
                >
                  <RefreshCw className="size-4 mr-2" /> Start Over
                </Button>
                <Button 
                  size="lg"
                  className="bg-basque-earth hover:bg-black text-white px-12 h-16 text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-30 border-b-4 border-b-black/40" 
                  onClick={checkBuild} 
                  disabled={constructed.length === 0}
                >
                  Snap Bricks & Test
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center gap-8 text-muted-foreground/30 mt-6">
        <div className="flex items-center gap-2"><Sparkles className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Syntax Engine V2.0</span></div>
        <div className="flex items-center gap-2"><CheckCircle2 className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Procedural Mastery Validated</span></div>
      </div>
    </div>
  );
}
