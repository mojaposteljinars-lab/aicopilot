export interface UserContext {
  resume: string;
  speakingStyle: string;
}

export interface JobContext {
  id: string;
  companyName: string;
  jobDescription: string;
  createdAt: number;
}

export interface InterviewMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export type AiStyle = 'Flash' | 'Flash-Lite' | 'Pro' | 'Reasoning' | 'Agent';
export type HudTheme = 'cyan' | 'yellow' | 'white';

export interface HudSettings {
  fontSize: number;
  opacity: number;
  theme: HudTheme;
  aiStyle: AiStyle;
  isGhostMode: boolean;
}
