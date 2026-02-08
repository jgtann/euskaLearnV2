'use server';

import { synthesizeSpeech } from '@/ai/flows/text-to-speech-flow';
import { z } from 'zod';

const speechSchema = z.object({
  text: z.string().min(1),
});

export async function getSpeech(prevState: any, formData: FormData) {
  const validatedFields = speechSchema.safeParse({
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid input.',
    };
  }

  try {
    const result = await synthesizeSpeech(validatedFields.data);
    if (!result.audioDataUri) {
      return { error: 'Failed to synthesize speech. No audio data received.' };
    }

    return { data: { audioDataUri: result.audioDataUri } };

  } catch (error: any) {
    console.error(error);
    return { error: `Failed to synthesize speech. Details: ${error.message}` };
  }
}
