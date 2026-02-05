'use client';

import { useMemo, useState } from 'react';
import { vocabulary, type Word } from '@/lib/vocabulary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

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

const WordCard = ({ word }: { word: Word }) => (
  <Card className="flex flex-col">
    <CardHeader className="flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-bold font-code">{word.basque}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{word.english}</p>
    </CardContent>
  </Card>
);

export function VocabularyList() {
  const [words, setWords] = useState<Word[]>([...vocabulary]);

  const handleShuffle = () => {
    setWords(currentWords => [...currentWords].sort(() => Math.random() - 0.5));
  };
  
  const groupedWords = useMemo(() => groupWords(words), [words]);
  const categories = useMemo(() => Object.keys(groupedWords).sort() as Word['category'][], [groupedWords]);
  const verbsByTense = useMemo(() => groupVerbsByTense(groupedWords.verb || []), [groupedWords.verb]);
  const tenses = useMemo(() => Object.keys(verbsByTense).sort(), [verbsByTense]);

  return (
    <>
      <div className="flex justify-end mb-4">
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
                                  <WordCard key={word.basque} word={word} />
                              ))}
                          </div>
                      </TabsContent>
                  ))}
              </Tabs>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {(groupedWords[category] || []).map((word) => (
                      <WordCard key={word.basque} word={word} />
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
