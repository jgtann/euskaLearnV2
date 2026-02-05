'use server';

/**
 * @fileOverview A personalized error analysis AI agent.
 *
 * - analyzeErrors - A function that handles the error analysis process.
 * - AnalyzeErrorsInput - The input type for the analyzeErrors function.
 * - AnalyzeErrorsOutput - The return type for the analyzeErrors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeErrorsInputSchema = z.object({
  userData: z
    .string()
    .describe("User's learning data, including attempted words and correctness."),
});
export type AnalyzeErrorsInput = z.infer<typeof AnalyzeErrorsInputSchema>;

const AnalyzeErrorsOutputSchema = z.object({
  identifiedMorphemes: z
    .string()
    .describe('The morphemes that the user struggles with the most.'),
  errorHeatmap: z
    .string()
    .describe('A description of the most common errors made by the user.'),
});
export type AnalyzeErrorsOutput = z.infer<typeof AnalyzeErrorsOutputSchema>;

export async function analyzeErrors(input: AnalyzeErrorsInput): Promise<AnalyzeErrorsOutput> {
  return analyzeErrorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeErrorsPrompt',
  input: {schema: AnalyzeErrorsInputSchema},
  output: {schema: AnalyzeErrorsOutputSchema},
  prompt: `You are an expert language learning assistant specializing in Basque.

You will use this user data to identify the morphemes the user struggles with the most, creating an error heatmap of the most common errors. Focus on Ergative *-k* vs. Dative *-ri*.

Use the following as the primary source of information about the user.

User Data: {{{userData}}}`,
});

const analyzeErrorsFlow = ai.defineFlow(
  {
    name: 'analyzeErrorsFlow',
    inputSchema: AnalyzeErrorsInputSchema,
    outputSchema: AnalyzeErrorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
