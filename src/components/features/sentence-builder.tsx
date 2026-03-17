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
  CheckCircle2,
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
    
    const docId = record?.id || `${user.uid}_${current.id}`;
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
      }
    });
  };

  const check = () => {
    const isCorrect = JSON.stringify(constructed) === JSON.stringify(current.correct);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateSRS(isCorrect);
    if (isCorrect) {
      handlePlayAudio();
    }
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % sortedChallenges.length);
  };

  if (!current) return <div className="p-8 text-center text-muted-foreground">Loading syntax workshop...</div>;

  return (
    <div className="space-y-6">
      <Card className="border-t-8 border-t-primary shadow-xl overflow-hidden">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">{current.type}</Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BrainCircuit className="size-3" />
              <span className="text-[10px] font-bold">Syntax Activation</span>
            </div>
          </div>
          <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">The Scramble Engine</CardTitle>
          <div className="text-3xl font-black mt-2 text-basque-earth tracking-tight">"{current.english}"</div>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {feedback === 'correct' && (
            <div className="space-y-6 animate-in zoom-in-95 fade-in duration-500">
              <div className="flex flex-col items-center justify-center gap-4 py-4">
                <div className="flex items-center gap-3 text-basque-green font-black text-4xl uppercase tracking-tighter">
                  <Sparkles className="size-8 animate-bounce text-yellow-500" />
                  Zorionak!
                  <Sparkles className="size-8 animate-bounce text-yellow-500" />
                </div>
                
                <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border-2 border-basque-green/20 shadow-sm">
                  <span className="text-3xl font-black text-basque-green tracking-tight">
                    {current.correct.join(' ')}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-basque-green hover:bg-basque-green/10"
                    onClick={handlePlayAudio}
                    disabled={isAudioPending}
                  >
                    {isAudioPending ? <Loader2 className="size-5 animate-spin" /> : <Volume2 className="size-5" />}
                  </Button>
                </div>
              </div>

              <div className="bg-basque-green/5 p-5 rounded-2xl border border-basque-green/20">
                <div className="flex items-center gap-2 mb-2 text-basque-green font-bold text-xs uppercase tracking-widest">
                   <Zap className="size-4" /> Grammar Logic Breakdown
                </div>
                <p className="text-sm leading-relaxed text-basque-earth font-medium">
                  {current.meaning}
                </p>
              </div>
            </div>
          )}

          {feedback !== 'correct' && (
            <>
              <div className={cn(
                  "flex flex-wrap items-center justify-center gap-2 p-6 min-h-[140px] rounded-2xl border-4 border-dashed transition-all duration-500", 
                  "bg-muted/30 border-border shadow-inner"
              )}>
                  {constructed.map((w, i) => (
                    <Button 
                        key={i} 
                        variant="outline" 
                        className="h-12 px-6 bg-white font-bold border-b-4 border-b-gray-200 active:border-b-0 animate-in slide-in-from-bottom-2 text-lg" 
                        onClick={() => {
                          setConstructed(prev => prev.filter((_, idx) => idx !== i));
                          setPalette(prev => [...prev, w]);
                          setFeedback(null);
                        }}
                    >
                        {w}
                    </Button>
                  ))}
                  {constructed.length === 0 && <p className="text-gray-400 italic">Drag or click bricks to build the sentence...</p>}
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] text-center font-bold uppercase text-muted-foreground tracking-widest">Available Bricks</p>
                  <div className="flex flex-wrap justify-center gap-3 p-6 bg-muted/50 rounded-2xl border border-dashed">
                      {palette.map((w, i) => (
                        <Button 
                            key={i} 
                            variant="secondary" 
                            className="h-12 px-6 font-bold bg-white border-b-4 border-b-gray-300 hover:shadow-md transition-shadow text-lg" 
                            onClick={() => {
                              setConstructed(prev => [...prev, w]);
                              setPalette(prev => prev.filter((_, idx) => idx !== i));
                              setFeedback(null);
                            }}
                        >
                            {w}
                        </Button>
                      ))}
                  </div>
              </div>
            </>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <Button variant="ghost" disabled={feedback === 'correct'} onClick={() => { setPalette([...current.correct].sort()); setConstructed([]); setFeedback(null); }}>
              <RefreshCw className="size-4 mr-2" /> Start Over
            </Button>
            {feedback === 'correct' ? (
              <Button className="bg-basque-green hover:bg-green-700 px-12 h-12 text-white font-bold rounded-xl" onClick={handleNext}>
                Next Challenge <ArrowRight className="ml-2 size-5" />
              </Button>
            ) : (
              <Button className="bg-basque-earth hover:bg-black text-white px-10 h-12 font-bold rounded-xl" onClick={check} disabled={constructed.length !== current.correct.length}>
                Test My Syntax
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {feedback === 'incorrect' && (
        <div className="bg-destructive/10 p-5 rounded-2xl border border-destructive/20 text-center flex items-center justify-center gap-3 text-destructive animate-in shake">
          <XCircle className="size-6" />
          <p className="font-bold text-sm">Not quite! Double-check the order of the bricks.</p>
        </div>
      )}
    </div>
  );
}