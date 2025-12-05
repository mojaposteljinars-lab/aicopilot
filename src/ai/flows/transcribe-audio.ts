import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const transcriberFlow = defineFlow(
  {
    name: 'transcriberFlow',
    inputSchema: z.object({ audio: z.string() }), // Expecting base64 audio string
    outputSchema: z.string(),
  },
  async ({ audio }) => {
    
    const llmResponse = await generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [
        { text: `Transcribe the following audio. Only return the transcribed text, with no additional commentary.` },
        { media: { url: `data:audio/webm;base64,${audio}` } }
      ],
      config: {
        temperature: 0.4,
      }
    });

    return llmResponse.text();
  }
);
