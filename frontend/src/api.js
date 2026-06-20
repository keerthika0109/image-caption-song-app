// ============================================
// src/api.js — Centralized backend API calls
// ============================================
// Keeping all axios calls in one file means if the backend URL
// or endpoint paths ever change, we only update them here.

import axios from 'axios';

// The backend server URL. In development this is localhost:5000.
// When you deploy, change this to your deployed backend's URL
// (or better — set it via an environment variable, see README).
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Upload an image file and get back a theme + multiple attractive captions.
 * @param {File} imageFile - the raw File object from the <input type="file">
 * @param {string} [relationship] - who the main person in the photo is to the
 *   user (e.g. "sister", "girlfriend"). Optional — pass '' or omit for a
 *   generic caption with no relationship framing.
 * @returns {Promise<{theme: string, captions: string[]}>}
 */
export async function generateCaptions(imageFile, relationship = '') {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (relationship) {
    formData.append('relationship', relationship);
  }

  const response = await axios.post(`${API_BASE_URL}/api/caption/generate`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

/**
 * Fetch the list of supported languages for the language picker.
 * @returns {Promise<{code: string, label: string}[]>}
 */
export async function getLanguages() {
  const response = await axios.get(`${API_BASE_URL}/api/songs/languages`);
  return response.data.languages;
}

/**
 * Get song suggestions based on the image's theme and the chosen language.
 * @param {string} theme - e.g. "nature"
 * @param {string} language - e.g. "tamil"
 * @returns {Promise<{songs: object[], query: string}>}
 */
export async function getSongSuggestions(theme, language) {
  const response = await axios.get(`${API_BASE_URL}/api/songs/suggest`, {
    params: { theme, language },
  });
  return response.data;
}
