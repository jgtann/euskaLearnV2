'use server';

import { synthesizeSpeech } from '@/ai/flows/text-to-speech-flow';
import { z } from 'zod';
import wav from 'wav';

const speechSchema = z.object({
  text: z.string().min(1),
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


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
    if (!result.pcmAudio) {
      return { error: 'Failed to synthesize speech. No audio data received.' };
    }

    const audioBuffer = Buffer.from(result.pcmAudio, 'base64');
    const wavData = await toWav(audioBuffer);
    
    return { data: { audioDataUri: 'data:audio/wav;base64,' + wavData } };

  } catch (error: any) {
    console.error(error);
    return { error: `Failed to synthesize speech. Details: ${error.message}` };
  }
}
