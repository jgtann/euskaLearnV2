// @ts-nocheck
'use server';

import { analyzeErrors } from '@/ai/flows/personalized-error-analysis';
import { translateAndExplain } from '@/ai/flows/ai-powered-translanguaging';
import { buildIntroduction } from '@/ai/flows/self-introduction-flow';
import { getEncouragement as getEncouragementFlow } from '@/ai/flows/encouragement-flow';
import { getSentenceExamples } from '@/ai/flows/sentence-examples-flow';
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

export async function getErrorAnalysis(userData: string) {
  if (!userData) {
    return { error: 'No user data provided for analysis.' };
  }
  
  try {
    const result = await analyzeErrors({ userData: userData });
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to analyze errors. Please try again later.' };
  }
}

const introductionSchema = z.object({
    name: z.string().min(1),
    from: z.string().min(1),
    hobby: z.string().min(1),
    formality: z.enum(['formal', 'informal']),
});

export async function getIntroduction(prevState: any, formData: FormData) {
    const validatedFields = introductionSchema.safeParse({
        name: formData.get('name'),
        from: formData.get('from'),
        hobby: formData.get('hobby'),
        formality: formData.get('formality'),
    });

    if (!validatedFields.success) {
        return {
            error: "Please fill out all fields."
        };
    }

    try {
        const result = await buildIntroduction(validatedFields.data);
        return { data: result };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to build introduction. Please try again later.' };
    }
}

export async function getEncouragementAction(score: number) {
  if (typeof score !== 'number') {
    return { error: 'Invalid score provided.' };
  }

  try {
    const result = await getEncouragementFlow({ score });
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get encouragement. Please try again later.' };
  }
}

const sentenceExamplesSchema = z.object({
  basqueWord: z.string(),
  englishWord: z.string(),
});

export async function getSentenceExamplesAction(prevState: any, formData: FormData) {
    const validatedFields = sentenceExamplesSchema.safeParse({
        basqueWord: formData.get('basqueWord'),
        englishWord: formData.get('englishWord'),
    });

    if (!validatedFields.success) {
        return {
            error: "Invalid input provided for sentence examples."
        };
    }

    try {
        const result = await getSentenceExamples(validatedFields.data);
        return { data: result };
    } catch (error: any) {
        console.error('Sentence Example Error:', error);
        return { error: `Failed to generate sentence examples. Details: ${error.message}` };
    }
}
