'use client';

import { useMemo, useState, useEffect, useTransition } from 'react';
import { vocabulary, type Word } from '@/lib/vocabulary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Loader2, RotateCcw, BrainCircuit, CheckCircle2, XCircle } from 'lucide-react';
import { getSpeech } from '@/app/actions/speech';
import { getEncouragementAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- Types & SRS Logic ---
type SRSData = Record<string, { level: number; nextReview: number }>;

const WordCard = ({ 
  word, 
  onClick, 
  isPlaying, 
  srsLevel, 
  onSrsUpdate 
}: { 
  word: Word, 
  onClick: (text: string) => void, 
  isPlaying: boolean,
  srsLevel?: number,
  onSrsUpdate?: (basque: string, success: boolean) => void
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state if the word changes
  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  const hasSrs = onSrsUpdate !== undefined;

  return (
    <Card 
      className={cn(
        "group relative flex min-h-[140px] flex-col transition-all duration-300",
        hasSrs && !isFlipped && "cursor-pointer hover:shadow-md",
        isFlipped ? "border-primary bg-primary/5" : "bg-card"
      )}
      onClick={hasSrs && !isFlipped ? () => setIsFlipped(true) : undefined}
    >
      <CardHeader className="flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <Badge variant="outline" className="text-[10px] uppercase tracking-tighter">
            {word.category}
          </Badge>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary font-heading">
            {word.basque}
          </CardTitle>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onClick(word.basque); }}
          disabled={isPlaying}
        >
          {isPlaying ? <Loader2 className="animate-spin" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      
      <CardContent className="flex flex-col justify-end flex-grow">
        {hasSrs ? (
          !isFlipped ? (
            <div className="text-center text-sm text-muted-foreground mt-4">Click to reveal</div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-1">
              <p className="text-lg font-medium mb-3">{word.english}</p>
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1 h-8"
                  onClick={(e) => { e.stopPropagation(); onSrsUpdate?.(word.basque, false); setIsFlipped(false); }}
                >
                  <XCircle className="h-3 w-3 mr-1" /> Again
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 h-8 bg-green-600 hover:bg-green-700"
                  onClick={(e) => { e.stopPropagation(); onSrsUpdate?.(word.basque, true); setIsFlipped(false); }}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Good
                </Button>
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
    </Card>
  );
};

export function VocabularyList() {
  const [srsData, setSrsData] = useState<SRSData>({});
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [isAudioPending, startAudioTransition] = useTransition();
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [celebration, setCelebration] = useState<{basque: string, english: string} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('basque-srs-data');
      if (saved) setSrsData(JSON.parse(saved));
    } catch (error) {
      console.error("Could not load SRS data from localStorage", error);
    }
  }, []);
  
  const handleSrsUpdate = (basque: string, success: boolean) => {
    const current = srsData[basque] || { level: 0, nextReview: 0 };
    const newLevel = success ? Math.min(current.level + 1, 5) : Math.max(current.level - 1, 0);
    const intervals = [0, 1, 3, 7, 14, 30]; // Days
    const nextReview = Date.now() + intervals[newLevel] * 24 * 60 * 60 * 1000;

    const newData = { ...srsData, [basque]: { level: newLevel, nextReview } };
    setSrsData(newData);
    try {
      localStorage.setItem('basque-srs-data', JSON.stringify(newData));
    } catch (error) {
       console.error("Could not save SRS data to localStorage", error);
    }
  };

  const handleWordClick = (basqueWord: string) => {
    if (isAudioPending) return;
    setPlayingWord(basqueWord);
    startAudioTransition(async () => {
      const formData = new FormData();
      formData.append('text', basqueWord);
      const response = await getSpeech(null, formData);
      if (response.data?.audioDataUri) {
        const audio = new Audio(response.data.audioDataUri);
        audio.play().catch(err => toast({ title: "Audio Playback Error", description: "The browser blocked autoplay.", variant: "destructive"}));
        audio.onended = () => setPlayingWord(null);
        audio.onerror = () => {
          setPlayingWord(null);
          toast({ title: "Audio Error", description: "Could not play the audio file.", variant: "destructive" });
        }
      } else {
        setPlayingWord(null);
        toast({ title: "Speech Synthesis Error", description: response.error, variant: "destructive" });
      }
    });
  };

  const handleSessionComplete = async (score: number) => {
    const result = await getEncouragementAction(score);
    if(result.data) {
      setCelebration(result.data);
      toast({
        title: result.data.basque,
        description: result.data.english,
        className: "bg-green-50 border-green-200",
      });
    }
  };

  const masteryCount = useMemo(() => Object.values(srsData).filter(v => v.level === 5).length, [srsData]);

  const dueWords = useMemo(() => {
    const now = Date.now();
    return vocabulary
      .filter(word => {
        const record = srsData[word.basque];
        return !record || record.nextReview <= now;
      })
      .sort(() => Math.random() - 0.5); // Shuffle review words
  }, [srsData]);

  useEffect(() => {
    // Check if we just finished the last word
    const wasInReview = isReviewMode;
    const justFinished = dueWords.length === 0;
    const hasProgress = Object.keys(srsData).length > 0;

    if (wasInReview && justFinished && hasProgress) {
      handleSessionComplete(masteryCount);
    }
  }, [dueWords.length, isReviewMode, srsData, masteryCount]);

  useEffect(() => {
    if (isReviewMode && dueWords.length > 0) {
      // Pre-cache the first word's audio to improve perceived performance
      const firstWord = dueWords[0].basque;
      const formData = new FormData();
      formData.append('text', firstWord);
      getSpeech(null, formData).then(res => {
        if (res.data?.audioDataUri) new Audio(res.data.audioDataUri).load();
      });
    }
  }, [isReviewMode, dueWords]);


  const categories = useMemo(() => Array.from(new Set(vocabulary.map(v => v.category))), []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-muted/50 p-6 rounded-2xl border">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground uppercase font-semibold">Words Due</p>
          <p className="text-3xl font-bold text-orange-500">{dueWords.length}</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground uppercase font-semibold">Mastered</p>
          <p className="text-3xl font-bold text-green-600">{masteryCount}</p>
        </div>
        <div className="flex items-center justify-center md:justify-end">
          <Button 
            size="lg" 
            variant={isReviewMode ? "default" : "outline"}
            onClick={() => setIsReviewMode(!isReviewMode)}
            className={cn("w-full md:w-auto transition-all", isReviewMode && "ring-4 ring-primary/20")}
            disabled={!isReviewMode && dueWords.length === 0}
          >
            {isReviewMode ? (
              <><RotateCcw className="mr-2 h-4 w-4" /> Exit Review</>
            ) : (
              <><BrainCircuit className="mr-2 h-4 w-4" /> Start Review</>
            )}
          </Button>
        </div>
      </div>

      {isReviewMode ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Daily Review Queue</h2>
            <Badge variant="secondary">{dueWords.length} items remaining</Badge>
          </div>
          
          {dueWords.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-500">
              {dueWords.map(word => (
                <WordCard 
                  key={word.basque} 
                  word={word} 
                  onClick={handleWordClick}
                  isPlaying={playingWord === word.basque}
                  srsLevel={srsData[word.basque]?.level}
                  onSrsUpdate={handleSrsUpdate}
                />
              ))}
            </div>
          ) : (
             <Card className="p-12 text-center border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
              <div className="mx-auto size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="size-10 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-2">
                {celebration?.basque || "Zorionak!"}
              </CardTitle>
              <p className="text-xl text-muted-foreground italic mb-6">
                "{celebration?.english || "Congratulations!"}"
              </p>
              <Button onClick={() => setIsReviewMode(false)} variant="outline">
                Back to Library
              </Button>
            </Card>
          )}
        </div>
      ) : (
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="mb-4 h-auto flex-wrap justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">{category}</TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {vocabulary.filter(word => word.category === category).map((word) => (
                      <WordCard key={word.basque} word={word} onClick={handleWordClick} isPlaying={playingWord === word.basque} srsLevel={srsData[word.basque]?.level} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
