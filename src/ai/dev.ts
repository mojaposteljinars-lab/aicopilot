import { config } from 'dotenv';
config();

import '@/ai/flows/tailor-answers-to-job-description.ts';
import '@/ai/flows/tailor-answers-to-resume.ts';
import '@/ai/flows/generate-reasoned-answers.ts';
import '@/ai/flows/generate-detailed-answers.ts';
import '@/ai/flows/generate-concise-flash-answers.ts';