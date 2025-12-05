import { configure } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Import all the flows
import { generateAgentAdviceFlow } from './flows/generate-agent-advice';
import { generateConciseFlashAnswersFlow } from './flows/generate-concise-flash-answers';
import { generateDetailedAnswersFlow } from './flows/generate-detailed-answers';
import { generateReasonedAnswersFlow } from './flows/generate-reasoned-answers';
import { tailorAnswersToJobDescriptionFlow } from './flows/tailor-answers-to-job-description';
import { tailorAnswersToResumeFlow } from './flows/tailor-answers-to-resume';
import { transcribeAudio } from './flows/transcribe-audio';

configure({
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracing: true,
});

// Create a wrapper function for transcription that matches the Genkit flow pattern
const transcriberFlow = async ({ input }: { input: { audio: string } }) => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPGRAM_API_KEY environment variable is not set');
  }
  return await transcribeAudio(input.audio, apiKey);
};

export {
  transcriberFlow,
  generateAgentAdviceFlow,
  generateConciseFlashAnswersFlow,
  generateDetailedAnswersFlow,
  generateReasonedAnswersFlow,
  tailorAnswersToJobDescriptionFlow,
  tailorAnswersToResumeFlow,
};
