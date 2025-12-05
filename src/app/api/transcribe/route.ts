import { NextRequest, NextResponse } from 'next/server';
import { run } from 'genkit';
import { transcriberFlow } from '@/ai/server';

export async function POST(req: NextRequest) {
  try {
    const { audio } = await req.json();

    if (!audio) {
      return NextResponse.json({ error: 'No audio data provided.' }, { status: 400 });
    }

    if (!transcriberFlow) {
      console.error("Transcriber flow is not defined. Genkit initialization might have failed.");
      return NextResponse.json({ error: 'Server misconfiguration: Transcriber flow not found.' }, { status: 500 });
    }
    
    // Run the Genkit flow on the server with the audio data
    const transcript = await run(transcriberFlow, { input: { audio } });

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error in transcription API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to transcribe audio: ${errorMessage}` }, { status: 500 });
  }
}
