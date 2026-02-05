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
  concept: z.string().describe('The grammatical concept being explained.'),
  explanation: z.string().describe('The detailed explanation of the concept.'),
  example: z.string().describe('An example sentence or phrase pair (English/Basque) illustrating the concept.'),
});

const TranslateAndExplainOutputSchema = z.object({
  basqueTranslation: z.string().describe('The Basque translation of the input text.'),
  explanation: z.array(ExplanationItemSchema)
    .describe(
      'A structured explanation of the grammatical differences between the English and Basque versions, with contrastive hints.'
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
  prompt: `You are a helpful language tutor specializing in Basque and English.

  Translate the following English text into Basque.

  Then, provide a brief, structured explanation of the key grammatical or syntactical differences between the two languages in this specific translation. For each key difference, provide the concept, a detailed explanation, and an illustrative example. Include contrastive hints to help the learner understand schema formation.

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
