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


## Step 1 — Get your API keys
  ### A. Google Gemini API key (FREE — for captions)
  ### B. YouTube Data API v3 key (for songs)
## Step 2 — Download/copy the project
## Step 3 — Set up the backend
1. **Install dependencies:**
2. 2. **Create your `.env` file** from the example:
3. 3. 3. **Edit `.env`** and paste in your real keys:
4. **Start the backend server:**
5. 5. **Verify it's working**
6. ## Step 4 — Set up the frontend
7. 1. **Install dependencies:**
2. 2. **Create your `.env` file:**
3. **Start the frontend:**
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

