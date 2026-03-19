
'use server';

/**
 * @fileOverview A pedagogical translanguaging AI flow that uses English as a temporary bridge.
 * 
 * Implements the "Scaffolding Fade" logic (Phase 1-3).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateAndExplainInputSchema = z.object({
  englishText: z.string().describe('The English text to translate and explain.'),
  phase: z.enum(['bridge', 'pivot', 'retraction']).default('bridge').describe('The current scaffolding phase of the learner.'),
});
export type TranslateAndExplainInput = z.infer<typeof TranslateAndExplainInputSchema>;

const ExplanationItemSchema = z.object({
  concept: z.string().describe('The linguistic construction or "brick" being explained.'),
  explanation: z.string().describe('A simple explanation using established metaphors (Boss Badge, Inside Brick, etc.).'),
  example: z.string().describe('Contrastive example comparing English and Basque structure.'),
});

const TranslateAndExplainOutputSchema = z.object({
  basqueTranslation: z.string().describe('The Basque translation.'),
  explanation: z.array(ExplanationItemSchema),
  pedagogicalNote: z.string().describe('A brief note about the "Scaffolding Fade" transition for this construction.'),
});
export type TranslateAndExplainOutput = z.infer<typeof TranslateAndExplainOutputSchema>;

export async function translateAndExplain(input: TranslateAndExplainInput): Promise<TranslateAndExplainOutput> {
  return translateAndExplainFlow(input);
}

const translateAndExplainPrompt = ai.definePrompt({
  name: 'translateAndExplainPrompt',
  input: {schema: TranslateAndExplainInputSchema},
  output: {schema: TranslateAndExplainOutputSchema},
  prompt: `You are a supportive Basque language tutor implementing a "Translanguaging Bridge".
  
  CURRENT PHASE: {{{phase}}}
  
  1. Translate the English text: "{{{englishText}}}" into Basque.
  2. Provide a breakdown of the "Lego Bricks" used.
  3. Use child-friendly metaphors:
     - Ergative (-k) = "Boss Badge"
     - Definite Article (-a) = "The-Brick"
     - SOV Order = "The Syntax Engine"
     - Suffixes = "Snap-tiles"
  
  ADJUST EXPLANATION DEPTH BY PHASE:
  - Phase 'bridge': High English scaffolding, detailed micro-contrastive notes.
  - Phase 'pivot': Use Basque meta-terms (Nork, Nor, Nori) alongside English.
  - Phase 'retraction': Minimal English, focus on functional immersion notes.
  
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
