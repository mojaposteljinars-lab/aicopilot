# Interview Copilot - AI Coding Agent Instructions

## Project Overview

**Interview Copilot** is a specialized React app that provides real-time AI assistance during job interviews. It captures audio (via browser tab sharing), transcribes using Deepgram, generates context-aware answers with Gemini, and displays them in a stealth floating HUD overlay.

**Core Tech Stack**: Next.js 16 (React 19), TypeScript, Tailwind CSS, Genkit (Firebase AI), Deepgram SDK, Google Generative AI SDK

## Architecture

### Data Flow
1. **Main App** (`/` route): User configures profile (resume, speaking style) and job applications in localStorage
2. **Session Start**: Opens `/interview-hud` in new window with context passed via localStorage
3. **HUD Window**: Captures tab audio via `getDisplayMedia()`, streams 3s chunks to `/api/transcribe`
4. **Transcription**: API route uses Deepgram Live SDK to convert audio → text
5. **AI Response**: HUD sends transcript to Gemini with injected user/job context
6. **Display**: Answers shown in List View (chat) or Subtitle View (teleprompter with typewriter effect)

### Key Components

**Dashboard** (`src/components/Dashboard.tsx`)
- Main entry point with two tabs: Interview (session launcher) + Library (context editor)
- Manages API keys in localStorage (Gemini key can be set via UI)
- User can create multiple job applications with company name + job description

**InterviewController** (`src/components/interview/InterviewController.tsx`)
- Validates configuration (API key, resume, job selection required)
- Opens HUD in popup window via `window.open('/interview-hud')`
- Passes context to HUD via localStorage (cleared after read)

**CopilotHUD** (`src/components/interview/CopilotHUD.tsx`)
- Manages MediaRecorder for 3s audio chunks (WebM format)
- Uses `useQueue` hook to debounce transcript processing
- Builds dynamic `systemInstruction` from user resume + job description + AI style
- Tracks messages in state for chat history

**Transcription API** (`src/app/api/transcribe/route.ts`)
- Server-side route that wraps Deepgram Live streaming
- Requires `DEEPGRAM_API_KEY` environment variable
- Returns transcript text or error messages

### Genkit AI Flows

Located in `src/ai/flows/`, these define reusable AI prompts:
- **generate-detailed-answers.ts**: "Pro" mode - comprehensive structured responses
- **generate-concise-flash-answers.ts**: "Flash" mode - <10 word answers
- **generate-reasoned-answers.ts**: "Reasoning" mode - step-by-step problem solving
- **generate-agent-advice.ts**: "Agent" mode - strategic guidance vs direct answers
- **tailor-answers-to-job-description.ts**: Customizes response based on job requirements
- **tailor-answers-to-resume.ts**: Aligns answer with candidate's actual experience
- **transcribe-audio.ts**: Deepgram Live SDK wrapper (base64 audio → text)

**Pattern**: Each flow exports a function + a Genkit `defineFlow` using `definePrompt` with Zod schemas.

### Type System (`src/lib/types.ts`)

```typescript
UserContext: { resume: string; speakingStyle: string }
JobContext: { id, companyName, jobDescription, createdAt }
AiStyle: 'Flash' | 'Flash-Lite' | 'Pro' | 'Reasoning' | 'Agent'
HudTheme: 'cyan' | 'yellow' | 'white'
HudSettings: { fontSize, opacity, theme, aiStyle, isGhostMode }
InterviewMessage: { id, role: 'user' | 'model', text }
```

## Critical Patterns

### Environment Variables
- **DEEPGRAM_API_KEY** (required): Server-side transcription. Set in `.env.local`, accessed in API routes.
- **NEXT_PUBLIC_GEMINI_API_KEY** (optional): Default API key, overridden by localStorage `gemini-api-key`.

### LocalStorage Keys
- `user-context`: UserContext object
- `job-applications`: JobContext array
- `gemini-api-key`: Gemini API key (set via prompt in Dashboard)
- `interview_*` keys: Temporary session data passed to HUD window (deleted after read)

### Audio Capture Workflow
```typescript
// In interview-hud/page.tsx
navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
// User shares browser tab with "Share tab audio" checked
// Stop video tracks to save bandwidth, keep audio
// MediaRecorder captures 3s chunks → base64 → POST /api/transcribe
```

### Stealth Features
- **Ghost Mode**: High transparency + no background
- **PiP Support**: Uses `documentPictureInPicture` API (fallback planned for `<canvas>` + `<video>` PiP)
- **Subtitle View**: Auto-scrolling typewriter effect (see `useTypewriter` hook)

## Common Tasks

### Adding a New AI Style
1. Update `AiStyle` type in `src/lib/types.ts`
2. Add prompt mapping in `src/ai/flows/tailor-answers-to-job-description.ts`
3. Update HUD controls in `src/components/interview/HUDControls.tsx`

### Debugging Transcription Issues
- Check `DEEPGRAM_API_KEY` is set in `.env.local`
- Verify audio track exists: `stream.getAudioTracks().length > 0`
- Inspect Deepgram events in API route logs: `LiveTranscriptionEvents.Error`
- Confirm MediaRecorder mime type: `audio/webm` (Deepgram auto-detects codec)

### Modifying System Instructions
Edit `systemInstruction` in `CopilotHUD.tsx`:
```typescript
const systemInstruction: Content = {
  role: 'system',
  parts: [{ text: `You are an expert interview coach...
    Resume: ${userContext.resume}
    Job Description: ${jobContext.jobDescription}` }]
};
```

## Build & Development

```bash
# Install dependencies
npm install

# Run dev server (port 9004)
npm run dev

# Start Genkit dev UI
npm run genkit:dev

# Type check
npm run typecheck

# Build for production (static export)
npm run build
```

**Note**: `next.config.ts` uses `output: 'export'` for static hosting. API routes won't work in static builds - ensure server-side features (like `/api/transcribe`) run on a platform supporting serverless functions (e.g., Vercel, Firebase Hosting + Cloud Functions).

## Known Issues & TODOs

1. **Transcription Flow Export**: `transcriberFlow` in `src/ai/server.ts` is now a wrapper function, not a full Genkit flow. Consider refactoring to use `ai.defineFlow` for consistency.
2. **API Key Security**: Gemini key stored in localStorage is visible in DevTools. Consider server-side proxy for production.
3. **PiP Fallback**: Placeholder code exists but incomplete. Implement `<canvas>` + `<video>` PiP for restricted iframe environments.
4. **Hardcoded API Key**: Removed hardcoded Deepgram key from `interview-hud/page.tsx`. Ensure `.env.local` is configured.
5. **Next.js Config**: `typescript.ignoreBuildErrors: true` should be removed before production - fix all type errors.

## File Organization

```
src/
├── ai/                      # Genkit flows & configuration
│   ├── genkit.ts           # Base Genkit instance with Google AI plugin
│   ├── server.ts           # Server-side flow exports for API routes
│   ├── dev.ts              # Dev-mode flow exports for Genkit UI
│   └── flows/              # Individual AI flows (use 'use server')
├── app/                     # Next.js App Router pages
│   ├── page.tsx            # Home page (renders Dashboard)
│   ├── interview-hud/      # HUD popup window route
│   └── api/transcribe/     # Transcription API endpoint
├── components/
│   ├── Dashboard.tsx       # Main app container
│   ├── interview/          # Interview-specific components
│   ├── library/            # Context management UI
│   └── ui/                 # shadcn/ui components
├── hooks/                   # Custom React hooks (useQueue, useTypewriter, useLocalStorage)
└── lib/                     # Types, utilities, placeholder data
```

## Conventions

- **Server Actions**: AI flows use `'use server'` directive (except `genkit.ts`)
- **Client Components**: All UI components use `'use client'` (Next.js App Router default)
- **Styling**: Tailwind utility classes, theme variables defined in `globals.css`
- **Icons**: Lucide React (`import { Icon } from 'lucide-react'`)
- **Forms**: React Hook Form + Zod validation (not yet implemented - manual form handling used)
- **State Management**: localStorage + React useState/useEffect (no global state library)

## Testing Checklist

Before declaring a feature complete:
1. Test with actual browser tab sharing (requires HTTPS or localhost)
2. Verify audio track is captured: check `mediaRecorder.current.state === 'recording'`
3. Confirm Deepgram transcription returns non-empty string
4. Check Gemini response appears in message list
5. Test all 5 AI styles (Flash, Flash-Lite, Pro, Reasoning, Agent)
6. Validate stealth features: Ghost Mode, transparency slider, theme switching
7. Ensure HUD window closes when tab sharing stops

## External Dependencies

- **Deepgram**: Nova-2 model for live transcription (requires API key)
- **Google Gemini**: `gemini-1.5-flash-latest` model for answer generation
- **Firebase Genkit**: AI workflow orchestration (v1.25+)
- **shadcn/ui**: Radix UI primitives + Tailwind styling
- **Next.js 16**: React 19 + Turbopack + static export mode
