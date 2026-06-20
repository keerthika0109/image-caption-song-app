// ============================================
// routes/caption.js — Image -> Attractive captions (FREE via Google Gemini)
// ============================================
// POST /api/caption/generate
//   Body: multipart/form-data with field name "image"
//          + optional text field "relationship" (e.g. "sister", "girlfriend")
//   Returns: { theme: "nature", captions: ["...", "...", "...", ...] }
//
// How it works:
//   1. Multer receives the uploaded image into memory (as a Buffer)
//   2. We convert it to base64 and send it to Google Gemini's free
//      generateContent API (gemini-2.5-flash model — vision + text, free tier)
//   3. We ask Gemini to identify the main theme (nature, city, food, etc.)
//      AND generate multiple attractive/creative captions for social media
//   4. If a "relationship" was provided (e.g. the person in the photo is the
//      user's sister, girlfriend, friend, etc.), we tell Gemini explicitly so
//      the captions reflect that relationship — since the AI has no way of
//      knowing who's in the photo just by looking at it.
//   5. We ask Gemini to respond in strict JSON so it's easy to parse
//   6. We send that JSON back to the frontend
//
// Why Gemini: Google's Gemini API offers a genuine free tier for vision
// + text generation, no credit card required. Get a key at
// https://aistudio.google.com/app/apikey

const express = require('express');
const axios = require('axios');
const upload = require('../utils/upload');

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Using gemini-2.5-flash: fast, free-tier eligible, and supports image input.
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

// Map file mimetypes to the format Gemini's API expects
const mimeTypeMap = {
  'image/jpeg': 'image/jpeg',
  'image/png': 'image/png',
  'image/webp': 'image/webp',
  'image/gif': 'image/gif',
};

router.post('/generate', upload.single('image'), async (req, res) => {
  try {
    // 1. Validate that a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image file was uploaded.' });
    }

    const mimeType = mimeTypeMap[req.file.mimetype];
    if (!mimeType) {
      return res.status(400).json({ error: 'Unsupported image type.' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server. Check your .env file.',
      });
    }

    // 1b. Read the optional "relationship" field (e.g. "sister", "girlfriend").
    //     This tells Gemini who the person in the photo is to the user, since
    //     that context can never be inferred from pixels alone.
    //     We trim it and cap the length to keep the prompt safe and short.
    const relationship = (req.body.relationship || '').trim().slice(0, 40);

    // 2. Convert the image buffer to base64 (required format for the API)
    const base64Image = req.file.buffer.toString('base64');

    // 3. Build the prompt. We explicitly ask for STRICT JSON output
    //    so our backend can reliably parse it without guesswork.
    //
    //    If a relationship was given, we add a clear instruction block so
    //    the captions are written from that relationship's point of view
    //    (e.g. sisterly/playful vs. romantic) instead of a generic caption.
    const relationshipInstruction = relationship
      ? `\nIMPORTANT CONTEXT: The main person in this photo is the user's ${relationship}.
Write every caption from that point of view:
- If the relationship is romantic (e.g. girlfriend, boyfriend, wife, husband, partner), make the captions warm, affectionate, or romantic in tone.
- If the relationship is familial and non-romantic (e.g. sister, brother, mom, dad, daughter, son), make the captions warm and loving but clearly NOT romantic — sibling/family pride, nostalgia, humor, gratitude.
- If the relationship is platonic (e.g. friend, best friend), make the captions reflect friendship — fun, loyal, nostalgic, or celebratory, but not romantic.
- Never write romantic or flirtatious language for a familial or platonic relationship, and never write platonic/sibling-style language for a romantic relationship.
`
      : '';

    const promptText = `You are a creative social-media caption writer.
Look at this image carefully and do two things:
${relationshipInstruction}
1. Identify the single main theme of the image in one word or short phrase
   (e.g. "nature", "beach", "city", "food", "pet", "travel", "sunset", "family", "fitness").

2. Write 6 different attractive, creative, social-media-ready captions for this image.
   - Make them vivid, emotional, and engaging — the kind of captions people use on Instagram.
   - Vary the style across the 6: e.g. one poetic, one short & punchy, one with light humor,
     one inspirational/quote-style, one descriptive, one with relevant emojis.
   - Keep each caption under 25 words.
   - Do NOT use hashtags.

Respond with ONLY valid JSON in exactly this format, and nothing else (no markdown, no explanation, no code fences):
{
  "theme": "one word or short phrase describing the main subject",
  "captions": ["caption 1", "caption 2", "caption 3", "caption 4", "caption 5", "caption 6"]
}`;

    // 4. Call Gemini's generateContent API (REST, no SDK needed)
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // 5. Extract the text reply from Gemini's response
    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!rawText) {
      console.error('Empty response from Gemini:', JSON.stringify(response.data));
      return res.status(500).json({
        error: 'The AI returned an empty response. Please try again.',
      });
    }

    // 6. Parse the JSON safely. We strip markdown code fences just in case
    //    Gemini wraps its answer in ```json ... ``` despite instructions.
    const cleanedText = rawText.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', rawText);
      return res.status(500).json({
        error: 'Could not understand the AI response. Please try again.',
      });
    }

    // 7. Validate the shape of the parsed response before sending it on
    if (!parsed.theme || !Array.isArray(parsed.captions)) {
      return res.status(500).json({
        error: 'AI response was missing expected fields. Please try again.',
      });
    }

    return res.json({
      theme: parsed.theme,
      captions: parsed.captions,
    });
  } catch (error) {
    console.error('Error in /api/caption/generate:', error.response?.data || error.message);

    // Give clearer messages for common Gemini API errors
    const status = error.response?.status;
    if (status === 400) {
      return res.status(500).json({
        error: 'Gemini rejected the request — check your GEMINI_API_KEY is valid.',
      });
    }
    if (status === 403) {
      return res.status(500).json({
        error: 'Gemini API key is invalid or missing permissions. Check your .env file.',
      });
    }
    if (status === 429) {
      return res.status(429).json({
        error:
          'Gemini free-tier rate limit reached (requests per minute or per day). Please wait a moment and try again.',
      });
    }

    return res.status(500).json({
      error: 'Failed to generate captions.',
      details: error.message,
    });
  }
});

module.exports = router;
