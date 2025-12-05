'use server';
/**
 * @fileOverview This file defines a Genkit flow to tailor AI-generated answers based on the user's resume, speaking style, and the job description.
 *
 * The flow takes UserContext and JobContext as input, injects them into the prompt, and generates tailored answers.
 * @interface TailorAnswersToResumeInput - Input type for the tailorAnswersToResume function.
 * @interface TailorAnswersToResumeOutput - Output type for the tailorAnswersToResume function.
 * @function tailorAnswersToResume - The main function that calls the tailorAnswersToResumeFlow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailorAnswersToResumeInputSchema = z.object({
  resume: z
    .string()
    .describe("The user's resume."),
  speakingStyle: z
    .string()
    .describe('The user speaking style.'),
  jobDescription: z
    .string()
    .describe('The job description for which the user is interviewing.'),
  question: z.string().describe('The interview question being asked.'),
});
export type TailorAnswersToResumeInput = z.infer<typeof TailorAnswersToResumeInputSchema>;

const TailorAnswersToResumeOutputSchema = z.object({
  answer: z.string().describe('The tailored answer to the interview question.'),
});
export type TailorAnswersToResumeOutput = z.infer<typeof TailorAnswersToResumeOutputSchema>;

export async function tailorAnswersToResume(input: TailorAnswersToResumeInput): Promise<TailorAnswersToResumeOutput> {
  return tailorAnswersToResumeFlow(input);
}

const tailorAnswersToResumePrompt = ai.definePrompt({
  name: 'tailorAnswersToResumePrompt',
  input: {schema: TailorAnswersToResumeInputSchema},
  output: {schema: TailorAnswersToResumeOutputSchema},
  prompt: `You are an expert interview coach, helping a candidate tailor their answers to a specific job and using the candidate's resume.

  The candidate's resume is:
  {{resume}}

  The job they are interviewing for has the following description:
  {{jobDescription}}

  The candidate's speaking style is:
  {{speakingStyle}}

  Please answer the following question, tailoring the answer to the candidate's resume, the job description, and the candidate's speaking style:
  {{question}}`,
});

export const tailorAnswersToResumeFlow = ai.defineFlow(
  {
    name: 'tailorAnswersToResumeFlow',
    inputSchema: TailorAnswersToResumeInputSchema,
    outputSchema: TailorAnswersToResumeOutputSchema,
  },
  async input => {
    const {output} = await tailorAnswersToResumePrompt(input);
    return output!;
  }
);
