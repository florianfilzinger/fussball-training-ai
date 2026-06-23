import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

// Der Einstiegspunkt der React‑Anwendung. Wir verwenden
// ReactDOM.createRoot, damit Concurrent Features ohne Probleme funktionieren.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);