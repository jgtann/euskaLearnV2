'use server';
/**
 * @fileOverview An AI-powered self-introduction builder.
 *
 * - buildIntroduction - A function that builds a self-introduction in Basque.
 * - BuildIntroductionInput - The input type for the buildIntroduction function.
 * - BuildIntroductionOutput - The return type for the buildIntroduction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BuildIntroductionInputSchema = z.object({
  name: z.string().describe("The user's name."),
  from: z.string().describe('Where the user is from.'),
  hobby: z.string().describe("The user's hobby."),
  formality: z.enum(['formal', 'informal']).describe('The desired formality level.'),
});
export type BuildIntroductionInput = z.infer<typeof BuildIntroductionInputSchema>;

const BuildIntroductionOutputSchema = z.object({
  introduction: z.string().describe('The generated self-introduction in Basque.'),
  explanation: z
    .string()
    .describe(
      'An explanation of the vocabulary and grammar used in the introduction.'
    ),
});
export type BuildIntroductionOutput = z.infer<typeof BuildIntroductionOutputSchema>;

export async function buildIntroduction(input: BuildIntroductionInput): Promise<BuildIntroductionOutput> {
  return buildIntroductionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buildIntroductionPrompt',
  input: {schema: BuildIntroductionInputSchema},
  output: {schema: BuildIntroductionOutputSchema},
  prompt: `You are a Basque language tutor. Create a self-introduction in Basque for a learner based on the following details. The formality should be {{{formality}}}.

  Name: {{{name}}}
  From: {{{from}}}
  Hobby: {{{hobby}}}

  After the introduction, provide a simple explanation of the vocabulary and grammar used, especially for a beginner.
  For example, explain "ni ... naiz" (I am ...), "nire izena ... da" (my name is ...), and how to mention where they are from and their hobbies.`,
});

const buildIntroductionFlow = ai.defineFlow(
  {
    name: 'buildIntroductionFlow',
    inputSchema: BuildIntroductionInputSchema,
    outputSchema: BuildIntroductionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
