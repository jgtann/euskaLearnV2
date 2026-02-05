'use server';

import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { z } from 'zod';

const ttsSchema = z.object({
  text: z.string().min(1),
  gender: z.enum(['male', 'female']),
});

export async function getSpeech(text: string, gender: 'male' | 'female' = 'male') {
    const validatedFields = ttsSchema.safeParse({ text, gender });
    if (!validatedFields.success) {
        return { error: "Invalid input for speech synthesis." };
    }
    try {
        const result = await textToSpeech({ text: validatedFields.data.text, gender: validatedFields.data.gender });
        return { data: result };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to synthesize speech. Please try again later.' };
    }
}
