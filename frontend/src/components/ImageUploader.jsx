// ============================================
// src/components/ImageUploader.jsx
// ============================================
// Responsibility: let the user pick/drop a photo and show a live preview.
// Once they're happy with the photo, this hands off to the next step
// (the relationship picker) rather than generating captions directly.

import React, { useRef, useState } from 'react';

function ImageUploader({ onPhotoConfirmed, isLoading }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Shared handler for both <input> selection and drag-and-drop
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (JPEG, PNG, WEBP, or GIF).');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onPhotoConfirmed(selectedFile, previewUrl);
    }
  };

  return (
    <div className="uploader">
      <div
        className={`uploader__dropzone ${isDragOver ? 'uploader__dropzone--active' : ''} ${
          previewUrl ? 'uploader__dropzone--filled' : ''
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
        }}
        aria-label="Upload a photo"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Selected preview" className="uploader__preview" />
        ) : (
          <div className="uploader__placeholder">
            <span className="uploader__icon" aria-hidden="true">
              ⛰
            </span>
            <p className="uploader__hint-title">Drop a photo here</p>
            <p className="uploader__hint-sub">or click to browse — JPG, PNG, WEBP up to 10MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {previewUrl && (
        <div className="uploader__actions">
          <button
            className="btn btn--ghost"
            onClick={() => {
              setPreviewUrl(null);
              setSelectedFile(null);
            }}
            disabled={isLoading}
          >
            Choose another
          </button>
          <button className="btn btn--primary" onClick={handleSubmit} disabled={isLoading}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
