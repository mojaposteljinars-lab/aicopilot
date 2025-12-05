import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';

export async function POST(req: NextRequest) {
  try {
    const { audio } = await req.json();

    if (!audio) {
      return NextResponse.json({ error: 'No audio data provided.' }, { status: 400 });
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.error("DEEPGRAM_API_KEY environment variable is not set.");
      return NextResponse.json({ error: 'Server misconfiguration: DEEPGRAM_API_KEY not found.' }, { status: 500 });
    }
    
    // Call the transcription function directly
    const transcript = await transcribeAudio(audio, apiKey);

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error in transcription API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to transcribe audio: ${errorMessage}` }, { status: 500 });
  }
}
