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
    .describe("User's learning data, including items and their correct/incorrect counts."),
});
export type AnalyzeErrorsInput = z.infer<typeof AnalyzeErrorsInputSchema>;

const AnalyzeErrorsOutputSchema = z.object({
  identifiedMorphemes: z
    .string()
    .describe('The morphemes that the user seems to struggle with the most, based on inference.'),
  errorHeatmap: z
    .string()
    .describe('A summary of the most common inferred error patterns made by the user.'),
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
Analyze the following user learning data to identify which morphemes the user struggles with the most.
The data provides a list of Basque words/phrases and the user's correct/incorrect counts for them.
From this, infer common error patterns. Focus especially on identifying confusion between cases like Ergative *-k* and Dative *-ri*.
Create an "error heatmap" summarizing these patterns.

IMPORTANT: Format the output cleanly. Use clear line breaks between numbered lists and bullet points so it is easy to read.

User Data:
{{{userData}}}`,
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
