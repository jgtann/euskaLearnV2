'use server';

/**
 * @fileOverview An AI-powered Basque grammar and spelling checker.
 *
 * - checkBasque - A function that analyzes Basque text for correctness.
 * - CheckBasqueInput - The input type for the checkBasque function.
 * - CheckBasqueOutput - The return type for the checkBasque function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckBasqueInputSchema = z.object({
  text: z.string().describe('The Basque text to check for grammar and spelling.'),
});
export type CheckBasqueInput = z.infer<typeof CheckBasqueInputSchema>;

const CheckBasqueOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the input text is grammatically correct and spelled properly.'),
  explanation: z.string().describe('A simple, friendly explanation of what is correct or what needs fixing, using language a 10-year-old would understand.'),
  correctedText: z.string().nullable().describe('The corrected version of the text, or null if it was already correct.'),
});
export type CheckBasqueOutput = z.infer<typeof CheckBasqueOutputSchema>;

export async function checkBasque(input: CheckBasqueInput): Promise<CheckBasqueOutput> {
  return checkBasqueFlow(input);
}

const checkBasquePrompt = ai.definePrompt({
  name: 'checkBasquePrompt',
  input: {schema: CheckBasqueInputSchema},
  output: {schema: CheckBasqueOutputSchema},
  prompt: `You are a friendly Basque language tutor for beginners. 
  Analyze the following Basque text: "{{text}}"

  1. Decide if it is grammatically correct and spelled right.
  2. If there are mistakes (like wrong case markers, bad verb agreement, or spelling), explain them simply.
  3. Use child-friendly language (e.g., call markers "word-parts" or "stickers").
  4. Avoid jargon like "ergative" or "agglutinative".
  5. If it's wrong, provide the "Corrected version".
  6. If it's right, give a happy compliment!`,
});

const checkBasqueFlow = ai.defineFlow(
  {
    name: 'checkBasqueFlow',
    inputSchema: CheckBasqueInputSchema,
    outputSchema: CheckBasqueOutputSchema,
  },
  async input => {
    const {output} = await checkBasquePrompt(input);
    return output!;
  }
);
