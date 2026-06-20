// ============================================
// server.js — Main backend entry point
// ============================================
// This file:
//   1. Loads environment variables (.env)
//   2. Sets up Express app + middleware (CORS, JSON parsing)
//   3. Wires up the two route groups: /api/caption and /api/songs
//   4. Starts the server
//
// Run with: npm start   (or  npm run dev  for auto-restart on changes)

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const captionRoutes = require('./routes/caption');
const songRoutes = require('./routes/songs');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------

// Allow requests from the React frontend only (CORS protection)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  })
);

// Parse incoming JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Serve uploaded images statically (useful for debugging/preview)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Routes ----------

// All caption-related endpoints live under /api/caption
app.use('/api/caption', captionRoutes);

// All song-related endpoints live under /api/songs
app.use('/api/songs', songRoutes);

// Simple health check endpoint — visit http://localhost:5000/api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running fine 🎉' });
});

// ---------- Fallback error handler ----------
// Catches errors thrown anywhere in routes and returns clean JSON
// instead of crashing the server or sending an HTML error page.
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Something went wrong on the server.',
    details: err.message,
  });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
