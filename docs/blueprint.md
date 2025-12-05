# **App Name**: InterviewAce

## Core Features:

- Live Audio Capture: Capture real-time audio from the user's system or microphone using getDisplayMedia or getUserMedia.
- Gemini Live Transcription: Transcribe audio streams via the Gemini Live API using the gemini-2.5-flash-native-audio-preview-09-2025 model. Convert audio to 16kHz PCM for streaming to Gemini.
- Context Management: Create a UserContext (Resume, Speaking Style) and JobContext (Company, Description) and load them from LocalStorage. Injects job description/resume using a tool, into prompts before interview starts.
- AI-Powered Answer Generation: Generate relevant and high-quality answers based on real-time transcriptions and contextual data.
- Floating Heads-Up Display (HUD): Display AI-generated answers on a floating overlay with List View (chat history) and Subtitle View (teleprompter style). Implement Picture-in-Picture with a fallback to <canvas> + <video> PiP for restricted environments.
- Dynamic AI Styles: Offer multiple response styles (Flash, Pro, Reasoning) to modify the system prompt, including a concise Flash-Lite mode.
- Customization and Stealth Mode: Provide controls for Font Size, Opacity, and Color Themes (Cyan/Yellow/White). Implement Ghost Mode for high transparency and auto-scrolling text in Subtitle View.

## Style Guidelines:

- Primary color: Slate blue (#577590) to convey trust and intelligence.
- Background color: Light gray (#f0f2f5), a desaturated hue similar to slate blue, provides a professional yet subtle backdrop.
- Accent color: Muted gold (#a9927d), a neighboring hue to the primary color on the color wheel, for highlighting interactive elements without distracting from the interview context.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern and neutral look.
- Code font: 'Source Code Pro' for displaying any code snippets in the interview questions.
- Use minimalist, professional icons from Lucide React to represent settings and AI modes.
- Subtle animations for the typewriter effect in the Subtitle View and smooth transitions for the floating HUD.