# SnapVerse — Photo → Caption → Song (100% Free)

Upload a photo. Get attractive, AI-written captions. Pick a language. Get real
songs that match the photo's mood, in that language.

**This entire project runs on free tiers — no credit card required anywhere.**

```
┌──────────┐      ┌────────────────┐      ┌──────────────┐      ┌─────────────┐
│  Upload  │ ───▶ │ Gemini Vision  │ ───▶ │   Pick a     │ ───▶ │  YouTube    │
│  a photo │      │ (free) writes  │      │  language    │      │  songs that │
│          │      │ 6 captions +   │      │  for songs   │      │  match      │
│          │      │ detects theme  │      │              │      │  theme+lang │
└──────────┘      └────────────────┘      └──────────────┘      └─────────────┘
```

## How it works

1. You upload a photo (e.g. a photo of your sister, or your girlfriend).
2. You tell the app who's in the photo — sister, girlfriend, friend, family,
   or type your own (e.g. "cousin"). This matters because the same photo of
   a girl needs a completely different caption tone depending on who she is
   to you — an AI can't infer that from pixels alone.
3. The backend sends the photo + that relationship context to **Google
   Gemini's free vision API**, which detects the theme (e.g. `"nature"`) and
   writes 6 captions in the right tone (romantic for a girlfriend, warm/
   non-romantic for a sister, etc.).
4. You pick your favorite caption, then choose a language (e.g. Tamil).
5. The backend searches **YouTube Data API (free)** for `"Tamil nature songs"`
   and returns real, clickable song results matching the theme + language.

## Tech stack

| Layer    | Technology                                       |
| -------- | ------------------------------------------------- |
| Frontend | React (Create React App), Axios                   |
| Backend  | Node.js, Express, Multer                           |
| AI       | Google Gemini API — `gemini-2.5-flash` (free tier) |
| Music    | YouTube Data API v3 (free tier)                    |

## Project structure

```
image-caption-song-app/
├── backend/
│   ├── routes/
│   │   ├── caption.js       # POST /api/caption/generate (uses free Gemini API)
│   │   └── songs.js         # GET  /api/songs/suggest, /api/songs/languages
│   ├── utils/
│   │   └── upload.js        # Multer config (image upload handling)
│   ├── uploads/              # (unused storage folder, kept for future use)
│   ├── server.js             # Express app entry point
│   ├── package.json
│   └── .env.example          # Copy to .env and fill in your API keys
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ImageUploader.jsx      # Step 1: photo upload + drag-drop
    │   │   ├── RelationshipPicker.jsx # Step 2: who's in the photo (sister, girlfriend, etc.)
    │   │   ├── CaptionGallery.jsx     # Step 3: pick a caption
    │   │   ├── LanguagePicker.jsx     # Step 4: pick a language
    │   │   ├── SongList.jsx           # Step 5: real song results
    │   │   ├── JourneyTracker.jsx     # Progress indicator (signature UI)
    │   │   └── PhotoAnchor.jsx        # Pinned photo shown throughout
    │   ├── api.js               # All backend API calls, centralized
    │   ├── App.jsx               # Orchestrates the whole flow
    │   ├── App.css               # Component styles (design system)
    │   ├── index.js
    │   └── index.css             # Global styles + design tokens
    ├── package.json
    └── .env.example          # Copy to .env (points frontend at backend URL)
```

---

## Prerequisites

Before you start, install on your computer:

1. **Node.js** (version 18 or higher) — [https://nodejs.org](https://nodejs.org)
   Check it's installed by running:
   ```bash
   node --version
   npm --version
   ```

2. Two **free** API keys (no credit card needed for either):
   - **Google Gemini API key** (for AI captions)
   - **YouTube Data API v3 key** (for song search)

---

## Step 1 — Get your API keys

### A. Google Gemini API key (FREE — for captions)

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with any Google account.
3. Click **Create API key** (no billing or card required).
4. Copy the generated key (starts with `AIza...`).

> Free tier limits (subject to change by Google): roughly 10 requests/minute
> and 250 requests/day on the `gemini-2.5-flash` model — more than enough for
> personal use and testing.

### B. YouTube Data API v3 key (for songs)

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create a new project (or pick an existing one) from the top dropdown.
3. In the left sidebar, go to **APIs & Services → Library**.
4. Search for **"YouTube Data API v3"** and click **Enable**.
5. Go to **APIs & Services → Credentials**.
6. Click **+ Create Credentials → API key**.
7. Copy the generated key.
8. (Recommended) Click **Restrict Key** and limit it to "YouTube Data API v3" so it can't be misused if leaked.

> YouTube Data API has a free daily quota (10,000 units/day by default — each
> search call costs ~100 units, so you get roughly 100 free searches/day).

---

## Step 2 — Download/copy the project

If you received this as a folder, just open it. Otherwise create the folder
structure shown above and copy each file's content into place exactly as
named.

---

## Step 3 — Set up the backend

Open a terminal in the `backend/` folder:

```bash
cd image-caption-song-app/backend
```

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create your `.env` file** from the example:
   ```bash
   cp .env.example .env
   ```
   (On Windows, use `copy .env.example .env` instead.)

3. **Edit `.env`** and paste in your real keys:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIza-your-real-key-here
   YOUTUBE_API_KEY=your-real-youtube-key-here
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   You should see:
   ```
   ✅ Backend server running at http://localhost:5000
      Health check: http://localhost:5000/api/health
   ```

5. **Verify it's working** — open this URL in your browser:
   ```
   http://localhost:5000/api/health
   ```
   You should see: `{"status":"ok","message":"Backend is running fine 🎉"}`

   Leave this terminal running. Open a **new terminal** for the next step.

---

## Step 4 — Set up the frontend

In a **new terminal window**, go to the `frontend/` folder:

```bash
cd image-caption-song-app/frontend
```

1. **Install dependencies:**
   ```bash
   npm install
   ```
   This will take a minute or two the first time — React's tooling has a lot of packages.

2. **Create your `.env` file:**
   ```bash
   cp .env.example .env
   ```
   The default value (`http://localhost:5000`) is already correct as long as
   your backend is running on port 5000.

3. **Start the frontend:**
   ```bash
   npm start
   ```
   This automatically opens `http://localhost:3000` in your browser. If it
   doesn't, open that URL manually.

---

## Step 5 — Use the app

1. Drag a photo into the upload box (or click to browse), then click
   **Continue**.
2. Tell the app who's in the photo — tap a chip like "Sister", "Girlfriend",
   "Friend", or "Just the photo — no relation", or tap **Other…** and type
   your own (e.g. "fiancée", "cousin"). Click **Generate captions**.
3. Wait a few seconds while Gemini looks at the image. You'll see the
   detected **theme** (e.g. "nature") and 6 caption options written in the
   right tone for that relationship. Click one to select it, or hit "Copy"
   on any caption you like.
4. Click **Find songs to match**.
5. Pick a language (Tamil, English, Hindi, etc.).
6. You'll get a list of real YouTube songs matching the theme + language —
   click any one to open and play it on YouTube.
7. Use **Start over with a new photo** to repeat with a different image.

---

## Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| `Cannot find module 'dotenv'` (or similar) when starting backend | You forgot to run `npm install` in `backend/` |
| Captions request fails with "Gemini API key is invalid" | Your `GEMINI_API_KEY` in `backend/.env` is wrong, missing, or has extra spaces — copy it again from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| Captions request fails with "rate limit reached" | You've hit Gemini's free-tier limit (requests per minute or per day) — wait a minute and retry |
| Song search returns "API key is invalid... or quota exceeded" | Your `YOUTUBE_API_KEY` is wrong, restricted to the wrong API, or you've used up your daily 10,000-unit quota |
| Frontend shows a network error / can't reach backend | Make sure the backend terminal is still running on port 5000, and `frontend/.env`'s `REACT_APP_API_URL` matches |
| CORS error in browser console | Make sure `FRONTEND_URL` in `backend/.env` matches the URL your React app is actually running on (default `http://localhost:3000`) |
| Port 5000 or 3000 already in use | Change `PORT` in `backend/.env` (and update `frontend/.env`'s `REACT_APP_API_URL` to match), or stop whatever else is using that port |

---

## Cost: $0

This entire project is designed to run completely free:

- **Google Gemini API**: free tier, no credit card required to create a key
  or make requests. Limited to roughly 10 requests/minute and 250/day on
  `gemini-2.5-flash` — Google can adjust these limits, so check
  [ai.google.dev](https://ai.google.dev) for the current numbers if you hit one.
- **YouTube Data API**: free up to 10,000 units/day (~100 searches/day), no
  card required, just a Google Cloud project.

If you ever outgrow these free limits (e.g. for a deployed app with many
users), both services offer paid tiers you can upgrade to — but for personal
use and learning, you should never need to pay anything.

## Extending this project

Ideas if you want to keep building:
- Save caption/song history per user (add a database like MongoDB or PostgreSQL).
- Let users download the photo with the caption overlaid as text.
- Add more languages to `languageNameMap` in `backend/routes/songs.js`.
- Swap YouTube for Spotify's API if you want embeddable audio players instead of video links.
- Deploy the backend (e.g. Render, Railway) and frontend (e.g. Vercel, Netlify) so it's live on the internet instead of just localhost.
