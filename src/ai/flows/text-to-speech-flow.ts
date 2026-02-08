'use server';
/**
 * @fileOverview A Text-to-Speech (TTS) AI flow.
 *
 * - synthesizeSpeech - A function that converts text to speech.
 * - SynthesizeSpeechInput - The input type for the synthesizeSpeech function.
 * - SynthesizeSpeechOutput - The return type for the synthesizeSpeech function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const SynthesizeSpeechInputSchema = z.object({
  text: z.string().describe('The text to synthesize.'),
});
export type SynthesizeSpeechInput = z.infer<typeof SynthesizeSpeechInputSchema>;

const SynthesizeSpeechOutputSchema = z.object({
  pcmAudio: z.string().describe('The synthesized audio as a base64 encoded PCM string.'),
});
export type SynthesizeSpeechOutput = z.infer<typeof SynthesizeSpeechOutputSchema>;

export async function synthesizeSpeech(input: SynthesizeSpeechInput): Promise<SynthesizeSpeechOutput> {
  return synthesizeSpeechFlow(input);
}

const synthesizeSpeechFlow = ai.defineFlow(
  {
    name: 'synthesizeSpeechFlow',
    inputSchema: SynthesizeSpeechInputSchema,
    outputSchema: SynthesizeSpeechOutputSchema,
  },
  async input => {
    const { text } = input;
    
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                languageCode: 'eu-ES',
            },
        },
        prompt: text,
    });

    if (!media) {
      throw new Error('no media returned');
    }

    // media.url is 'data:audio/pcm;base64,<data>'
    // Extract just the base64 data part.
    const pcmAudio = media.url.substring(media.url.indexOf(',') + 1);

    return {
      pcmAudio,
    };
  }
);
