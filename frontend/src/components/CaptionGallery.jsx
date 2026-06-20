// ============================================
// src/components/CaptionGallery.jsx
// ============================================
// Responsibility: display the multiple AI-generated captions as
// selectable "note cards" pinned beside the photo, and let the user
// pick one favorite before moving to the song-discovery step.

import React, { useState } from 'react';

function CaptionGallery({ theme, captions, onContinue }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // Clipboard API may be unavailable (e.g. insecure context) — fail silently
    }
  };

  return (
    <div className="captions">
      <div className="captions__header">
        <span className="theme-tag">{theme}</span>
        <h2 className="captions__title">Pick a caption that feels right</h2>
        <p className="captions__sub">
          Six takes on your photo — pick your favorite, or just copy any one you like.
        </p>
      </div>

      <div className="captions__grid">
        {captions.map((caption, index) => (
          <button
            key={index}
            className={`caption-card ${selectedIndex === index ? 'caption-card--selected' : ''}`}
            onClick={() => setSelectedIndex(index)}
          >
            <p className="caption-card__text">{caption}</p>
            <div className="caption-card__footer">
              <span className="caption-card__pick">
                {selectedIndex === index ? '✓ Selected' : 'Select'}
              </span>
              <span
                className="caption-card__copy"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(caption, index);
                }}
              >
                {copiedIndex === index ? 'Copied!' : 'Copy'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="captions__continue">
        <button
          className="btn btn--primary"
          onClick={onContinue}
          disabled={selectedIndex === null}
        >
          Find songs to match →
        </button>
      </div>
    </div>
  );
}

export default CaptionGallery;
