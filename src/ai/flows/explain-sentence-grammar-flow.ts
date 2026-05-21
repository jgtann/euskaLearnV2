'use server';
/**
 * @fileOverview An AI-powered flow to explain the grammar of a Basque sentence.
 *
 * - explainSentenceGrammar - A function that generates a grammatical explanation.
 * - ExplainSentenceGrammarInput - The input type for the function.
 * - ExplainSentenceGrammarOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSentenceGrammarInputSchema = z.object({
  basqueSentence: z.string().describe('The Basque sentence to explain.'),
  englishSentence: z.string().describe('The English translation of the sentence.'),
});
export type ExplainSentenceGrammarInput = z.infer<typeof ExplainSentenceGrammarInputSchema>;

const GrammarPointSchema = z.object({
    morpheme: z.string().describe('The morpheme or word part being analyzed (e.g., "-ak", "ditu").'),
    explanation: z.string().describe('A concise explanation of its grammatical function in this context (e.g., "Ergative plural marker", "Verb: he/she has them").'),
});

const ExplainSentenceGrammarOutputSchema = z.object({
  breakdown: z.array(GrammarPointSchema).describe('A breakdown of key grammatical components in the sentence.'),
});
export type ExplainSentenceGrammarOutput = z.infer<typeof ExplainSentenceGrammarOutputSchema>;

export async function explainSentenceGrammar(input: ExplainSentenceGrammarInput): Promise<ExplainSentenceGrammarOutput> {
  return explainSentenceGrammarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSentenceGrammarPrompt',
  input: {schema: ExplainSentenceGrammarInputSchema},
  output: {schema: ExplainSentenceGrammarOutputSchema},
  prompt: `You are a Basque language grammar expert. For the following sentence pair, provide a simple grammatical breakdown for a beginner. 
  Identify key morphemes (especially suffixes) and verbs, and explain their role in the sentence.

  IMPORTANT: The explanations must be strictly in English. If a sentence omits subject pronouns (like gu/guk) when combining clauses or in general (e.g., "lanera joaten gara eta lan egiten dugu"), explicitly explain that the pronoun is dropped because the auxiliary verbs (like gara and dugu) already imply the exact subject.

  Basque: "{{basqueSentence}}"
  English: "{{englishSentence}}"
`,
});

const explainSentenceGrammarFlow = ai.defineFlow(
  {
    name: 'explainSentenceGrammarFlow',
    inputSchema: ExplainSentenceGrammarInputSchema,
    outputSchema: ExplainSentenceGrammarOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
