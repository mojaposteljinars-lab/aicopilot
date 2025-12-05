import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

/**
 * Transcribes the given audio data using the Deepgram Live (Streaming) SDK.
 * This function is designed to handle a single chunk of audio and return the transcript.
 * @param audio The base64-encoded audio data.
 * @param apiKey The Deepgram API key.
 * @returns The transcribed text.
 */
export function transcribeAudio(audio: string, apiKey: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (!apiKey) {
        return reject(new Error("API key is missing in transcribeAudio function."));
      }

      const deepgram = createClient(apiKey);
      const connection = deepgram.listen.live({
        model: 'nova-2',
        smart_format: true,
        punctuate: true,
        // The client is sending webm/opus, but we'll let Deepgram auto-detect
        // as this has proven to be a tricky parameter.
      });

      let fullTranscript = '';

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('Deepgram connection opened.');
        const audioBuffer = Buffer.from(audio, 'base64');
        connection.send(audioBuffer);
        connection.finish();
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcript = data.channel.alternatives[0].transcript;
        if (transcript) {
          fullTranscript += transcript + ' ';
        }
      });
      
      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('Deepgram connection closed. Final transcript:', fullTranscript.trim());
        resolve(fullTranscript.trim()); 
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error('Deepgram streaming error:', err);
        reject(new Error(`Deepgram error: ${err.message}`));
      });
      
    } catch (err) {
      console.error("Error in transcribeAudio (Deepgram Live) function setup:", err);
      if (err instanceof Error) {
        reject(new Error(`Failed to transcribe audio with Deepgram: ${err.message}`));
      } else {
        reject(new Error('An unknown error occurred during Deepgram transcription setup.'));
      }
    }
  });
}
