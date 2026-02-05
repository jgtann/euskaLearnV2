import { VocabularyList } from "@/components/features/vocabulary-list";

export default function VocabularyPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-4xl font-bold">Vocabulary Explorer</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Browse the most common Basque words grouped by category.
        </p>
      </div>
      <VocabularyList />
    </div>
  );
}
