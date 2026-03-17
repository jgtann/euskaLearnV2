'use server';

/**
 * @fileOverview An AI-powered translation and explanation flow to help learners understand the differences between English and Basque.
 *
 * - translateAndExplain - A function that translates and explains the differences between English and Basque.
 * - TranslateAndExplainInput - The input type for the translateAndExplain function.
 * - TranslateAndExplainOutput - The return type for the translateAndExplain function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateAndExplainInputSchema = z.object({
  englishText: z.string().describe('The English text to translate and explain.'),
});
export type TranslateAndExplainInput = z.infer<typeof TranslateAndExplainInputSchema>;

const ExplanationItemSchema = z.object({
  concept: z.string().describe('The basic idea or word part being explained.'),
  explanation: z.string().describe('A simple, fun explanation for a child.'),
  example: z.string().describe('An example sentence or phrase pair (English/Basque) showing how it works.'),
});

const TranslateAndExplainOutputSchema = z.object({
  basqueTranslation: z.string().describe('The Basque translation of the input text.'),
  explanation: z.array(ExplanationItemSchema)
    .describe(
      'A structured explanation of the differences between English and Basque, using simple words a 10-year-old would understand.'
    ),
});
export type TranslateAndExplainOutput = z.infer<typeof TranslateAndExplainOutputSchema>;

export async function translateAndExplain(input: TranslateAndExplainInput): Promise<TranslateAndExplainOutput> {
  return translateAndExplainFlow(input);
}

const translateAndExplainPrompt = ai.definePrompt({
  name: 'translateAndExplainPrompt',
  input: {schema: TranslateAndExplainInputSchema},
  output: {schema: TranslateAndExplainOutputSchema},
  prompt: `You are a friendly language tutor specializing in Basque and English.

  Translate the following English text into Basque.

  Then, provide a simple, fun explanation of the key differences between the two languages in this specific translation. 
  Explain the grammar in a way a 10-year-old would understand. 
  Avoid technical jargon like "ergative", "absolutive", or "agglutinative". 
  Instead, use simple words like "subject", "object", "word-parts", "markers", or "action-doer".
  For each key difference, provide a "Concept" (the basic idea), a "Simple Explanation" (how it works), and an "Example".

  English Text: {{{englishText}}}`,
});

const translateAndExplainFlow = ai.defineFlow(
  {
    name: 'translateAndExplainFlow',
    inputSchema: TranslateAndExplainInputSchema,
    outputSchema: TranslateAndExplainOutputSchema,
  },
  async input => {
    const {output} = await translateAndExplainPrompt(input);
    return output!;
  }
);
