'use server';
/**
 * @fileOverview A Text-to-Speech (TTS) AI flow.
 *
 * - synthesizeSpeech - A function that converts text to speech.
 * - SynthesizeSpeechInput - The input type for the synthesizeSpeech function.
 * - SynthesizeSpeechOutput - The return type for the synthesizeSpeech function.
 */

import {ai, googleAI} from '@/ai/genkit';
import {z} from 'genkit';

const SynthesizeSpeechInputSchema = z.object({
  text: z.string().describe('The text to synthesize.'),
  voice: z.enum(['male', 'female']).default('female').describe('The voice to use for synthesis.'),
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
    const { text, voice } = input;
    
    // Algenib is male, Achernar is female-like
    const voiceName = voice === 'male' ? 'Algenib' : 'Achernar';

    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName },
                },
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
