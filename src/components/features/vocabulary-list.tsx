
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { vocabulary, type Word } from '@/lib/vocabulary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, BrainCircuit, CheckCircle2, XCircle, ChevronRight, Volume2, Loader2 } from 'lucide-react';
import { getEncouragementAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

const WordCard = ({ 
  word, 
  srsLevel, 
  onSrsUpdate 
}: { 
  word: Word, 
  srsLevel?: number,
  onSrsUpdate?: (basque: string, success: boolean) => void
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  useEffect(() => setIsFlipped(false), [word]);
  const hasSrs = onSrsUpdate !== undefined;

  const CardContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <Card 
      className={cn(
        "group relative flex min-h-[140px] flex-col transition-all duration-300",
        hasSrs && !isFlipped ? "cursor-pointer hover:shadow-md" : "",
        isFlipped ? "border-primary bg-primary/5" : "bg-card"
      )}
      onClick={hasSrs && !isFlipped ? () => setIsFlipped(true) : undefined}
    >
      {children}
    </Card>
  );

  const cardInnerContent = (
    <>
      <CardHeader className="flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <Badge variant="outline" className="text-[10px] uppercase tracking-tighter">{word.category}</Badge>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary font-heading">{word.basque}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-end flex-grow">
        {hasSrs ? (
          !isFlipped ? (
            <div className="text-center text-sm text-muted-foreground mt-4">Click to reveal</div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-1">
              <p className="text-lg font-medium mb-3">{word.english}</p>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" className="flex-1 h-8" onClick={(e) => { e.stopPropagation(); onSrsUpdate?.(word.basque, false); setIsFlipped(false); }}>Again</Button>
                <Button variant="default" size="sm" className="flex-1 h-8 bg-green-600 hover:bg-green-700" onClick={(e) => { e.stopPropagation(); onSrsUpdate?.(word.basque, true); setIsFlipped(false); }}>Good</Button>
              </div>
            </div>
          )
        ) : (
          <p className="text-lg font-medium">{word.english}</p>
        )}
      </CardContent>
      {srsLevel !== undefined && srsLevel > 0 && (
        <div className="absolute top-2 right-2 flex gap-1">
           {[...Array(Math.min(srsLevel, 5))].map((_, i) => (
             <div key={i} className="size-1.5 rounded-full bg-green-500" />
           ))}
        </div>
      )}
    </>
  );

  if (hasSrs) return <CardContentWrapper>{cardInnerContent}</CardContentWrapper>;
  return (
    <Link href={`/vocabulary/${encodeURIComponent(word.basque)}`} className="no-underline block h-full transition-transform hover:-translate-y-1">
      <CardContentWrapper>{cardInnerContent}</CardContentWrapper>
    </Link>
  );
};

export function VocabularyList() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [celebration, setCelebration] = useState<{basque: string, english: string} | null>(null);
  const { toast } = useToast();

  const userItemsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'user_learning_items');
  }, [user, firestore]);
  const { data: userItems } = useCollection(userItemsQuery);

  const handleSrsUpdate = (basque: string, success: boolean) => {
    if (!user || !firestore) return;
    const records = userItems || [];
    const record = records.find(r => r.learningItemId === basque);
    const level = record ? (success ? Math.min(record.level + 1, 5) : Math.max(record.level - 1, 0)) : (success ? 1 : 0);
    const intervals = [0, 1, 3, 7, 14, 30]; // Days
    const nextReview = Date.now() + (intervals[level] || 0) * 24 * 60 * 60 * 1000;

    const docId = record?.id || `${user.uid}_${basque}`;
    const docRef = doc(firestore, 'users', user.uid, 'user_learning_items', docId);

    setDocumentNonBlocking(docRef, {
      id: docId,
      userId: user.uid,
      learningItemId: basque,
      lastReviewed: Date.now(),
      nextReview,
      level,
      correctCount: (record?.correctCount || 0) + (success ? 1 : 0),
      incorrectCount: (record?.incorrectCount || 0) + (success ? 0 : 1),
    }, { merge: true });
  };

  const masteryCount = useMemo(() => (userItems || []).filter(v => v.level === 5).length, [userItems]);
  const dueWords = useMemo(() => {
    const now = Date.now();
    const recordMap = new Map((userItems || []).map(r => [r.learningItemId, r]));
    return vocabulary
      .filter(word => {
        const record = recordMap.get(word.basque);
        return !record || record.nextReview <= now;
      })
      .sort(() => Math.random() - 0.5);
  }, [userItems]);

  const categories = useMemo(() => Array.from(new Set(vocabulary.map(v => v.category))), []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-muted/50 p-6 rounded-2xl border">
        <div><p className="text-sm text-muted-foreground uppercase font-semibold">Due</p><p className="text-3xl font-bold text-orange-500">{dueWords.length}</p></div>
        <div><p className="text-sm text-muted-foreground uppercase font-semibold">Mastered</p><p className="text-3xl font-bold text-green-600">{masteryCount}</p></div>
        <div className="flex items-center justify-end">
          <Button size="lg" variant={isReviewMode ? "default" : "outline"} onClick={() => setIsReviewMode(!isReviewMode)} disabled={!isReviewMode && dueWords.length === 0}>
            {isReviewMode ? <><RotateCcw className="mr-2 h-4 w-4" /> Exit</> : <><BrainCircuit className="mr-2 h-4 w-4" /> Start Review</>}
          </Button>
        </div>
      </div>
      {isReviewMode ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Review Queue</h2><Badge variant="secondary">{dueWords.length} items</Badge></div>
          {dueWords.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {dueWords.map(word => <WordCard key={word.basque} word={word} srsLevel={(userItems || []).find(r => r.learningItemId === word.basque)?.level} onSrsUpdate={handleSrsUpdate} />)}
            </div>
          ) : (
             <Card className="p-12 text-center border-2 border-primary/20">
              <CheckCircle2 className="size-10 text-primary mx-auto mb-6" />
              <CardTitle className="text-3xl mb-2">Zorionak!</CardTitle>
              <p className="text-xl text-muted-foreground italic mb-6">Queue empty. See you tomorrow!</p>
              <Button onClick={() => setIsReviewMode(false)} variant="outline">Library</Button>
            </Card>
          )}
        </div>
      ) : (
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="mb-4 h-auto flex-wrap justify-start">
            {categories.map((category) => <TabsTrigger key={category} value={category} className="capitalize">{category}</TabsTrigger>)}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {vocabulary.filter(word => word.category === category).map((word) => (
                      <WordCard key={word.basque} word={word} srsLevel={(userItems || []).find(r => r.learningItemId === word.basque)?.level} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
