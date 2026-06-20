// ============================================
// src/components/PhotoAnchor.jsx
// ============================================
// Signature element: the uploaded photo stays visible as a pinned
// Polaroid throughout the whole journey (caption step, song step),
// so the user always sees what everything is being generated from.

import React from 'react';

function PhotoAnchor({ imageUrl, theme }) {
  if (!imageUrl) return null;

  return (
    <div className="photo-anchor">
      <div className="photo-anchor__pin" aria-hidden="true" />
      <img src={imageUrl} alt="Your uploaded photo" className="photo-anchor__img" />
      {theme && <span className="photo-anchor__tag">{theme}</span>}
    </div>
  );
}

export default PhotoAnchor;
