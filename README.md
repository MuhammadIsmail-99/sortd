# Sortd - Content Capture Platform

Sortd is a production-ready system for capturing and organizing content from Instagram Reels, YouTube videos, and screenshots. It uses AI to automatically summarize, categorize, and tag your captures.

## Features

- **URL Capture**: Paste links from Instagram, YouTube, and more.
- **Screenshot OCR**: Upload screenshots; we'll extract the text and organize it.
- **AI Processing**: Automated summarization and categorization using Google Gemini.
- **Audio Transcription**: High-quality transcription using Groq Whisper.
- **Organized Lists**: Custom lists with emojis and colors.
- **PWA Support**: Installable on mobile with Share Target support.

## Getting Started

### 1. Prerequisites

- Node.js (v18+)
- Supabase Account
- Google AI Studio API Key (for Gemini)
- Groq API Key (for Whisper)
- `yt-dlp` and `ffmpeg` installed on your system

### 2. Setup Environment

Create a `.env` file in the `server/` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
PORT=3001
```

### 3. Database Schema

Run the SQL in `docs/DATABASE.md` in your Supabase SQL Editor to create the necessary tables and functions.

### 4. Installation

Run the following command in the root directory:

```bash
npm run install-all
```

### 5. Running the App

Start both frontend and backend in development mode:

```bash
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Deployment

- **Backend**: Recommended for Railway.app (supports `yt-dlp` and `ffmpeg`).
- **Frontend**: Recommended for Vercel.
- **Database**: Supabase.

---
Built with ❤️ by Sortd Team
