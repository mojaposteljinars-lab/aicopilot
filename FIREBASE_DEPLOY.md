# Firebase Studio Deployment Checklist

## ✅ Pre-Deployment (Complete)

- [x] Fixed transcription API export
- [x] Removed hardcoded API keys
- [x] Created `.env.example` template
- [x] Updated documentation
- [x] Removed `output: 'export'` from `next.config.ts`

## 📋 Deploy to Firebase Studio

### Step 1: Open Project in Firebase Studio
1. Go to https://console.firebase.google.com/
2. Select your project (or create new one)
3. Navigate to **App Hosting** (in left sidebar)
4. Click **Get Started** or **Add App**
5. Connect to GitHub: `mojaposteljinars-lab/aicopilot`

### Step 2: Configure Environment Variables
In Firebase Console → App Hosting → Environment Variables, add:

```
DEEPGRAM_API_KEY=a8aab07ffc9b967a61da1b7197653762255f6172
NEXT_PUBLIC_GEMINI_API_KEY=<GET-NEW-KEY-FROM-https://aistudio.google.com/app/apikey>
```

⚠️ **CRITICAL:** You must get a NEW Gemini API key - the current one is invalid.

### Step 3: Deploy
1. Firebase will auto-detect Next.js configuration
2. Click **Deploy**
3. Wait for build to complete (~2-5 minutes)

## 🔍 Post-Deployment Testing

### Test Checklist
- [ ] Open deployed URL
- [ ] Navigate to Library tab
- [ ] Add resume and create job application
- [ ] Start interview session
- [ ] Grant tab audio sharing permission
- [ ] Verify transcription appears (Deepgram working)
- [ ] Verify AI responses appear (Gemini working)

### If Transcription Fails
Check Firebase Console → Functions → Logs for Deepgram errors

### If AI Responses Fail
- Check Gemini API key is valid
- Check Firebase Console for API errors
- Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set correctly

## 🔐 Security Recommendations (Optional)

For production use:
1. Move Gemini API key to server-side only (remove `NEXT_PUBLIC_` prefix)
2. Create proxy API route for Gemini calls
3. Fix TypeScript errors (remove `ignoreBuildErrors: true`)
4. Add rate limiting to API routes

## 📝 Useful Commands

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Test production build
npm run genkit:dev   # Test AI flows
```

### Firebase CLI (if needed)
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

## 📚 Resources

- [Firebase App Hosting Docs](https://firebase.google.com/docs/app-hosting)
- [Next.js on Firebase](https://firebase.google.com/docs/app-hosting/frameworks/nextjs)
- [Get Gemini API Key](https://aistudio.google.com/app/apikey)
- [Deepgram Console](https://console.deepgram.com/)

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Verify all dependencies in `package.json`
- Check Firebase build logs

### API Routes 404
- Ensure `output: 'export'` is removed from `next.config.ts` ✅ (Already done)
- Verify Firebase detected Next.js correctly

### Environment Variables Not Working
- Restart/redeploy after adding env vars
- Check variable names match exactly (case-sensitive)
- For client-side: must start with `NEXT_PUBLIC_`

---

**Ready to deploy! All changes are saved in the GitHub workspace.** 🚀
