'use server';

/**
 * @fileOverview A flow for generating strategic interview advice in 'Agent' mode.
 *
 * - generateAgentAdvice - A function that generates strategic advice.
 * - GenerateAgentAdviceInput - The input type for the generateAgentAdvice function.
 * - GenerateAgentAdviceOutput - The return type for the generateAgentAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAgentAdviceInputSchema = z.object({
  question: z.string().describe('The interview question to answer.'),
  userContext: z.object({
    resume: z.string().describe("The user's resume content."),
  }),
  jobContext: z.object({
    jobDescription: z.string().describe('The job description for the role.'),
  }),
});
export type GenerateAgentAdviceInput = z.infer<
  typeof GenerateAgentAdviceInputSchema
>;

const GenerateAgentAdviceOutputSchema = z.object({
  answer: z.string().describe('Strategic advice for the interview question.'),
});
export type GenerateAgentAdviceOutput = z.infer<
  typeof GenerateAgentAdviceOutputSchema
>;

export async function generateAgentAdvice(
  input: GenerateAgentAdviceInput
): Promise<GenerateAgentAdviceOutput> {
  return generateAgentAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAgentAdvicePrompt',
  input: {
    schema: GenerateAgentAdviceInputSchema,
  },
  output: {
    schema: GenerateAgentAdviceOutputSchema,
  },
  prompt: `You are an AI agent providing strategic advice for a job interview.

Analyze the user's resume and the job description to provide a strategic answer to the question.
Your response should not be a direct answer, but rather advice on how to best approach the question, what to highlight from their experience, and how to align with the company's values.

User Resume: {{{userContext.resume}}}
Job Description: {{{jobContext.jobDescription}}}

Question: {{{question}}}

Provide strategic advice on how to answer this question.`,
});

const generateAgentAdviceFlow = ai.defineFlow(
  {
    name: 'generateAgentAdviceFlow',
    inputSchema: GenerateAgentAdviceInputSchema,
    outputSchema: GenerateAgentAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
