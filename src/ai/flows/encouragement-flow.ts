'use server';
/**
 * @fileOverview An AI-powered flow to generate encouragement messages.
 *
 * - getEncouragement - A function that returns a Basque encouragement phrase.
 * - GetEncouragementInput - The input type for the getEncouragement function.
 * - GetEncouragementOutput - The return type for the getEncouragement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetEncouragementInputSchema = z.object({
  score: z.number().describe("The user's mastery score."),
});
export type GetEncouragementInput = z.infer<typeof GetEncouragementInputSchema>;

const GetEncouragementOutputSchema = z.object({
  basque: z.string().describe('A short, one-sentence encouragement in Basque.'),
  english: z.string().describe('The English translation of the Basque encouragement.'),
});
export type GetEncouragementOutput = z.infer<typeof GetEncouragementOutputSchema>;

export async function getEncouragement(input: GetEncouragementInput): Promise<GetEncouragementOutput> {
  return encouragementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'encouragementPrompt',
  input: {schema: GetEncouragementInputSchema},
  output: {schema: GetEncouragementOutputSchema},
  prompt: `You are a supportive Basque language teacher. 
      The student just finished a review session with a mastery score of {{{score}}}. 
      Generate a short, one-sentence encouragement in Basque and its English translation.
      If the score is high, be more celebratory. If low, be more encouraging to keep going.
      Use authentic Basque idioms like "Aupa!", "Ederki!", "Aitzina!", or "Segi horrela!".`,
});

const encouragementFlow = ai.defineFlow(
  {
    name: 'encouragementFlow',
    inputSchema: GetEncouragementInputSchema,
    outputSchema: GetEncouragementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
