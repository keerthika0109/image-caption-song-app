// ============================================
// routes/songs.js — Theme + Language -> Real song suggestions
// ============================================
// GET /api/songs/suggest?theme=nature&language=tamil
//   Returns: { songs: [ { title, channel, videoId, thumbnail, url }, ... ] }
//
// How it works:
//   1. Frontend sends the image's theme (e.g. "nature") and the
//      language the user picked (e.g. "tamil")
//   2. We build a smart search query combining both
//      e.g. "tamil nature songs" / "tamil mountain songs"
//   3. We call YouTube Data API's search endpoint
//   4. We clean up and return a simple list the frontend can render

const express = require('express');
const axios = require('axios');

const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

// Map our internal language codes to natural-language words used in
// the YouTube search query, so results are more relevant.
const languageNameMap = {
  tamil: 'Tamil',
  english: 'English',
  hindi: 'Hindi',
  telugu: 'Telugu',
  malayalam: 'Malayalam',
  kannada: 'Kannada',
  korean: 'Korean',
  spanish: 'Spanish',
};

router.get('/suggest', async (req, res) => {
  try {
    const { theme, language } = req.query;

    // 1. Validate inputs
    if (!theme || !language) {
      return res.status(400).json({
        error: 'Both "theme" and "language" query parameters are required.',
      });
    }

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({
        error: 'YouTube API key is not configured on the server.',
      });
    }

    const languageLabel = languageNameMap[language.toLowerCase()] || language;

    // 2. Build a natural search query, e.g. "Tamil nature songs"
    //    Adding "songs" and "official" helps surface real music videos
    //    rather than random unrelated clips.
    const searchQuery = `${languageLabel} ${theme} songs`;

    // 3. Call YouTube Data API v3 search endpoint
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        key: YOUTUBE_API_KEY,
        q: searchQuery,
        part: 'snippet',
        type: 'video',
        videoCategoryId: '10', // "Music" category
        maxResults: 10,
        relevanceLanguage: language.toLowerCase().slice(0, 2), // e.g. "ta" for tamil
        safeSearch: 'moderate',
      },
    });

    // 4. Map the raw YouTube response into a clean, simple shape
    const songs = response.data.items
      .filter((item) => item.id && item.id.videoId) // keep only valid videos
      .map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

    if (songs.length === 0) {
      return res.json({
        songs: [],
        message: 'No songs found for this combination. Try a different language.',
      });
    }

    return res.json({ songs, query: searchQuery });
  } catch (error) {
    console.error('Error in /api/songs/suggest:', error.response?.data || error.message);

    if (error.response?.status === 403) {
      return res.status(500).json({
        error:
          'YouTube API key is invalid, restricted, or quota exceeded. Check Google Cloud Console.',
      });
    }

    return res.status(500).json({
      error: 'Failed to fetch song suggestions.',
      details: error.message,
    });
  }
});

// GET /api/songs/languages — returns the list of supported languages
// (used by the frontend to render the language picker)
router.get('/languages', (req, res) => {
  const languages = Object.entries(languageNameMap).map(([code, label]) => ({
    code,
    label,
  }));
  res.json({ languages });
});

module.exports = router;
