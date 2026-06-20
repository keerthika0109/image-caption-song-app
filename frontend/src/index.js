// ============================================
// src/index.js — React app entry point
// ============================================
// This is the file that React actually boots up first.
// It mounts our top-level <App /> component into the
// <div id="root"></div> found in public/index.html.

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
