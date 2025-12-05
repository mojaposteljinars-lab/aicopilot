'use server';

/**
 * @fileOverview A flow for generating concise, flash-style answers for interview questions.
 *
 * - generateConciseFlashAnswer - A function that generates a concise answer to an interview question.
 * - GenerateConciseFlashAnswerInput - The input type for the generateConciseFlashAnswer function.
 * - GenerateConciseFlashAnswerOutput - The return type for the generateConciseFlashAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConciseFlashAnswerInputSchema = z.object({
  question: z.string().describe('The interview question to answer.'),
  userContext: z.string().optional().describe('The user context (resume, speaking style).'),
  jobContext: z.string().optional().describe('The job context (company, description).'),
});
export type GenerateConciseFlashAnswerInput = z.infer<
  typeof GenerateConciseFlashAnswerInputSchema
>;

const GenerateConciseFlashAnswerOutputSchema = z.object({
  answer: z.string().describe('A concise answer to the interview question.'),
});
export type GenerateConciseFlashAnswerOutput = z.infer<
  typeof GenerateConciseFlashAnswerOutputSchema
>;

export async function generateConciseFlashAnswer(
  input: GenerateConciseFlashAnswerInput
): Promise<GenerateConciseFlashAnswerOutput> {
  return generateConciseFlashAnswersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConciseFlashAnswerPrompt',
  input: {
    schema: GenerateConciseFlashAnswerInputSchema,
  },
  output: {
    schema: GenerateConciseFlashAnswerOutputSchema,
  },
  prompt: `You are an AI assistant designed to provide concise answers to interview questions.\

Context:\
{% if userContext %}User Context: {{{userContext}}}{% endif %}
{% if jobContext %}Job Context: {{{jobContext}}}{% endif %}

Question: {{{question}}}

Provide a concise answer (less than 10 words).`,
});

export const generateConciseFlashAnswersFlow = ai.defineFlow(
  {
    name: 'generateConciseFlashAnswersFlow',
    inputSchema: GenerateConciseFlashAnswerInputSchema,
    outputSchema: GenerateConciseFlashAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
