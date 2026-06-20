// ============================================
// src/components/RelationshipPicker.jsx
// ============================================
// Responsibility: ask the user who the main person in the photo is to
// them (sister, girlfriend, friend, etc.) before generating captions.
// This context can't be guessed from the image alone — the same photo
// of a girl needs a completely different caption tone depending on
// whether she's the user's sister or girlfriend, for example.

import React, { useState } from 'react';

const QUICK_OPTIONS = [
  { value: '', label: "Just the photo — no relation" },
  { value: 'sister', label: 'Sister' },
  { value: 'brother', label: 'Brother' },
  { value: 'girlfriend', label: 'Girlfriend' },
  { value: 'boyfriend', label: 'Boyfriend' },
  { value: 'wife', label: 'Wife' },
  { value: 'husband', label: 'Husband' },
  { value: 'friend', label: 'Friend' },
  { value: 'family', label: 'Family' },
  { value: 'mother', label: 'Mother' },
  { value: 'father', label: 'Father' },
];

function RelationshipPicker({ onConfirm, isLoading }) {
  const [selected, setSelected] = useState(null); // one of QUICK_OPTIONS.value, or "other"
  const [customText, setCustomText] = useState('');

  const isOtherSelected = selected === 'other';
  const canContinue =
    selected !== null && (!isOtherSelected || customText.trim().length > 0);

  const handleConfirm = () => {
    if (!canContinue) return;
    const relationship = isOtherSelected ? customText.trim() : selected;
    onConfirm(relationship);
  };

  return (
    <div className="relation">
      <div className="relation__header">
        <h2 className="relation__title">Who's in this photo?</h2>
        <p className="relation__sub">
          This helps us write captions with the right tone — a photo of your sister shouldn't
          sound romantic, and a photo of your girlfriend shouldn't sound like family chat.
        </p>
      </div>

      <div className="relation__grid">
        {QUICK_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            className={`relation-chip ${selected === opt.value ? 'relation-chip--selected' : ''}`}
            onClick={() => setSelected(opt.value)}
            disabled={isLoading}
          >
            {opt.label}
          </button>
        ))}

        <button
          className={`relation-chip ${isOtherSelected ? 'relation-chip--selected' : ''}`}
          onClick={() => setSelected('other')}
          disabled={isLoading}
        >
          Other…
        </button>
      </div>

      {isOtherSelected && (
        <input
          type="text"
          className="relation__input"
          placeholder="e.g. cousin, best friend, fiancée"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          maxLength={40}
          disabled={isLoading}
          autoFocus
        />
      )}

      <div className="relation__continue">
        <button
          className="btn btn--primary"
          onClick={handleConfirm}
          disabled={!canContinue || isLoading}
        >
          {isLoading ? 'Reading the scene…' : 'Generate captions'}
        </button>
      </div>
    </div>
  );
}

export default RelationshipPicker;
