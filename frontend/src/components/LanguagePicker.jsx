// ============================================
// src/components/LanguagePicker.jsx
// ============================================
// Responsibility: ask the user which language they want their
// song suggestions in, then trigger the song search.

import React from 'react';

function LanguagePicker({ languages, theme, onSelectLanguage, isLoading }) {
  return (
    <div className="lang-picker">
      <div className="lang-picker__header">
        <span className="theme-tag">{theme}</span>
        <h2 className="lang-picker__title">What language should the songs be in?</h2>
        <p className="lang-picker__sub">
          We'll find {theme}-themed songs sung in the language you choose.
        </p>
      </div>

      <div className="lang-picker__grid">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className="lang-chip"
            onClick={() => onSelectLanguage(lang.code)}
            disabled={isLoading}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="lang-picker__loading">Searching for the perfect tracks…</p>}
    </div>
  );
}

export default LanguagePicker;
