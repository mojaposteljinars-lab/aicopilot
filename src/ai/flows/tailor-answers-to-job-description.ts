'use server';

/**
 * @fileOverview This file defines a Genkit flow that tailors AI-generated answers based on a provided job description.
 *
 * - tailorAnswersToJobDescription - The main function to tailor answers.
 * - TailorAnswersToJobDescriptionInput - The input type for the tailorAnswersToJobDescription function.
 * - TailorAnswersToJobDescriptionOutput - The output type for the tailorAnswersToJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailorAnswersToJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description for the role.'),
  resume: z.string().describe('The user resume.'),
  question: z.string().describe('The interview question asked by the interviewer.'),
  aiStyle: z.enum(['Flash', 'Pro', 'Reasoning', 'Flash-Lite', 'Agent']).default('Pro').describe('The desired AI response style.'),
});
export type TailorAnswersToJobDescriptionInput = z.infer<
  typeof TailorAnswersToJobDescriptionInputSchema
>;

const TailorAnswersToJobDescriptionOutputSchema = z.object({
  answer: z.string().describe('The tailored AI-generated answer.'),
});
export type TailorAnswersToJobDescriptionOutput = z.infer<
  typeof TailorAnswersToJobDescriptionOutputSchema
>;

const aiStylePrompts = {
  Flash: 'Provide a very brief answer, under 10 words.',
  ['Flash-Lite']: 'Provide an extremely brief answer, under 5 words.',
  Pro: 'Provide a comprehensive and structured explanation.',
  Reasoning: 'Provide a detailed, step-by-step problem-solving approach.',
  Agent: 'Provide strategic advice on how to approach the question.',
};

export async function tailorAnswersToJobDescription(
  input: TailorAnswersToJobDescriptionInput
): Promise<TailorAnswersToJobDescriptionOutput> {
  return tailorAnswersToJobDescriptionFlow(input);
}

const tailorAnswersToJobDescriptionPrompt = ai.definePrompt({
  name: 'tailorAnswersToJobDescriptionPrompt',
  input: {schema: TailorAnswersToJobDescriptionInputSchema},
  output: {schema: TailorAnswersToJobDescriptionOutputSchema},
  prompt: `You are an AI assistant designed to help a candidate answer interview questions.

  Here is the job description:
  {{jobDescription}}

  Here is the candidate's resume:
  {{resume}}

  Here is the interview question:
  {{question}}

  AI Style: {{aiStylePrompts.[aiStyle]}}

  Please generate an answer tailored to the job description and resume.
  `,
});

const tailorAnswersToJobDescriptionFlow = ai.defineFlow(
  {
    name: 'tailorAnswersToJobDescriptionFlow',
    inputSchema: TailorAnswersToJobDescriptionInputSchema,
    outputSchema: TailorAnswersToJobDescriptionOutputSchema,
  },
  async input => {
    const aiStylePrompt = aiStylePrompts[input.aiStyle];
    const {output} = await tailorAnswersToJobDescriptionPrompt({
      ...input,
      aiStylePrompts,
    });
    return output!;
  }
);
