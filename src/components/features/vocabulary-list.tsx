'use client';

import { useMemo, useState, useTransition } from 'react';
import { vocabulary, type Word } from '@/lib/vocabulary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shuffle, Volume2, Loader2 } from 'lucide-react';
import { getSpeech } from '@/app/actions/speech';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const groupWords = (words: Word[]) => {
  return words.reduce((acc, word) => {
    const { category } = word;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(word);
    return acc;
  }, {} as Record<Word['category'], Word[]>);
};

const groupVerbsByTense = (verbs: Word[]) => {
    return verbs.reduce((acc, verb) => {
        const { tense = 'other' } = verb;
        if (!acc[tense]) {
            acc[tense] = [];
        }
        acc[tense].push(verb);
        return acc;
    }, {} as Record<string, Word[]>);
}

const WordCard = ({ word, onClick, isPlaying }: { word: Word, onClick: (text: string) => void, isPlaying: boolean }) => (
    <Card 
      onClick={() => word.category !== 'suffix' && onClick(word.basque)} 
      className={cn("flex flex-col", word.category !== 'suffix' && "cursor-pointer hover:bg-accent/50")}
    >
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold font-code">{word.basque}</CardTitle>
         {word.category !== 'suffix' && (
           <div className="flex size-6 items-center justify-center">
              {isPlaying ? <Loader2 className="animate-spin text-primary" /> : <Volume2 className="text-muted-foreground" />}
           </div>
         )}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{word.english}</p>
      </CardContent>
    </Card>
  );

const categoryOrder: Word['category'][] = [
  'noun',
  'pronoun',
  'number',
  'verb',
  'adjective',
  'adverb',
  'conjunction',
  'suffix',
  'preposition',
];

export function VocabularyList() {
  const [words, setWords] = useState<Word[]>([...vocabulary]);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleShuffle = () => {
    setWords(currentWords => [...currentWords].sort(() => Math.random() - 0.5));
  };
  
  const handleWordClick = (basqueWord: string) => {
    if (isPending) return;

    setPlayingWord(basqueWord);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('text', basqueWord);

      const response = await getSpeech(null, formData);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Speech Synthesis Error",
          description: response.error,
        });
        setPlayingWord(null);
      } else if (response.data) {
        const audio = new Audio(response.data.audioDataUri);
        audio.play();
        audio.onended = () => setPlayingWord(null);
        audio.onerror = () => {
            toast({
                variant: "destructive",
                title: "Audio Error",
                description: "Could not play the audio file.",
            });
            setPlayingWord(null);
        }
      } else {
        setPlayingWord(null);
      }
    });
  }

  const groupedWords = useMemo(() => groupWords(words), [words]);
  
  const categories = useMemo(() => {
    const availableCategories = Object.keys(groupedWords) as Word['category'][];
    return availableCategories.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
  }, [groupedWords]);

  const verbsByTense = useMemo(() => groupVerbsByTense(groupedWords.verb || []), [groupedWords.verb]);
  const tenses = useMemo(() => Object.keys(verbsByTense).sort(), [verbsByTense]);

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-end items-center mb-4">
        <Button onClick={handleShuffle} variant="outline">
            <Shuffle className="mr-2" />
            Reshuffle Words
        </Button>
      </div>
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="mb-4 h-auto flex-wrap justify-start">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">{category}</TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            {category === 'verb' ? (
              <Tabs defaultValue={tenses[0]} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
                      {tenses.map((tense) => (
                          <TabsTrigger key={tense} value={tense} className="capitalize">{tense}</TabsTrigger>
                      ))}
                  </TabsList>
                  {tenses.map((tense) => (
                      <TabsContent key={tense} value={tense} className="mt-6">
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              {(verbsByTense[tense] || []).map((word) => (
                                  <WordCard key={word.basque} word={word} onClick={handleWordClick} isPlaying={playingWord === word.basque} />
                              ))}
                          </div>
                      </TabsContent>
                  ))}
              </Tabs>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {(groupedWords[category] || []).map((word) => (
                      <WordCard key={word.basque} word={word} onClick={handleWordClick} isPlaying={playingWord === word.basque} />
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
