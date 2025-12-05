"use client";

import { useState, useEffect, useRef } from "react";
import type { JobContext, UserContext, InterviewMessage, HudSettings } from "@/lib/types";
import { GoogleGenerativeAI, Part, Content } from "@google/generative-ai";
import { MessageList } from "./MessageList";
import { SubtitleView } from "./SubtitleView";
import { HUDControls } from "./HUDControls";
import { Button } from "../ui/button";
import { PanelTopClose, Square, List, MessageSquareText, PictureInPicture, Loader2, Mic, MicOff, AlertCircle } from "lucide-react";

interface CopilotHUDProps {
  apiKey: string;
  userContext: UserContext;
  jobContext: JobContext;
  onStopSession: () => void;
}

type HudView = 'list' | 'subtitle';

export function CopilotHUD({ apiKey, userContext, jobContext, onStopSession }: CopilotHUDProps) {
  const [settings, setSettings] = useState<HudSettings>({
    fontSize: 16,
    opacity: 80,
    theme: 'cyan',
    aiStyle: 'Pro',
    isGhostMode: false,
  });

  const [view, setView] = useState<HudView>('subtitle');
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pipWindow = useRef<Window | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);

  // Placeholder for complex audio and Gemini Live logic
  useEffect(() => {
    // 1. Initialize GoogleGenerativeAI with API Key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Define system instruction based on contexts and AI style
    const systemInstruction: Content = {
      role: 'system',
      parts: [{
        text: `You are an expert interview coach acting as the candidate. Your name is inferred from the resume.
        You must answer interview questions based on the provided resume and tailored to the specific job description.
        AI Style: ${settings.aiStyle}.
        Resume: ${userContext.resume}
        Job Description: ${jobContext.jobDescription}
        Company: ${jobContext.companyName}`
      }]
    };

    // 3. Start audio capture (getUserMedia)
    // 4. Process audio: downsample to 16kHz, convert to 16-bit PCM. This is complex and would require an AudioWorklet.
    // 5. Connect to Gemini Live API (`genAI.getGenerativeModel({ model: 'gemini-2.5-flash-native-audio-preview-09-2025' }).live()`)
    // 6. Stream audio chunks to Gemini.
    // 7. Listen for responses and update `messages` state.
    
    // Mock functionality for demonstration
    setIsListening(true);
    const mockInterval = setInterval(() => {
      const isUserModel = Math.random() > 0.5;
      const id = crypto.randomUUID();
      const role = isUserModel ? 'model' : 'user';
      const text = isUserModel ? "As a Senior Engineer, I tackled this by first defining the project scope and then delegating tasks effectively." : "Can you tell me about a time you faced a challenge?";
      setMessages(prev => [...prev, { id, role, text }]);
    }, 10000);

    return () => clearInterval(mockInterval);

  }, [apiKey, userContext, jobContext, settings.aiStyle]);
  
  const togglePip = async () => {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else if (hudRef.current && 'documentPictureInPicture' in window) {
      try {
        const pip = await window.documentPictureInPicture.requestWindow({
            width: hudRef.current.clientWidth,
            height: hudRef.current.clientHeight,
        });
        pip.document.body.append(hudRef.current);
        pipWindow.current = pip;

        // Copy styles
        [...document.styleSheets].forEach((styleSheet) => {
            const cssRules = [...styleSheet.cssRules].map(rule => rule.cssText).join('');
            const style = document.createElement('style');
            style.textContent = cssRules;
            pip.document.head.appendChild(style);
        });

        pip.addEventListener('pagehide', () => {
            document.body.append(hudRef.current!);
            pipWindow.current = null;
        });

      } catch (e) {
        console.error(e);
        setError("Picture-in-Picture failed. Your browser might not support it or it's blocked.");
      }
    } else {
        setError("Picture-in-Picture API is not available in this browser.");
    }
  };

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
      ref={hudRef}
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
            <Button variant="ghost" size="icon" onClick={togglePip}><PictureInPicture className="h-5 w-5"/></Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isListening ? (
                <>
                <Mic className="h-4 w-4 text-green-500 animate-pulse"/> Listening...
                </>
            ) : error ? (
                <>
                <AlertCircle className="h-4 w-4 text-red-500"/> Error
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
