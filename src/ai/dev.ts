'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-error-analysis.ts';
import '@/ai/flows/ai-powered-translanguaging.ts';
import '@/ai/flows/self-introduction-flow.ts';
import '@/ai/flows/text-to-speech-flow.ts';
import '@/ai/flows/encouragement-flow.ts';
import '@/ai/flows/sentence-examples-flow.ts';
import '@/ai/flows/explain-sentence-grammar-flow.ts';
import '@/ai/flows/check-basque-flow.ts';
