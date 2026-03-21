'use server';

/**
 * @fileOverview An AI flow that generates level-appropriate Basque reading passages.
 * 
 * Part of the "Input-Rich" usage-based sequencing strategy.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePassageInputSchema = z.object({
  worldId: z.string().describe('The current learning world (e.g., names, actions).'),
  topic: z.string().describe('The thematic topic for the passage.'),
});
export type GeneratePassageInput = z.infer<typeof GeneratePassageInputSchema>;

const NoticingHintSchema = z.object({
  basque: z.string().describe('The Basque construction to notice.'),
  explanation: z.string().describe('Why this construction is important in this context.'),
});

const GeneratePassageOutputSchema = z.object({
  title: z.string().describe('Title of the passage.'),
  basqueText: z.string().describe('A short (3-5 sentence) Basque passage.'),
  englishTranslation: z.string().describe('The English translation of the passage.'),
  noticingHints: z.array(NoticingHintSchema).describe('Key morphological "bricks" to notice in the text.'),
});
export type GeneratePassageOutput = z.infer<typeof GeneratePassageOutputSchema>;

export async function generatePassage(input: GeneratePassageInput): Promise<GeneratePassageOutput> {
  return generatePassageFlow(input);
}

const generatePassagePrompt = ai.definePrompt({
  name: 'generatePassagePrompt',
  input: {schema: GeneratePassageInputSchema},
  output: {schema: GeneratePassageOutputSchema},
  prompt: `You are a Basque language educator. Create a short, supportive reading passage for a CEFR A1 learner.
  
  WORLD CONTEXT: {{{worldId}}}
  TOPIC: {{{topic}}}
  
  REQUIREMENTS:
  1. Use very simple language (A1 level).
  2. Focus on recurring high-frequency constructions relevant to the World.
  3. If World is 'names', focus on articles (-a) and plurals (-ak).
  4. If World is 'actions', focus on the Ergative (-k) and simple verbs (ukan, egin).
  5. If World is 'location', focus on 'n' (inessive) and 'egon'.
  6. Provide 3 "Noticing Hints" that point out specific suffixes or word orders.
  
  Format the output as a friendly story or description.`,
});

const generatePassageFlow = ai.defineFlow(
  {
    name: 'generatePassageFlow',
    inputSchema: GeneratePassageInputSchema,
    outputSchema: GeneratePassageOutputSchema,
  },
  async input => {
    const {output} = await generatePassagePrompt(input);
    return output!;
  }
);
