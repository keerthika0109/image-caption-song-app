// ============================================
// src/components/SongList.jsx
// ============================================
// Responsibility: render the real song results fetched from
// YouTube, each linking out to the actual video.

import React from 'react';

function SongList({ songs, theme, language, onRestart, onChangeLanguage }) {
  if (!songs || songs.length === 0) {
    return (
      <div className="songs">
        <p className="songs__empty">
          No songs found for this combination yet. Try a different language.
        </p>
        <button className="btn btn--ghost" onClick={onChangeLanguage}>
          ← Try another language
        </button>
      </div>
    );
  }

  return (
    <div className="songs">
      <div className="songs__header">
        <span className="theme-tag">
          {theme} · {language}
        </span>
        <h2 className="songs__title">Songs for the mood</h2>
      </div>

      <div className="songs__list">
        {songs.map((song) => (
          <a
            key={song.videoId}
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="song-row"
          >
            <img src={song.thumbnail} alt="" className="song-row__thumb" />
            <div className="song-row__info">
              <p className="song-row__title">{song.title}</p>
              <p className="song-row__channel">{song.channel}</p>
            </div>
            <span className="song-row__play" aria-hidden="true">
              ▶
            </span>
          </a>
        ))}
      </div>

      <div className="songs__actions">
        <button className="btn btn--ghost" onClick={onChangeLanguage}>
          ← Try another language
        </button>
        <button className="btn btn--primary" onClick={onRestart}>
          Start over with a new photo
        </button>
      </div>
    </div>
  );
}

export default SongList;
