'use server';
/**
 * @fileOverview An AI-powered flow to generate sentence examples for Basque words.
 *
 * - getSentenceExamples - A function that generates example sentences.
 * - GetSentenceExamplesInput - The input type for the function.
 * - GetSentenceExamplesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetSentenceExamplesInputSchema = z.object({
  basqueWord: z.string().describe('The Basque word to create examples for.'),
  englishWord: z.string().describe('The English meaning of the Basque word.'),
});
export type GetSentenceExamplesInput = z.infer<typeof GetSentenceExamplesInputSchema>;

const SentenceExampleSchema = z.object({
    basque: z.string().describe('A simple example sentence in Basque.'),
    english: z.string().describe('The English translation of the sentence.'),
});

const GetSentenceExamplesOutputSchema = z.object({
  examples: z.array(SentenceExampleSchema).length(3).describe('An array of three sentence examples.'),
});
export type GetSentenceExamplesOutput = z.infer<typeof GetSentenceExamplesOutputSchema>;

export async function getSentenceExamples(input: GetSentenceExamplesInput): Promise<GetSentenceExamplesOutput> {
  return sentenceExamplesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sentenceExamplesPrompt',
  input: {schema: GetSentenceExamplesInputSchema},
  output: {schema: GetSentenceExamplesOutputSchema},
  prompt: `You are a Basque language teacher creating simple examples for a beginner.
Generate exactly three short, simple, and distinct example sentences for the Basque word "{{basqueWord}}" (which means "{{englishWord}}").
Provide the Basque sentence and its English translation for each. The sentences should be easy for a new learner to understand.
`,
});

const sentenceExamplesFlow = ai.defineFlow(
  {
    name: 'sentenceExamplesFlow',
    inputSchema: GetSentenceExamplesInputSchema,
    outputSchema: GetSentenceExamplesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
