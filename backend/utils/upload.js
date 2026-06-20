// ============================================
// utils/upload.js — Multer config for image uploads
// ============================================
// Multer is the standard Express middleware for handling
// multipart/form-data (i.e. file uploads from a <input type="file">).
//
// We store uploaded images temporarily in memory (not on disk) because
// we only need the image bytes briefly to send to the Claude Vision API.
// This keeps things simple and avoids cluttering the server's disk.

const multer = require('multer');

// Store the file in memory as a Buffer (req.file.buffer)
const storage = multer.memoryStorage();

// Only accept image files, and cap size at 10MB to avoid abuse
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

module.exports = upload;
