import data from './vocabulary.json';

export type Word = {
  basque: string;
  english: string;
  category: 'noun' | 'verb' | 'adjective' | 'adverb' | 'conjunction' | 'suffix';
  tense?: 'infinitive' | 'present' | 'past' | 'future' | 'other';
};

export const vocabulary: Word[] = data.words;
