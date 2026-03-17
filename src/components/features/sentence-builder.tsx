
'use client';

import { useState, useMemo, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RefreshCw, Sparkles, ArrowRight, XCircle, Volume2, Loader2, BrainCircuit } from 'lucide-react';
import { getSpeech } from '@/app/actions/speech';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

const sentenceChallenges = [
  { id: 's-1', english: "I am Jon.", correct: ["Ni", "Jon", "naiz"], meaning: "Subject + Complement + Verb", type: "A1 Basics" },
  { id: 's-2', english: "You are a student.", correct: ["Zu", "ikaslea", "zara"], meaning: "Subject + Noun + Verb", type: "A1 Basics" },
  { id: 's-3', english: "The house is big.", correct: ["Etxea", "handia", "da"], meaning: "Subject + Adjective + Verb", type: "A1 Basics" },
  { id: 's-4', english: "We are friends.", correct: ["Gu", "lagunak", "gara"], meaning: "Plural Subject + Plural Noun + Verb", type: "A1 Basics" },
  { id: 's-5', english: "I am in the house.", correct: ["Ni", "etxean", "naiz"], meaning: "Subject + Inessive + Verb", type: "A1 Location" },
  { id: 's-6', english: "The book is on the table.", correct: ["Liburua", "mahaian", "dago"], meaning: "Subject + Locative + Verb (State)", type: "A1 Location" },
  { id: 's-7', english: "I have a book.", correct: ["Nik", "liburu", "bat", "dut"], meaning: "Ergative + Object + Bat + Aux", type: "A1 Transitive" },
  { id: 's-8', english: "I drink water.", correct: ["Nik", "ura", "edaten", "dut"], meaning: "Ergative + Object + Main Verb + Aux", type: "A1 Daily" },
  { id: 's-9', english: "I am not a doctor.", correct: ["Ni", "ez", "naiz", "medikua"], meaning: "Negation + Aux + Complement", type: "A1 Negation" },
  { id: 's-10', english: "I always study.", correct: ["Nik", "beti", "ikasten", "dut"], meaning: "Ergative + Adverb + Verb + Aux", type: "A2 Time" },
];

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

    return [...sentenceChallenges].sort((a, b) => {
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
    const level = record ? (success ? Math.min(record.level + 1, 5) : Math.max(record.level - 1, 0)) : (success ? 1 : 0);
    const intervals = [0, 1, 3, 7, 14, 30]; // Days
    const nextReview = Date.now() + (intervals[level] || 0) * 24 * 60 * 60 * 1000;
    
    const docId = record?.id || `${user.uid}_${current.id}`;
    const docRef = doc(firestore, 'users', user.uid, 'user_learning_items', docId);
    
    setDocumentNonBlocking(docRef, {
      id: docId,
      userId: user.uid,
      learningItemId: current.id,
      lastReviewed: Date.now(),
      nextReview,
      level,
      correctCount: (record?.correctCount || 0) + (success ? 1 : 0),
      incorrectCount: (record?.incorrectCount || 0) + (success ? 0 : 1),
    }, { merge: true });
  };

  const check = () => {
    const isCorrect = JSON.stringify(constructed) === JSON.stringify(current.correct);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateSRS(isCorrect);
  };

  const handlePlayAudio = () => {
    const text = current.correct.join(' ');
    if (isAudioPending) return;
    if (audioCache[text]) { new Audio(audioCache[text]).play().catch(() => {}); return; }
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

  if (!current) return <div className="p-8 text-center">Loading syntax workshop...</div>;

  return (
    <div className="space-y-6">
      <Card className="border-t-8 border-t-primary shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">{current.type}</Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BrainCircuit className="size-3" />
              <span className="text-[10px] font-bold">SRS Tracking</span>
            </div>
          </div>
          <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Syntax Scramble</CardTitle>
          <div className="text-2xl font-bold mt-2 text-basque-earth">"{current.english}"</div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className={cn("flex flex-wrap items-center justify-center gap-2 p-6 min-h-[120px] rounded-2xl border-2 border-dashed transition-all", feedback === 'correct' ? "bg-green-50 border-green-500" : "bg-muted/50 border-border")}>
            {constructed.map((w, i) => (
              <Button key={i} variant="outline" className="bg-white font-bold border-b-4 active:border-b-0" onClick={() => {
                if (feedback === 'correct') return;
                setConstructed(prev => prev.filter((_, idx) => idx !== i));
                setPalette(prev => [...prev, w]);
              }}>
                {w}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 p-6 bg-muted rounded-xl border">
            {palette.map((w, i) => (
              <Button key={i} variant="secondary" className="font-bold bg-white border-b-4" onClick={() => {
                if (feedback === 'correct') return;
                setConstructed(prev => [...prev, w]);
                setPalette(prev => prev.filter((_, idx) => idx !== i));
              }}>
                {w}
              </Button>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={() => { setPalette([...current.correct].sort()); setConstructed([]); setFeedback(null); }}>
              <RefreshCw className="size-4 mr-2" /> Reset
            </Button>
            {feedback === 'correct' ? (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handlePlayAudio} disabled={isAudioPending}>
                  {isAudioPending ? <Loader2 className="size-5 animate-spin" /> : <Volume2 className="size-5" />}
                </Button>
                <Button className="bg-basque-green hover:bg-green-700 px-8" onClick={() => setCurrentIdx(prev => (prev + 1) % sortedChallenges.length)}>
                  Next <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            ) : (
              <Button className="bg-basque-earth hover:bg-black px-8" onClick={check} disabled={constructed.length !== current.correct.length}>
                Check Syntax
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {feedback === 'incorrect' && (
        <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-center flex items-center justify-center gap-2 text-destructive animate-in shake">
          <XCircle className="size-5" />
          <p className="text-sm font-bold">Hint: {current.meaning}</p>
        </div>
      )}
      {feedback === 'correct' && (
        <div className="bg-basque-green/10 p-4 rounded-xl border border-basque-green/20 text-center flex flex-col items-center justify-center gap-1 text-basque-green">
          <div className="flex items-center gap-2"><Sparkles className="size-5" /><p className="text-sm font-bold uppercase">Grammar Note</p></div>
          <p className="text-xs">{current.meaning}</p>
        </div>
      )}
    </div>
  );
}
