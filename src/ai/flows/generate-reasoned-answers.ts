'use server';

/**
 * @fileOverview A flow that generates deep, step-by-step problem-solving approaches in 'Reasoning' mode for interview scenarios.
 *
 * - generateReasonedAnswer - A function that generates reasoned answers.
 * - GenerateReasonedAnswerInput - The input type for the generateReasonedAnswer function.
 * - GenerateReasonedAnswerOutput - The return type for the generateReasonedAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReasonedAnswerInputSchema = z.object({
  question: z.string().describe('The interview question to answer.'),
  userContext: z.string().describe('The user context including resume and speaking style.'),
  jobContext: z.string().describe('The job context including company and description.'),
});

export type GenerateReasonedAnswerInput = z.infer<typeof GenerateReasonedAnswerInputSchema>;

const GenerateReasonedAnswerOutputSchema = z.object({
  answer: z.string().describe('The reasoned answer to the interview question.'),
});

export type GenerateReasonedAnswerOutput = z.infer<typeof GenerateReasonedAnswerOutputSchema>;

export async function generateReasonedAnswer(input: GenerateReasonedAnswerInput): Promise<GenerateReasonedAnswerOutput> {
  return generateReasonedAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReasonedAnswerPrompt',
  input: {schema: GenerateReasonedAnswerInputSchema},
  output: {schema: GenerateReasonedAnswerOutputSchema},
  prompt: `You are an expert interviewer candidate, and you are in a job interview.

You will answer the question in a deep, step-by-step problem-solving approach.

Use the following information to answer the question:

User Context: {{{userContext}}}
Job Context: {{{jobContext}}}

Question: {{{question}}}

Answer:`,
});

const generateReasonedAnswerFlow = ai.defineFlow(
  {
    name: 'generateReasonedAnswerFlow',
    inputSchema: GenerateReasonedAnswerInputSchema,
    outputSchema: GenerateReasonedAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
