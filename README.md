# Interview Copilot

A real-time AI interview assistant that provides stealth support during job interviews using audio transcription and context-aware AI responses.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   - `DEEPGRAM_API_KEY` - Required for audio transcription ([Get key](https://console.deepgram.com/))
   - `NEXT_PUBLIC_GEMINI_API_KEY` - Optional, can be set in UI ([Get key](https://aistudio.google.com/app/apikey))

3. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:9004](http://localhost:9004)

## 📋 Features

- **Live Audio Capture**: Captures audio from browser tabs using `getDisplayMedia()`
- **Real-time Transcription**: Deepgram Live API transcribes speech in 3-second chunks
- **Context-Aware AI**: Gemini generates answers tailored to your resume and job description
- **Stealth HUD**: Floating overlay with Ghost Mode, adjustable opacity, and custom themes
- **Multiple AI Styles**: Flash (concise), Pro (detailed), Reasoning (step-by-step), Agent (strategic advice)
- **Subtitle Mode**: Teleprompter-style display with typewriter effect

## 🏗️ Architecture

```
┌─────────────┐
│  Dashboard  │  Configure profile & job applications
└──────┬──────┘
       │ Opens HUD window
       ▼
┌─────────────┐
│ Interview   │  Captures tab audio → 3s chunks
│    HUD      │
└──────┬──────┘
       │ POST /api/transcribe
       ▼
┌─────────────┐
│  Deepgram   │  Audio → Text transcription
│     API     │
└──────┬──────┘
       │ Transcript
       ▼
┌─────────────┐
│   Gemini    │  Context + Transcript → Answer
│     AI      │
└──────┬──────┘
       │
       ▼
   Display in HUD
```

## 🔧 Development

```bash
# Run dev server (port 9004)
npm run dev

# Start Genkit dev UI (test AI flows)
npm run genkit:dev

# Type check
npm run typecheck

# Build for production
npm run build
```

## 📁 Key Files

- `src/components/Dashboard.tsx` - Main app interface
- `src/components/interview/CopilotHUD.tsx` - Floating interview assistant
- `src/app/api/transcribe/route.ts` - Deepgram transcription endpoint
- `src/ai/flows/` - Genkit AI prompt flows
- `src/lib/types.ts` - TypeScript type definitions

## 🔐 Security Notes

- **API Keys**: Gemini key stored in localStorage (visible in DevTools). For production, consider server-side proxy.
- **HTTPS Required**: Browser audio capture requires HTTPS or localhost
- **Tab Sharing**: Users must share "browser tab" with "Share tab audio" enabled

## 📚 Documentation

See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for comprehensive AI coding agent instructions including:
- Architecture deep dive
- Critical patterns and workflows
- Common tasks and debugging
- Known issues and roadmap

## 🐛 Recent Fixes

- ✅ Fixed `transcriberFlow` export in `src/ai/server.ts`
- ✅ Removed hardcoded API keys from `src/app/interview-hud/page.tsx`
- ✅ Implemented proper API key management via localStorage
- ✅ Added `.env.example` for environment variable documentation

## 🤝 Contributing

This is a specialized tool for interview assistance. Contributions focused on:
- Improved transcription accuracy
- Enhanced stealth features
- Additional AI response styles
- Better error handling

## ⚠️ Disclaimer

This tool is designed for personal use to help candidates prepare and respond to interview questions. Users are responsible for ensuring compliance with interview policies and ethical guidelines.
