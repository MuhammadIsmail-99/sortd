# Hackathon — 24hr Build Guide

Opinionated execution plan for the cloud-deployed Sortd PWA.

---

## Decisions (Resolved)

| Question | Answer |
|----------|--------|
| API key storage | Supabase `settings` table. |
| Database | Supabase (PostgreSQL). |
| Backend Hosting | Railway. |
| Frontend Hosting | Vercel. |
| Queue persistence | In-memory. Server restart loses pending jobs. |
| Max concurrent Gemini calls | 2. |
| Mobile or desktop? | Mobile-first PWA. |

---

## Hour 1: Infrastructure & DB (PHASE 0)

1. **Supabase Setup**: Create project, run `DATABASE.md` schema SQL.
2. **Environment Variables**: Populate `.env` with `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`.
3. **Railway Setup**: Link repo, configure system dependencies (`yt-dlp`, `ffmpeg`) via Dockerfile or Nixpacks.

---

## Build Order

### Hour 1-2: Backend Foundation

1. `npm init` + install deps (`express@5.1`, `@supabase/supabase-js`, `cors`, `multer`, `uuid`, `open-graph-scraper`, `tesseract.js`)
2. `server/services/database.js` — Supabase client initialization, CRUD helpers.
3. `server/services/tempFiles.js` — temp file helpers for Railway ephemeral storage.
4. `server/services/gemini.js` — AI logic.
5. `server/index.js` — Express app with Supabase `initDB()`.

### Hour 2-4: Processing Pipelines

6. `server/services/videoProcessor.js` — yt-dlp + Gemini integration.
7. `server/services/imageProcessor.js` — Tesseract + Gemini.
8. Wire POST `/api/process-url` and `/api/process-image`.

### Hour 4-5: Queue + SSE

9. `server/services/queue.js` — job queue + rate limiter + SSE broadcast.
10. Add SSE endpoint (`GET /api/events`).

### Hour 5-8: Frontend Foundation & PWA

11. `npx create-vite@latest ./client --template react`
12. Install deps: `react-router-dom`, `vite-plugin-pwa`.
13. `client/src/index.css` — full design system tokens.
14. `client/src/api.js` — API client using `VITE_API_URL`.
15. `client/public/manifest.json` — PWA manifest with Share Target.

### Hour 8-16: UI Implementation

16. Components: `BottomNav`, `NoteCard`, `UploadZone`, `ProcessingOverlay`.
17. Pages: `Inbox`, `Lists`, `AddContent`, `NoteDetail`, `Settings`.

### Hour 16-24: Polish & Deploy

18. Vercel deployment for frontend.
19. PWA icon generation.
20. End-to-end testing of the Share Target flow.

---

## Priority Tiers

### Must-Have (demo or die)
- Share URL from mobile → PWA captures it.
- YouTube extraction working in Railway.
- Metadata fallback for failed extractions.
- Note categorization into Supabase lists.

### Skip
- Folder watcher (not viable in cloud).
- Local SQLite database.

---

## Demo Script (Mobile)

1. **Share Target**: Open Instagram, share a reel to "Sortd".
2. **Auto-Process**: PWA opens to `/add`, auto-starts processing.
3. **Inbox**: Show the note landing in Inbox with AI tags.
4. **Offline**: Toggle airplane mode, show PWA still loads Inbox (NetworkFirst caching).

---

## Quick Reference

### Start Backend
```bash
cd server
npm run dev
```

### Start Frontend
```bash
cd client
npm run dev
```

### Key Environment Variables
```bash
# server/.env
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FRONTEND_URL=http://localhost:5173
```
