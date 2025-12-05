import { configure } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Import all the flows
import { transcriberFlow } from './flows/transcribe-audio';
import { generateAgentAdviceFlow } from './flows/generate-agent-advice';
import { generateConciseFlashAnswersFlow } from './flows/generate-concise-flash-answers';
import { generateDetailedAnswersFlow } from './flows/generate-detailed-answers';
import { generateReasonedAnswersFlow } from './flows/generate-reasoned-answers';
import { tailorAnswersToJobDescriptionFlow } from './flows/tailor-answers-to-job-description';
import { tailorAnswersToResumeFlow } from './flows/tailor-answers-to-resume';

configure({
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracing: true,
});

export {
  transcriberFlow,
  generateAgentAdviceFlow,
  generateConciseFlashAnswersFlow,
  generateDetailedAnswersFlow,
  generateReasonedAnswersFlow,
  tailorAnswersToJobDescriptionFlow,
  tailorAnswersToResumeFlow,
};
