// ============================================
// src/App.jsx — Top-level orchestration
// ============================================
// This component owns the overall flow:
//   1. "upload"       — user picks a photo
//   2. "relationship" — user says who's in the photo (sister, girlfriend, etc.)
//   3. "captions"      — show theme + 6 caption options, tailored to that relationship
//   4. "language"      — ask which language for songs
//   5. "songs"         — show real song results
//
// It holds all shared state (the image, the relationship, the theme,
// captions, songs) and passes down only what each child component needs.

import React, { useEffect, useState } from 'react';
import ImageUploader from './components/ImageUploader';
import RelationshipPicker from './components/RelationshipPicker';
import CaptionGallery from './components/CaptionGallery';
import LanguagePicker from './components/LanguagePicker';
import SongList from './components/SongList';
import JourneyTracker from './components/JourneyTracker';
import PhotoAnchor from './components/PhotoAnchor';
import { generateCaptions, getLanguages, getSongSuggestions } from './api';
import './App.css';

// Maps our internal flow step to the visual stages the JourneyTracker
// understands (upload -> relationship -> captions -> songs). The
// "language" step is visually grouped under "songs" since picking a
// language is part of getting to the song result.
function getTrackerStep(step) {
  if (step === 'relationship') return 'relationship';
  if (step === 'captions') return 'captions';
  if (step === 'language' || step === 'songs') return 'songs';
  return 'upload';
}

function App() {
  // Which screen of the journey we're on
  const [step, setStep] = useState('upload'); // upload | relationship | captions | language | songs

  // Image state
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Relationship state — who is the main person in the photo to the user
  const [relationship, setRelationship] = useState('');

  // Caption state
  const [theme, setTheme] = useState(null);
  const [captions, setCaptions] = useState([]);

  // Language + songs state
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [songs, setSongs] = useState([]);

  // Loading + error state
  const [isLoadingCaptions, setIsLoadingCaptions] = useState(false);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch the list of supported languages once, on first load
  useEffect(() => {
    getLanguages()
      .then(setLanguages)
      .catch(() => {
        // Fallback list in case the backend call fails — keeps the UI usable
        setLanguages([
          { code: 'tamil', label: 'Tamil' },
          { code: 'english', label: 'English' },
          { code: 'hindi', label: 'Hindi' },
        ]);
      });
  }, []);

  // ---------- Step 1: user confirms their photo, moves to relationship step ----------
  const handlePhotoConfirmed = (file, localPreviewUrl) => {
    setSelectedFile(file);
    setPreviewUrl(localPreviewUrl);
    setErrorMessage(null);
    setStep('relationship');
  };

  // ---------- Step 2: user says who's in the photo -> generate captions ----------
  const handleRelationshipConfirmed = async (relationshipValue) => {
    setRelationship(relationshipValue);
    setErrorMessage(null);
    setIsLoadingCaptions(true);
    try {
      const data = await generateCaptions(selectedFile, relationshipValue);
      setTheme(data.theme);
      setCaptions(data.captions);
      setStep('captions');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || 'Could not generate captions. Please try again.'
      );
    } finally {
      setIsLoadingCaptions(false);
    }
  };

  // ---------- Step 2: user picks a caption, moves to language step ----------
  const handleContinueToLanguage = () => {
    setStep('language');
  };

  // ---------- Step 3: user picks a language -> fetch songs ----------
  const handleSelectLanguage = async (languageCode) => {
    setSelectedLanguage(languageCode);
    setErrorMessage(null);
    setIsLoadingSongs(true);
    try {
      const data = await getSongSuggestions(theme, languageCode);
      setSongs(data.songs);
      setStep('songs');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || 'Could not fetch songs. Please try again.'
      );
    } finally {
      setIsLoadingSongs(false);
    }
  };

  // ---------- Reset flows ----------
  const handleRestart = () => {
    setStep('upload');
    setPreviewUrl(null);
    setSelectedFile(null);
    setRelationship('');
    setTheme(null);
    setCaptions([]);
    setSelectedLanguage(null);
    setSongs([]);
    setErrorMessage(null);
  };

  const handleChangeLanguage = () => {
    setStep('language');
  };

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__brand">LetsMakeItEasy</p>
        <h1 className="app__headline">Every photo has a soundtrack.</h1>
        <p className="app__subhead">
          Upload a photo → get an attractive caption → discover a matching song in your language.
        </p>
      </header>

      {step !== 'upload' && <JourneyTracker currentStep={getTrackerStep(step)} />}

      {errorMessage && (
        <div className="app__error" role="alert">
          {errorMessage}
        </div>
      )}

      <main className="app__stage">
        {step === 'upload' && (
          <ImageUploader onPhotoConfirmed={handlePhotoConfirmed} isLoading={isLoadingCaptions} />
        )}

        {step !== 'upload' && (
          <div className="app__split">
            <PhotoAnchor imageUrl={previewUrl} theme={step === 'relationship' ? null : theme} />

            <div className="app__panel">
              {step === 'relationship' && (
                <RelationshipPicker
                  onConfirm={handleRelationshipConfirmed}
                  isLoading={isLoadingCaptions}
                />
              )}

              {step === 'captions' && (
                <CaptionGallery
                  theme={theme}
                  captions={captions}
                  onContinue={handleContinueToLanguage}
                />
              )}

              {step === 'language' && (
                <LanguagePicker
                  languages={languages}
                  theme={theme}
                  onSelectLanguage={handleSelectLanguage}
                  isLoading={isLoadingSongs}
                />
              )}

              {step === 'songs' && (
                <SongList
                  songs={songs}
                  theme={theme}
                  language={
                    languages.find((l) => l.code === selectedLanguage)?.label || selectedLanguage
                  }
                  onRestart={handleRestart}
                  onChangeLanguage={handleChangeLanguage}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app__footer">
        <p>Captions by Gemini · Songs via YouTube</p>
      </footer>
    </div>
  );
}

export default App;
