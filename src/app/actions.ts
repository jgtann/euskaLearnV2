// @ts-nocheck
'use server';

import { analyzeErrors } from '@/ai/flows/personalized-error-analysis';
import { translateAndExplain } from '@/ai/flows/ai-powered-translanguaging';
import { z } from 'zod';

const translateSchema = z.object({
  text: z.string().min(1, { message: 'Please enter some text to translate.' }),
});

export async function getTranslation(prevState: any, formData: FormData) {
  const validatedFields = translateSchema.safeParse({
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Please enter some text.',
    };
  }

  try {
    const result = await translateAndExplain({ englishText: validatedFields.data.text });
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get translation. Please try again later.' };
  }
}

export async function getErrorAnalysis() {
  // Mock user data as per the prompt's context
  const mockUserData = `
    Attempted: "Txakurrak korrika egiten du", Correct: "Txakurrak korrika egiten du"
    Attempted: "Nire anaiaK etorri da", Correct: "Nire anaia etorri da" (Error: Unnecessary Ergative -k)
    Attempted: "MutilaRI liburua eman nion", Correct: "Mutilari liburua eman nion"
    Attempted: "KatuAK sagua jan du", Correct: "Katuak sagua jan du"
    Attempted: "LagunaK opari bat ekarri dit", Correct: "Lagunak opari bat ekarri dit" (Error: Unnecessary Ergative -k on intransitive)
    Attempted: "IkasleARI galdera bat egin diot", Correct: "Ikasleari galdera bat egin diot"
    Attempted: "GizonAK autoa erosi du", Correct: "Gizonak autoa erosi du"
    Attempted: "Zuk erantzun du", Correct: "Zuk erantzun duzu" (Verb conjugation error)
    Attempted: "EmakumeAK sagarrak jaten ditu", Correct: "Emakumeak sagarrak jaten ditu"
    Attempted: "Nire lagunARI deitu nion", Correct: "Nire lagunari deitu nion"
    Attempted: "Medikuak gaixoa sendatu du", Correct: "Medikuak gaixoa sendatu du"
    Attempted: "IrakasleaK liburuak irakurtzen ditu", Correct: "Irakasleak liburuak irakurtzen ditu"
  `;

  try {
    const result = await analyzeErrors({ userData: mockUserData });
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to analyze errors. Please try again later.' };
  }
}
