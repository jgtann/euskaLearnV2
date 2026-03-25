import { vocabulary, type Word } from '@/lib/vocabulary';
import { notFound } from 'next/navigation';
import { ExampleSentences } from '@/components/features/example-sentences';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WordPageProps {
  params: Promise<{
    word: string;
  }>;
}

export default async function WordPage({ params }: WordPageProps) {
  // In Next.js 15, params must be awaited
  const { word } = await params;
  const decodedWord = decodeURIComponent(word);
  
  const wordData = vocabulary.find(w => w.basque.toLowerCase() === decodedWord.toLowerCase());

  if (!wordData) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href="/vocabulary">
                <ArrowLeft className="mr-2"/>
                Back to Vocabulary
            </Link>
        </Button>
        <div className="flex items-baseline gap-4">
            <h1 className="font-heading text-4xl font-bold">{wordData.basque}</h1>
            <p className="text-muted-foreground text-2xl">/ {wordData.english} /</p>
        </div>
        <Badge variant="secondary" className="mt-2 text-base capitalize">{wordData.category}</Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Example Sentences</CardTitle>
          <CardDescription>
            See how "{wordData.basque}" is used in context. Click the audio icon to listen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExampleSentences word={wordData} />
        </CardContent>
      </Card>
    </div>
  );
}
