'use client';

import { useState, useMemo, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  XCircle, 
  Volume2, 
  Loader2, 
  BrainCircuit, 
  Zap
} from 'lucide-react';
import { getSpeech } from '@/app/actions/speech';
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

    // Simple priority: Due/New items first, then randomized
    return [...SENTENCE_CHALLENGES].sort((a, b) => {
      const recA = recordMap.get(a.id);
      const recB = recordMap.get(b.id);
      const dueA = recA ? recA.nextReview : 0;
      const dueB = recB ? recB.nextReview : 0;
      if (dueA <= now && dueB > now) return -1;
      if (dueB <= now && dueA > now) return 1;
      return Math.random() - 0.5;
    });
  }, [userItems]);

  const current = sortedChallenges[currentIdx];

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
      type: 'syntax_workshop'
    }, { merge: true });
  };

  const handlePlayAudio = () => {
    const text = current.correct.join(' ');
    if (isAudioPending || !text) return;
    if (audioCache[text]) {
      new Audio(audioCache[text]).play().catch(() => {});
      return;
    }
    startAudioTransition(async () => {
      const formData = new FormData();
      formData.append('text', text);
      const response = await getSpeech(null, formData);
      if (response.data?.audioDataUri) {
        setAudioCache(prev => ({ ...prev, [text]: response.data.audioDataUri }));
        new Audio(response.data.audioDataUri).play().catch(() => {});
      } else if (response.error) {
        toast({
          variant: "destructive",
          title: "Audio Error",
          description: response.error,
        });
      }
    });
  };

  const checkBuild = () => {
    if (constructed.length < current.correct.length) {
      toast({
        title: "Incomplete Sentence",
        description: "You need to use all the bricks to complete the build!",
      });
      return;
    }

    const isCorrect = constructed.join(' ') === current.correct.join(' ');
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateSRS(isCorrect);
    
    if (isCorrect) {
      handlePlayAudio();
    }
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % sortedChallenges.length);
  };

  const handleReset = () => {
    setPalette([...current.correct].sort(() => Math.random() - 0.5));
    setConstructed([]);
    setFeedback(null);
  };

  if (!current) {
    return (
      <Card className="p-12 text-center">
        <Loader2 className="size-8 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest">Loading syntax module...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="border-t-8 border-t-primary shadow-xl overflow-hidden bg-basque-stone/10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary border-primary/20 px-3">
              {current.type}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BrainCircuit className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Syntax Activation</span>
            </div>
          </div>
          <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-black mb-1">Translate into Basque</CardTitle>
          <div className="text-3xl font-black text-basque-earth tracking-tight leading-tight">"{current.english}"</div>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8">
          
          {/* SUCCESS STATE */}
          {feedback === 'correct' && (
            <div className="space-y-6 animate-in zoom-in-95 fade-in duration-500">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-3 text-basque-green font-black text-5xl uppercase tracking-tighter">
                  <Sparkles className="size-8 animate-bounce text-yellow-500" />
                  Zorionak!
                  <Sparkles className="size-8 animate-bounce text-yellow-500" />
                </div>
                
                <div className="w-full flex items-center justify-between gap-4 p-6 bg-white rounded-3xl border-4 border-basque-green/20 shadow-xl">
                  <span className="text-3xl font-black text-basque-green tracking-tight leading-snug">
                    {current.correct.join(' ')}
                  </span>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-14 w-14 rounded-full bg-basque-green/10 text-basque-green hover:bg-basque-green hover:text-white transition-all shadow-md"
                    onClick={handlePlayAudio}
                    disabled={isAudioPending}
                  >
                    {isAudioPending ? <Loader2 className="size-6 animate-spin" /> : <Volume2 className="size-6" />}
                    <span className="sr-only">Play audio</span>
                  </Button>
                </div>
              </div>

              <div className="bg-basque-green/5 p-6 rounded-2xl border-2 border-dashed border-basque-green/30">
                <div className="flex items-center gap-2 mb-3 text-basque-green font-black text-xs uppercase tracking-widest">
                   <Zap className="size-4" /> Master Builder Logic
                </div>
                <p className="text-sm leading-relaxed text-basque-earth font-medium">
                  {current.meaning}
                </p>
              </div>
            </div>
          )}

          {/* ACTIVE BUILDING STATE */}
          {feedback !== 'correct' && (
            <>
              <div className={cn(
                  "flex flex-wrap items-center justify-center gap-3 p-8 min-h-[160px] rounded-3xl border-4 border-dashed transition-all duration-500", 
                  feedback === 'incorrect' ? "border-basque-red bg-red-50/50 animate-shake" : "bg-white/50 border-muted-foreground/20 shadow-inner"
              )}>
                  {constructed.map((word, i) => (
                    <Button 
                        key={i} 
                        variant="outline" 
                        className="h-14 px-8 bg-white font-black border-b-4 border-b-muted active:border-b-0 animate-in slide-in-from-bottom-2 text-xl rounded-2xl hover:bg-white hover:text-primary transition-all" 
                        onClick={() => {
                          setConstructed(prev => prev.filter((_, idx) => idx !== i));
                          setPalette(prev => [...prev, word]);
                          setFeedback(null);
                        }}
                    >
                        {word}
                    </Button>
                  ))}
                  {constructed.length === 0 && (
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Sparkles className="size-8" />
                      <p className="text-sm font-bold uppercase tracking-widest italic">Assemble your spaceship...</p>
                    </div>
                  )}
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] text-center font-bold uppercase text-muted-foreground/60 tracking-widest">Available Bricks</p>
                  <div className="flex flex-wrap justify-center gap-3 p-6 bg-muted/20 rounded-3xl border-2 border-dashed border-muted-foreground/10">
                      {palette.map((word, i) => (
                        <Button 
                            key={i} 
                            variant="secondary" 
                            className="h-14 px-8 font-black bg-white border-b-4 border-b-muted hover:shadow-lg hover:scale-105 transition-all text-xl rounded-2xl text-basque-earth" 
                            onClick={() => {
                              setConstructed(prev => [...prev, word]);
                              setPalette(prev => prev.filter((_, idx) => idx !== i));
                              setFeedback(null);
                            }}
                        >
                            {word}
                        </Button>
                      ))}
                  </div>
              </div>

              {feedback === 'incorrect' && (
                <div className="bg-basque-red/10 p-4 rounded-2xl border-2 border-basque-red/20 flex items-center justify-center gap-3 text-basque-red animate-in fade-in slide-in-from-top-2">
                  <XCircle className="size-5" />
                  <p className="font-bold text-xs uppercase tracking-tight">Not quite! Check the brick order. Remember: the Verb Engine often goes last!</p>
                </div>
              )}
            </>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-center gap-4 pt-6 border-t border-muted-foreground/10">
            <Button 
              variant="ghost" 
              disabled={feedback === 'correct'} 
              onClick={handleReset}
              className="font-bold text-muted-foreground hover:text-primary"
            >
              <RefreshCw className="size-4 mr-2" /> Start Over
            </Button>
            
            {feedback === 'correct' ? (
              <Button 
                className="bg-basque-green hover:bg-green-700 px-14 h-14 text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all" 
                onClick={handleNext}
              >
                Next Build <ArrowRight className="ml-2 size-6" />
              </Button>
            ) : (
              <Button 
                className="bg-basque-earth hover:bg-black text-white px-12 h-14 text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-30" 
                onClick={checkBuild} 
                disabled={constructed.length === 0}
              >
                Snap Bricks & Test
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center gap-8 text-muted-foreground/40 mt-4">
        <div className="flex items-center gap-1"><Sparkles className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Syntax Engine V2.0</span></div>
        <div className="flex items-center gap-1"><BrainCircuit className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Procedural Acquisition</span></div>
      </div>
    </div>
  );
}
