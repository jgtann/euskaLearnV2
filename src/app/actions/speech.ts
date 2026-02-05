'use server';

import { synthesizeSpeech } from '@/ai/flows/text-to-speech-flow';
import { z } from 'zod';

const speechSchema = z.object({
  text: z.string().min(1),
  voice: z.enum(['male', 'female']).default('female'),
});

export async function getSpeech(prevState: any, formData: FormData) {
  const validatedFields = speechSchema.safeParse({
    text: formData.get('text'),
    voice: formData.get('voice'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid input.',
    };
  }

  try {
    const result = await synthesizeSpeech(validatedFields.data);
    return { data: result };
  } catch (error: any) {
    console.error(error);
    return { error: `Failed to synthesize speech. Details: ${error.message}` };
  }
}
