// ============================================
// src/components/JourneyTracker.jsx
// ============================================
// Signature element: a literal path showing where the user is in the
// journey from Photo -> Who -> Caption -> Song. This is meaningful here
// (not decorative) because the product genuinely is a sequence.

import React from 'react';

const STEPS = [
  { key: 'upload', label: 'Photo' },
  { key: 'relationship', label: 'Who' },
  { key: 'captions', label: 'Caption' },
  { key: 'songs', label: 'Song' },
];

function JourneyTracker({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="journey" aria-label="Progress">
      {STEPS.map((step, index) => (
        <React.Fragment key={step.key}>
          <div
            className={`journey__node ${index <= currentIndex ? 'journey__node--active' : ''} ${
              index === currentIndex ? 'journey__node--current' : ''
            }`}
          >
            <span className="journey__dot" />
            <span className="journey__label">{step.label}</span>
          </div>
          {index < STEPS.length - 1 && (
            <span
              className={`journey__connector ${
                index < currentIndex ? 'journey__connector--active' : ''
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default JourneyTracker;
