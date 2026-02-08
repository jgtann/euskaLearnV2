import { VocabularyList } from "@/components/features/vocabulary-list";

export default function VocabularyPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-4xl font-bold">Vocabulary Explorer</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Browse the library or start a smart review session to practice.
        </p>
      </div>
      <VocabularyList />
    </div>
  );
}
