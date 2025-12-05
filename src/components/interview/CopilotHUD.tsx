"use client";

import { useState, useEffect, useRef } from "react";
import type { JobContext, UserContext, InterviewMessage, HudSettings } from "@/lib/types";
import { GoogleGenerativeAI, Content, GenerationConfig } from "@google/generative-ai";
import { MessageList } from "./MessageList";
import { SubtitleView } from "./SubtitleView";
import { HUDControls } from "./HUDControls";
import { Button } from "../ui/button";
import { PanelTopClose, List, MessageSquareText, Loader2, Mic, AlertCircle } from "lucide-react";
import { useQueue } from "@/hooks/useQueue";
import { runFlow } from '@genkit-ai/next/client';

interface CopilotHUDProps {
  apiKey: string;
  userContext: UserContext;
  jobContext: JobContext;
  onStopSession: () => void;
  audioStream: MediaStream;
}

type HudView = 'list' | 'subtitle';

export function CopilotHUD({ apiKey, userContext, jobContext, onStopSession, audioStream }: CopilotHUDProps) {
  const [settings, setSettings] = useState<HudSettings>({
    fontSize: 16,
    opacity: 80,
    theme: 'cyan',
    aiStyle: 'Pro',
    isGhostMode: false,
  });

  const [view, setView] = useState<HudView>('subtitle');
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcriptionStatus, setTranscriptionStatus] = useState<string | null>(null);

  const { addToQueue, onMessage } = useQueue();

  const genAI = useRef(new GoogleGenerativeAI(apiKey));
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  
  // ... (systemInstruction and generationConfig remain the same)

  const systemInstruction: Content = {
    role: 'system',
    parts: [{
      text: `You are an expert interview coach. Your name is inferred from the resume.
      You must act as the candidate and answer interview questions based on the provided resume and tailored to the specific job description.
      AI Style: ${settings.aiStyle}.
      Resume: ${userContext.resume}
      Job Description: ${jobContext.jobDescription}
      Company: ${jobContext.companyName}`
    }]
  };

  const generationConfig: GenerationConfig = {
    stopSequences: ["\n\n\n"],
    maxOutputTokens: 1500,
    temperature: 0.7,
    topP: 0.6,
    topK: 15,
  };

  useEffect(() => {
    if (!audioStream) return;
    
    const recorder = new MediaRecorder(audioStream, { mimeType: "audio/webm" });
    mediaRecorder.current = recorder;

    recorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const audioBlob = new Blob([event.data], { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          if (base64Audio) {
            try {
              // Clear previous status messages
              setError(null);
              setTranscriptionStatus(null);

              const response = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audio: base64Audio, apiKey }),
              });
              
              if (!response.ok) {
                let errorMessage = response.statusText;
                try {
                    const errorData = await response.json();
                    if (errorData?.error) {
                        errorMessage = errorData.error;
                    }
                } catch (e) { /* Ignore JSON parse error */ }
                throw new Error(errorMessage || "Server returned an error without a message.");
              }
              
              const { transcript } = await response.json();

              if (transcript) {
                addToQueue(transcript);
              } else {
                // Handle empty transcript case
                setTranscriptionStatus("No speech detected.");
                setTimeout(() => setTranscriptionStatus(null), 2000); // Clear after 2s
              }
            } catch (err) {
              console.error("Transcription error:", err);
              if (err instanceof Error) {
                  setError(err.message);
              } else {
                  setError("Failed to transcribe audio.");
              }
            }
          }
        };
      }
    };
    
    recorder.start(3000); // Capture 3-second audio chunks
    setIsReady(true);

    return () => {
      recorder.stop();
    };
  }, [audioStream, addToQueue, apiKey]);

  useEffect(() => {
    const handleMessage = async (transcript: string) => {
      const id = crypto.randomUUID();
      setMessages(prev => [...prev, { id, role: 'user', text: transcript }]);
      
      try {
        const model = genAI.current.getGenerativeModel({ model: "gemini-1.5-flash-latest", systemInstruction });
        const chat = model.startChat({ generationConfig });
        const result = await chat.sendMessage(transcript);
        const responseText = result.response.text();
        setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: responseText }]);
      } catch (err) {
        console.error("Gemini response error:", err);
        setError("Failed to get response from Gemini.");
      }
    };

    onMessage(handleMessage);
    
    return () => {
      onMessage(null);
    };
  }, [onMessage, generationConfig, systemInstruction]);

  // ... (themeClasses and hudContainerClass remain the same)

  const themeClasses: Record<string, string> = {
    cyan: 'text-cyan-300',
    yellow: 'text-yellow-300',
    white: 'text-white',
  };
  
  const hudContainerClass = settings.isGhostMode 
    ? "bg-transparent" 
    : "bg-card/90 backdrop-blur-sm border border-border";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col p-4 rounded-lg shadow-2xl transition-all duration-300 ${hudContainerClass}`}
      style={{ opacity: settings.opacity / 100 }}
    >
      <div className="flex-grow overflow-y-auto pr-2" style={{ fontSize: `${settings.fontSize}px` }}>
        {view === 'list' ? (
          <MessageList messages={messages} themeClass={themeClasses[settings.theme]} />
        ) : (
          <SubtitleView message={messages.filter(m => m.role === 'model').pop()?.text || ''} themeClass={themeClasses[settings.theme]} />
        )}
      </div>

      <div className="flex-shrink-0 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onStopSession}><PanelTopClose className="h-5 w-5"/></Button>
            <Button variant="ghost" size="icon" onClick={() => setView(v => v === 'list' ? 'subtitle' : 'list')}> 
              {view === 'list' ? <MessageSquareText className="h-5 w-5"/> : <List className="h-5 w-5"/>}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {transcriptionStatus ? (
                <span className="text-amber-500">{transcriptionStatus}</span>
            ) : isReady ? (
                <>
                <Mic className="h-4 w-4 text-green-500 animate-pulse"/> Listening...
                </>
            ) : error ? (
                <>
                <AlertCircle className="h-4 w-4 text-red-500"/> {error}
                </>
            ) : (
                <>
                <Loader2 className="h-4 w-4 animate-spin"/> Connecting...
                </>
            )}
            </div>
        </div>
        
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        
        <HUDControls settings={settings} setSettings={setSettings} />
      </div>
    </div>
  );
}